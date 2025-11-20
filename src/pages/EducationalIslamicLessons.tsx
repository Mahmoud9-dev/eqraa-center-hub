import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EducationalIslamicLessons = () => {
  const { toast } = useToast();

  // State for lessons management
  const [lessons, setLessons] = useState([
    {
      id: "1",
      title: "أصول العقيدة الإسلامية",
      description: "درس شامل عن أصول العقيدة وأركان الإيمان",
      teacher: "الشيخ أحمد محمد",
      date: "2025-11-15",
      duration: "45 دقيقة",
      recording: "available",
      verses: "البقرة 255-285",
    },
    {
      id: "2",
      title: "فقه العبادات",
      description: "أحكام الطهارة والصلاة والزكاة",
      teacher: "الشيخ خالد حسن",
      date: "2025-11-08",
      duration: "60 دقيقة",
      recording: "available",
      verses: "المائدة 6-11",
    },
    {
      id: "3",
      title: "سيرة النبي صلى الله عليه وسلم",
      description: "مراحل حياة النبي والدروس المستفادة",
      teacher: "الشيخ محمد سعيد",
      date: "2025-11-01",
      duration: "50 دقيقة",
      recording: "processing",
      verses: "آل عمران 144-148",
    },
  ]);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  // Form state for new lesson
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    teacher: "",
    duration: "",
    verses: "",
    recording: "processing",
  });

  // Functions for CRUD operations
  const handleAddLesson = () => {
    if (
      !newLesson.title ||
      !newLesson.description ||
      !newLesson.teacher ||
      !newLesson.duration ||
      !newLesson.verses
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const lesson = {
      id: Date.now().toString(),
      title: newLesson.title,
      description: newLesson.description,
      teacher: newLesson.teacher,
      date: new Date().toISOString().split("T")[0],
      duration: newLesson.duration,
      verses: newLesson.verses,
      recording: newLesson.recording,
    };

    setLessons([...lessons, lesson]);
    setNewLesson({
      title: "",
      description: "",
      teacher: "",
      duration: "",
      verses: "",
      recording: "processing",
    });
    setIsAddDialogOpen(false);
    toast({
      title: "تم الإضافة",
      description: "تم إضافة الدرس بنجاح",
    });
  };

  const handleDeleteLesson = () => {
    if (!selectedLesson) return;

    setLessons(lessons.filter((lesson) => lesson.id !== selectedLesson.id));
    setIsDeleteDialogOpen(false);
    setSelectedLesson(null);
    toast({
      title: "تم الحذف",
      description: "تم حذف الدرس بنجاح",
    });
  };

  const openDeleteDialog = (lesson: any) => {
    setSelectedLesson(lesson);
    setIsDeleteDialogOpen(true);
  };

  const handleViewRecording = (lesson: any) => {
    if (lesson.recording === "available") {
      toast({
        title: "فتح التسجيل",
        description: "جاري فتح تسجيل الدرس...",
      });
      // هنا يمكن إضافة رابط الفيديو أو فتح نافذة جديدة
      window.open("#", "_blank");
    } else {
      toast({
        title: "التسجيل غير متاح",
        description: "هذا الدرس قيد المعالجة وسيكون متاحاً قريباً",
        variant: "destructive",
      });
    }
  };

  const handleDownloadMaterial = (lesson: any) => {
    toast({
      title: "تحميل المادة",
      description: "جاري تحميل مادة الدرس...",
    });
    // هنا يمكن إضافة رابط التحميل
    const link = document.createElement("a");
    link.href = "#";
    link.download = `${lesson.title}.pdf`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="الدروس الشرعية" showBack={true} />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 rounded-2xl shadow-[var(--shadow-soft)] flex-1">
            <h2 className="text-3xl font-bold mb-3">الدروس الشرعية</h2>
            <p className="text-lg opacity-90">
              دروس متخصصة في العقيدة والفقه والسيرة النبوية
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground mr-4">
                إضافة درس جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>إضافة درس شرعي جديد</DialogTitle>
                <DialogDescription>
                  أدخل بيانات الدرس الجديد في النموذج أدناه
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    عنوان الدرس
                  </Label>
                  <Input
                    id="title"
                    value={newLesson.title}
                    onChange={(e) =>
                      setNewLesson({ ...newLesson, title: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    الوصف
                  </Label>
                  <Textarea
                    id="description"
                    value={newLesson.description}
                    onChange={(e) =>
                      setNewLesson({
                        ...newLesson,
                        description: e.target.value,
                      })
                    }
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="teacher" className="text-right">
                    المعلم
                  </Label>
                  <Input
                    id="teacher"
                    value={newLesson.teacher}
                    onChange={(e) =>
                      setNewLesson({ ...newLesson, teacher: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">
                    المدة
                  </Label>
                  <Input
                    id="duration"
                    value={newLesson.duration}
                    onChange={(e) =>
                      setNewLesson({ ...newLesson, duration: e.target.value })
                    }
                    placeholder="مثال: 45 دقيقة"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="verses" className="text-right">
                    الآيات
                  </Label>
                  <Input
                    id="verses"
                    value={newLesson.verses}
                    onChange={(e) =>
                      setNewLesson({ ...newLesson, verses: e.target.value })
                    }
                    placeholder="مثال: البقرة 255-285"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recording" className="text-right">
                    التسجيل
                  </Label>
                  <Select
                    value={newLesson.recording}
                    onValueChange={(value) =>
                      setNewLesson({ ...newLesson, recording: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="اختر حالة التسجيل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">متاح</SelectItem>
                      <SelectItem value="processing">قيد المعالجة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  إلغاء
                </Button>
                <Button onClick={handleAddLesson}>إضافة الدرس</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className="border-r-4 border-r-primary">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{lesson.title}</CardTitle>
                  <Badge
                    variant={
                      lesson.recording === "available" ? "default" : "secondary"
                    }
                  >
                    {lesson.recording === "available"
                      ? "متاح التسجيل"
                      : "قيد المعالجة"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {lesson.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">المعلم:</span>
                    <span>{lesson.teacher}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">التاريخ:</span>
                    <span>{lesson.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">المدة:</span>
                    <span>{lesson.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">الآيات:</span>
                    <span className="text-primary">{lesson.verses}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleViewRecording(lesson)}
                  >
                    {lesson.recording === "available"
                      ? "مشاهدة التسجيل"
                      : "قريباً"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadMaterial(lesson)}
                  >
                    تحميل المادة
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteDialog(lesson)}
                  >
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف الدرس "{selectedLesson?.title}"؟ لا يمكن
              التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteLesson}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EducationalIslamicLessons;
