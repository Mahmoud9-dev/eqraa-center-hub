import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
}

const Educational = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [grade, setGrade] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadStudents = async () => {
    const { data } = await supabase
      .from("students")
      .select("*")
      .eq("department", "tarbawi")
      .order("name");

    if (data) setStudents(data as Student[]);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !grade) return;

    setIsLoading(true);
    const { error } = await supabase.from("students").insert([
      {
        name,
        age: parseInt(age),
        grade,
        department: "tarbawi",
        parts_memorized: 0,
        current_progress: "مسجل في البرنامج التربوي",
        previous_progress: "",
      },
    ]);

    if (error) {
      toast({ title: "خطأ في إضافة الطالب", variant: "destructive" });
    } else {
      toast({ title: "تم إضافة الطالب بنجاح" });
      setName("");
      setAge("");
      setGrade("");
      loadStudents();
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="التربوي" />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 rounded-2xl shadow-[var(--shadow-soft)]">
          <h2 className="text-3xl font-bold mb-3">البرامج التربوية والتعليمية</h2>
          <p className="text-lg opacity-90">تطوير القيم الإسلامية والمهارات التربوية للطلاب</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">تسجيل طالب في البرنامج التربوي</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">اسم الطالب</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسم الطالب"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">العمر</label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="أدخل العمر"
                    min="5"
                    max="100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الصف الدراسي</label>
                  <Input
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="مثال: الصف الخامس"
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "جاري التسجيل..." : "تسجيل الطالب"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-primary">الطلاب المسجلون</h3>
            {students.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  لا يوجد طلاب مسجلين في البرنامج التربوي بعد
                </CardContent>
              </Card>
            ) : (
              students.map((student) => (
                <Card key={student.id} className="border-r-4 border-r-primary">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      العمر: {student.age} سنة - {student.grade}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-3 text-primary">الدروس الشرعية</h3>
            <p className="text-muted-foreground">دروس في العقيدة والفقه والسيرة النبوية</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">🤲</div>
            <h3 className="text-xl font-semibold mb-3 text-primary">الأخلاق والسلوك</h3>
            <p className="text-muted-foreground">تعزيز القيم الأخلاقية والسلوك الإسلامي</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-3 text-primary">المهارات الحياتية</h3>
            <p className="text-muted-foreground">تطوير مهارات التواصل والقيادة والعمل الجماعي</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">🌟</div>
            <h3 className="text-xl font-semibold mb-3 text-primary">الأنشطة الطلابية</h3>
            <p className="text-muted-foreground">مسابقات وفعاليات تربوية هادفة</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-xl font-semibold mb-3 text-primary">برامج الأسرة</h3>
            <p className="text-muted-foreground">إشراك الأسرة في العملية التربوية</p>
          </div>
          
          <div className="bg-card p-6 rounded-xl shadow-[var(--shadow-soft)] border border-border">
            <div className="text-5xl mb-4">💡</div>
            <h3 className="text-xl font-semibold mb-3 text-primary">الإرشاد والتوجيه</h3>
            <p className="text-muted-foreground">استشارات تربوية ونفسية للطلاب</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Educational;
