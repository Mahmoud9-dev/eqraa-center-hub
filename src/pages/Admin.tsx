import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { teacherSchema } from "@/lib/validations";

interface Teacher {
  id: string;
  name: string;
  specialization: string;
  department: string;
  email?: string;
  phone?: string;
}

interface Student {
  id: string;
  name: string;
  age: number;
  department: string;
  parts_memorized: number;
}

const Admin = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teacherName, setTeacherName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [department, setDepartment] = useState<"quran" | "tajweed" | "tarbawi">(
    "quran"
  );
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    const { data: teachersData } = await supabase
      .from("teachers")
      .select("*")
      .order("name");

    const { data: studentsData } = await supabase
      .from("students")
      .select("*")
      .order("name");

    if (teachersData) setTeachers(teachersData as Teacher[]);
    if (studentsData) setStudents(studentsData as Student[]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    const validation = teacherSchema.safeParse({
      name: teacherName,
      specialization,
      department,
      email: email || "",
      phone: phone || "",
    });

    if (!validation.success) {
      const errors = validation.error.issues.map((e) => e.message).join(", ");
      toast({
        title: "خطأ في البيانات",
        description: errors,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.from("teachers").insert([
      {
        name: validation.data.name,
        specialization: validation.data.specialization,
        department: validation.data.department,
        email: validation.data.email || null,
        phone: validation.data.phone || null,
      },
    ]);

    if (error) {
      toast({
        title: "خطأ في إضافة المعلم",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "تم إضافة المعلم بنجاح" });
      setTeacherName("");
      setSpecialization("");
      setEmail("");
      setPhone("");
      loadData();
    }
    setIsLoading(false);
  };

  const getDepartmentLabel = (dept: string) => {
    const labels = {
      quran: "القرآن",
      tajweed: "التجويد",
      tarbawi: "التربوي",
    };
    return labels[dept as keyof typeof labels] || dept;
  };

  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const quranStudents = students.filter((s) => s.department === "quran").length;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="الإدارة" />
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-6">
              <div className="text-4xl mb-2">👥</div>
              <h3 className="text-lg font-semibold mb-1">إجمالي الطلاب</h3>
              <p className="text-4xl font-bold">{totalStudents}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground">
            <CardContent className="p-6">
              <div className="text-4xl mb-2">👨‍🏫</div>
              <h3 className="text-lg font-semibold mb-1">عدد المعلمين</h3>
              <p className="text-4xl font-bold">{totalTeachers}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent to-accent/80">
            <CardContent className="p-6">
              <div className="text-4xl mb-2">📖</div>
              <h3 className="text-lg font-semibold mb-1">طلاب التحفيظ</h3>
              <p className="text-4xl font-bold">{quranStudents}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="teachers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="teachers">المعلمون</TabsTrigger>
            <TabsTrigger value="students">الطلاب</TabsTrigger>
          </TabsList>

          <TabsContent value="teachers">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">
                    إضافة معلم جديد
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddTeacher} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        اسم المعلم
                      </label>
                      <Input
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                        placeholder="أدخل اسم المعلم"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        التخصص
                      </label>
                      <Input
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        placeholder="مثال: تحفيظ القرآن"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        القسم
                      </label>
                      <Select
                        value={department}
                        onValueChange={(v) => setDepartment(v as any)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quran">القرآن</SelectItem>
                          <SelectItem value="tajweed">التجويد</SelectItem>
                          <SelectItem value="tarbawi">التربوي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        البريد الإلكتروني (اختياري)
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="teacher@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        رقم الهاتف (اختياري)
                      </label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="05xxxxxxxx"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? "جاري الإضافة..." : "إضافة المعلم"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">
                  قائمة المعلمين
                </h3>
                {teachers.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      لا يوجد معلمون مسجلون بعد
                    </CardContent>
                  </Card>
                ) : (
                  teachers.map((teacher) => (
                    <Card
                      key={teacher.id}
                      className="border-r-4 border-r-primary"
                    >
                      <CardContent className="p-6">
                        <h4 className="font-bold text-lg mb-1">
                          {teacher.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-1">
                          {teacher.specialization}
                        </p>
                        <p className="text-sm text-primary font-medium mb-2">
                          قسم {getDepartmentLabel(teacher.department)}
                        </p>
                        {teacher.email && (
                          <p className="text-sm text-muted-foreground">
                            📧 {teacher.email}
                          </p>
                        )}
                        {teacher.phone && (
                          <p className="text-sm text-muted-foreground">
                            📱 {teacher.phone}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary mb-4">
                جميع الطلاب
              </h3>
              {students.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    لا يوجد طلاب مسجلون بعد
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((student) => (
                    <Card
                      key={student.id}
                      className="border-r-4 border-r-secondary"
                    >
                      <CardContent className="p-6">
                        <h4 className="font-bold text-lg mb-1">
                          {student.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          العمر: {student.age} سنة
                        </p>
                        <p className="text-sm text-primary font-medium mb-1">
                          {getDepartmentLabel(student.department)}
                        </p>
                        {student.department === "quran" && (
                          <p className="text-sm text-muted-foreground">
                            محفوظ: {student.parts_memorized} جزء
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
