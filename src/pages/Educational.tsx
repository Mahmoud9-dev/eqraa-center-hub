import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IconButton from "@/components/IconButton";

interface Teacher {
  id: string;
  name: string;
}

interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
}

interface EducationalSession {
  id: string;
  student_id: string;
  teacher_id: string;
  topic: string;
  description: string;
  performance_rating: number;
  session_date: string;
  students: { name: string };
  teachers: { name: string };
}

const Educational = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [sessions, setSessions] = useState<EducationalSession[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [grade, setGrade] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("5");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    const { data: studentsData } = await supabase
      .from("students")
      .select("*")
      .eq("department", "tarbawi")
      .order("name");

    const { data: teachersData } = await supabase
      .from("teachers")
      .select("*")
      .eq("department", "tarbawi")
      .order("name");

    const { data: sessionsData } = await supabase
      .from("educational_sessions")
      .select("*, students(name), teachers(name)")
      .order("session_date", { ascending: false });

    if (studentsData) setStudents(studentsData as Student[]);
    if (teachersData) setTeachers(teachersData as Teacher[]);
    if (sessionsData) setSessions(sessionsData as EducationalSession[]);
  };

  useEffect(() => {
    loadData();
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
      loadData();
    }
    setIsLoading(false);
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedTeacher || !topic || !description) return;

    setIsLoading(true);
    const { error } = await supabase.from("educational_sessions").insert([
      {
        student_id: selectedStudent,
        teacher_id: selectedTeacher,
        topic,
        description,
        performance_rating: parseInt(rating),
      },
    ]);

    if (error) {
      toast({ title: "خطأ في إضافة الحلقة", variant: "destructive" });
    } else {
      toast({ title: "تم إضافة الحلقة بنجاح" });
      setSelectedStudent("");
      setSelectedTeacher("");
      setTopic("");
      setDescription("");
      setRating("5");
      loadData();
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="التربوي" />
      <main className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        <div className="mb-6 sm:mb-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-[var(--shadow-soft)]">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">
            البرامج التربوية والتعليمية
          </h2>
          <p className="text-sm sm:text-base md:text-lg opacity-90">
            تطوير القيم الإسلامية والمهارات التربوية للطلاب
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl md:text-2xl text-primary">
                  تسجيل حلقة تربوية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddSession} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الطالب
                    </label>
                    <select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="w-full p-2 border rounded-md bg-background text-base sm:text-sm"
                      required
                    >
                      <option value="">اختر الطالب</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      المعلم
                    </label>
                    <select
                      value={selectedTeacher}
                      onChange={(e) => setSelectedTeacher(e.target.value)}
                      className="w-full p-2 border rounded-md bg-background text-base sm:text-sm"
                      required
                    >
                      <option value="">اختر المعلم</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الموضوع
                    </label>
                    <Input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="مثال: الأخلاق الإسلامية"
                      className="text-base sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الوصف
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="وصف الحلقة..."
                      className="text-base sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      التقييم (1-10): {rating}
                    </label>
                    <input
                      type="range"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      min="1"
                      max="10"
                      className="w-full"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-base sm:text-sm py-3 sm:py-2"
                  >
                    {isLoading ? "جاري التسجيل..." : "تسجيل الحلقة"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl md:text-2xl text-primary">
                  تسجيل طالب في البرنامج التربوي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      اسم الطالب
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="أدخل اسم الطالب"
                      className="text-base sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      العمر
                    </label>
                    <Input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="أدخل العمر"
                      min="5"
                      max="100"
                      className="text-base sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الصف الدراسي
                    </label>
                    <Input
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="مثال: الصف الخامس"
                      className="text-base sm:text-sm"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-base sm:text-sm py-3 sm:py-2"
                  >
                    {isLoading ? "جاري التسجيل..." : "تسجيل الطالب"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                الطلاب المسجلون
              </h3>
              {students.length === 0 ? (
                <Card>
                  <CardContent className="p-4 sm:p-6 md:p-8 text-center text-muted-foreground">
                    لا يوجد طلاب مسجلين في البرنامج التربوي بعد
                  </CardContent>
                </Card>
              ) : (
                students.map((student) => (
                  <Card
                    key={student.id}
                    className="border-r-4 border-r-primary"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <h4 className="font-bold text-base sm:text-lg">
                        {student.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        العمر: {student.age} سنة - {student.grade}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
              الحلقات المسجلة
            </h3>
            {sessions.length === 0 ? (
              <Card>
                <CardContent className="p-4 sm:p-6 md:p-8 text-center text-muted-foreground">
                  لا توجد حلقات مسجلة بعد
                </CardContent>
              </Card>
            ) : (
              sessions.slice(0, 10).map((session) => (
                <Card key={session.id} className="border-r-4 border-r-primary">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                      <div>
                        <h4 className="font-bold text-base sm:text-lg mb-2 sm:mb-0">
                          {session.topic}
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          الطالب: {session.students.name}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          المعلم: {session.teachers.name}
                        </p>
                      </div>
                      <span className="text-xs sm:text-sm bg-primary/10 px-3 py-1 rounded-full">
                        {session.performance_rating}/10
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-2">
                      {session.description}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                      {new Date(session.session_date).toLocaleDateString("ar")}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <IconButton
            to="/educational/islamic-lessons"
            icon="📚"
            label="الدروس الشرعية"
            aria-label="فتح صفحة الدروس الشرعية"
          />

          <IconButton
            to="/educational/ethics-behavior"
            icon="🤲"
            label="الأخلاق والسلوك"
            aria-label="فتح صفحة الأخلاق والسلوك"
          />

          <IconButton
            to="/educational/life-skills"
            icon="🎯"
            label="المهارات الحياتية"
            aria-label="فتح صفحة المهارات الحياتية"
          />

          <IconButton
            to="/educational/student-activities"
            icon="🌟"
            label="الأنشطة الطلابية"
            aria-label="فتح صفحة الأنشطة الطلابية"
          />

          <IconButton
            to="/educational/family-programs"
            icon="👨‍👩‍👧‍👦"
            label="برامج الأسرة"
            aria-label="فتح صفحة برامج الأسرة"
          />

          <IconButton
            to="/educational/guidance-counseling"
            icon="💡"
            label="الإرشاد والتوجيه"
            aria-label="فتح صفحة الإرشاد والتوجيه"
          />
        </div>
      </main>
    </div>
  );
};

export default Educational;
