'use client';

import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Teacher {
  id: string;
  name: string;
}

interface Student {
  id: string;
  name: string;
  age: number;
  parts_memorized: number;
  current_progress: string;
  teacher_id: string | null;
  teachers?: { name: string };
}

interface QuranSession {
  id: string;
  student_id: string;
  surah_name: string;
  verses_from: number;
  verses_to: number;
  performance_rating: number;
  session_date: string;
  students: { name: string };
}

const Quran = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [sessions, setSessions] = useState<QuranSession[]>([]);
  const [studentName, setStudentName] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [teacherSearchValue, setTeacherSearchValue] = useState("");
  const [openTeacherCombo, setOpenTeacherCombo] = useState(false);
  const [surahName, setSurahName] = useState("");
  const [versesFrom, setVersesFrom] = useState("");
  const [versesTo, setVersesTo] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [rating, setRating] = useState("5");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    const { data: studentsData } = await supabase
      .from("students")
      .select("*, teachers(name)")
      .eq("department", "quran")
      .order("name");

    const { data: teachersData } = await supabase
      .from("teachers")
      .select("*")
      .eq("department", "quran")
      .order("name");

    const { data: sessionsData } = await supabase
      .from("quran_sessions")
      .select("*, students(name)")
      .order("session_date", { ascending: false });

    if (studentsData) setStudents(studentsData as Student[]);
    if (teachersData) setTeachers(teachersData as Teacher[]);
    if (sessionsData) setSessions(sessionsData as QuranSession[]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentAge) return;

    setIsLoading(true);

    let teacherId = selectedTeacher;

    // إذا لم يكن هناك شيخ محدد ولكن هناك نص مكتوب، أضف الشيخ أولاً
    if (!teacherId && teacherSearchValue.trim()) {
      const { data: newTeacher, error: teacherError } = await supabase
        .from("teachers")
        .insert([
          {
            name: teacherSearchValue.trim(),
            department: "quran",
            specialization: "تحفيظ القرآن",
          },
        ])
        .select()
        .single();

      if (teacherError) {
        toast({ title: "خطأ في إضافة الشيخ", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      teacherId = newTeacher.id;
      toast({ title: "تم إضافة الشيخ الجديد" });
    }

    if (!teacherId) {
      toast({ title: "الرجاء اختيار أو إضافة شيخ", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.from("students").insert([
      {
        name: studentName,
        age: parseInt(studentAge),
        grade: "تحفيظ",
        department: "quran",
        teacher_id: teacherId,
        parts_memorized: 0,
        current_progress: "بداية الحفظ",
        previous_progress: "",
      },
    ]);

    if (error) {
      toast({ title: "خطأ في إضافة الطالب", variant: "destructive" });
    } else {
      toast({ title: "تم إضافة الطالب بنجاح" });
      setStudentName("");
      setStudentAge("");
      setSelectedTeacher("");
      setTeacherSearchValue("");
      loadData();
    }
    setIsLoading(false);
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !surahName || !versesFrom || !versesTo) return;

    setIsLoading(true);
    const { error } = await supabase.from("quran_sessions").insert([
      {
        student_id: selectedStudent,
        surah_name: surahName,
        verses_from: parseInt(versesFrom),
        verses_to: parseInt(versesTo),
        performance_rating: parseInt(rating),
      },
    ]);

    if (error) {
      toast({ title: "خطأ في إضافة الجلسة", variant: "destructive" });
    } else {
      toast({ title: "تم إضافة الجلسة بنجاح" });
      setSurahName("");
      setVersesFrom("");
      setVersesTo("");
      setRating("5");
      loadData();
    }
    setIsLoading(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({ title: "بدء التسجيل الصوتي" });
    } catch (error) {
      toast({
        title: "خطأ في التسجيل",
        description: "يرجى السماح بالوصول للميكروفون",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast({ title: "تم إيقاف التسجيل" });
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
      setIsPlaying(true);
      audio.addEventListener("ended", () => setIsPlaying(false));
    }
  };

  const pauseAudio = () => {
    setIsPlaying(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setAudioBlob(file);
      toast({ title: "تم رفع الملف الصوتي" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="القرآن الكريم" />
      <main className="container mx-auto px-4 py-12">
        <Tabs defaultValue="sessions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="sessions">جلسات التحفيظ</TabsTrigger>
            <TabsTrigger value="students">الطلاب</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">
                    تسجيل جلسة تحفيظ
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
                        className="w-full p-2 border rounded-md bg-background"
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
                        السورة
                      </label>
                      <Input
                        value={surahName}
                        onChange={(e) => setSurahName(e.target.value)}
                        placeholder="مثال: البقرة"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          من آية
                        </label>
                        <Input
                          type="number"
                          value={versesFrom}
                          onChange={(e) => setVersesFrom(e.target.value)}
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          إلى آية
                        </label>
                        <Input
                          type="number"
                          value={versesTo}
                          onChange={(e) => setVersesTo(e.target.value)}
                          min="1"
                          required
                        />
                      </div>
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
                      className="w-full"
                    >
                      {isLoading ? "جاري التسجيل..." : "تسجيل الجلسة"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">
                  الجلسات الأخيرة
                </h3>
                {sessions.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      لا توجد جلسات مسجلة بعد
                    </CardContent>
                  </Card>
                ) : (
                  sessions.slice(0, 10).map((session) => (
                    <Card
                      key={session.id}
                      className="border-r-4 border-r-primary"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-lg">
                            {session.students.name}
                          </h4>
                          <span className="text-sm bg-primary/10 px-3 py-1 rounded-full">
                            {session.performance_rating}/10
                          </span>
                        </div>
                        <p className="text-muted-foreground">
                          {session.surah_name} - الآيات {session.verses_from}{" "}
                          إلى {session.verses_to}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {new Date(session.session_date).toLocaleDateString(
                            "ar"
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">
                    إضافة طالب جديد
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddStudent} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        اسم الطالب
                      </label>
                      <Input
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="أدخل اسم الطالب"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        العمر
                      </label>
                      <Input
                        type="number"
                        value={studentAge}
                        onChange={(e) => setStudentAge(e.target.value)}
                        placeholder="أدخل عمر الطالب"
                        min="5"
                        max="100"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        الشيخ المحفظ
                      </label>
                      <Popover
                        open={openTeacherCombo}
                        onOpenChange={setOpenTeacherCombo}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openTeacherCombo}
                            className="w-full justify-between"
                          >
                            {selectedTeacher
                              ? teachers.find(
                                  (teacher) => teacher.id === selectedTeacher
                                )?.name
                              : teacherSearchValue ||
                                "اختر الشيخ أو اكتب الاسم..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command shouldFilter={false}>
                            <CommandInput
                              placeholder="ابحث عن الشيخ أو اكتب اسماً جديداً..."
                              value={teacherSearchValue}
                              onValueChange={setTeacherSearchValue}
                            />
                            <CommandList>
                              <CommandEmpty>
                                <div className="p-2 text-center">
                                  <p className="text-sm text-muted-foreground mb-2">
                                    لا يوجد شيخ بهذا الاسم
                                  </p>
                                  {teacherSearchValue && (
                                    <Button
                                      variant="ghost"
                                      className="w-full"
                                      onClick={() => {
                                        setSelectedTeacher("");
                                        setOpenTeacherCombo(false);
                                      }}
                                    >
                                      إضافة "{teacherSearchValue}" كشيخ جديد
                                    </Button>
                                  )}
                                </div>
                              </CommandEmpty>
                              <CommandGroup>
                                {teachers
                                  .filter((teacher) =>
                                    teacher.name
                                      .toLowerCase()
                                      .includes(
                                        teacherSearchValue.toLowerCase()
                                      )
                                  )
                                  .map((teacher) => (
                                    <CommandItem
                                      key={teacher.id}
                                      value={teacher.name}
                                      onSelect={() => {
                                        setSelectedTeacher(teacher.id);
                                        setTeacherSearchValue(teacher.name);
                                        setOpenTeacherCombo(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          selectedTeacher === teacher.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {teacher.name}
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? "جاري الإضافة..." : "إضافة الطالب"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">
                  قائمة الطلاب
                </h3>
                {students.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      لا يوجد طلاب مسجلين بعد
                    </CardContent>
                  </Card>
                ) : (
                  students.map((student) => (
                    <div key={student.id} className="space-y-4">
                      {/* المربع الرئيسي */}
                      <Card className="border-r-4 border-r-primary">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-lg">
                                {student.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                العمر: {student.age} سنة
                              </p>
                              {student.teachers && (
                                <p className="text-sm text-primary font-medium mt-1">
                                  الشيخ: {student.teachers.name}
                                </p>
                              )}
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium">
                                الأجزاء المحفوظة
                              </p>
                              <p className="text-2xl font-bold text-primary">
                                {student.parts_memorized}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {student.current_progress}
                          </p>
                        </CardContent>
                      </Card>

                      {/* المربعات الفرعية */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* الماضي القريب */}
                        <Card className="border-r-4 border-r-blue-500">
                          <CardContent className="p-4">
                            <h5 className="font-bold text-blue-700 mb-2">
                              الماضي القريب
                            </h5>
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="font-medium">السورة:</span>{" "}
                                البقرة
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">من آية:</span> 150
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">إلى آية:</span>{" "}
                                200
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* الماضي البعيد */}
                        <Card className="border-r-4 border-r-green-500">
                          <CardContent className="p-4">
                            <h5 className="font-bold text-green-700 mb-2">
                              الماضي البعيد
                            </h5>
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="font-medium">السورة:</span>{" "}
                                الفاتحة
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">من آية:</span> 1
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">إلى آية:</span> 7
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* الجديد */}
                        <Card className="border-r-4 border-r-orange-500">
                          <CardContent className="p-4">
                            <h5 className="font-bold text-orange-700 mb-2">
                              الجديد
                            </h5>
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="font-medium">السورة:</span> آل
                                عمران
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">من آية:</span> 50
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">إلى آية:</span>{" "}
                                100
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Quran;
