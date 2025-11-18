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

const EducationalFamilyPrograms = () => {
  const { toast } = useToast();

  // State for programs management
  const [programs, setPrograms] = useState([
    {
      id: "1",
      title: "برنامج الأسرة المسلمة",
      description:
        "برنامج متكامل لتعزيز قيم الأسرة المسلمة وتطوير العلاقات الأسرية",
      teacher: "الشيخ أحمد محمد",
      date: "2025-11-11",
      duration: "ساعتان",
      recording: "available",
      verses: "الروم 21",
    },
    {
      id: "2",
      title: "ورشة تربية الأبناء",
      description: "ورشة عمل عملية لآليات تربية الأبناء في ضوء الإسلام",
      teacher: "الشيخ خالد حسن",
      date: "2025-11-04",
      duration: "3 ساعات",
      recording: "available",
      verses: "الإسراء 23-25",
    },
    {
      id: "3",
      title: "لقاءات أولياء الأمور",
      description: "لقاءات دورية لمناقشة قضايا تربية الأبناء ومتابعتهم",
      teacher: "الشيخ محمد سعيد",
      date: "2025-10-28",
      duration: "ساعة ونصف",
      recording: "processing",
      verses: "التحريم 6",
    },
  ]);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  // Form state for new program
  const [newProgram, setNewProgram] = useState({
    title: "",
    description: "",
    teacher: "",
    duration: "",
    verses: "",
    recording: "processing",
  });

  // Functions for CRUD operations
  const handleAddProgram = () => {
    if (
      !newProgram.title ||
      !newProgram.description ||
      !newProgram.teacher ||
      !newProgram.duration ||
      !newProgram.verses
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const program = {
      id: Date.now().toString(),
      title: newProgram.title,
      description: newProgram.description,
      teacher: newProgram.teacher,
      date: new Date().toISOString().split("T")[0],
      duration: newProgram.duration,
      verses: newProgram.verses,
      recording: newProgram.recording,
    };

    setPrograms([...programs, program]);
    setNewProgram({
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
      description: "تم إضافة البرنامج بنجاح",
    });
  };

  const handleDeleteProgram = () => {
    if (!selectedProgram) return;

    setPrograms(
      programs.filter((program) => program.id !== selectedProgram.id)
    );
    setIsDeleteDialogOpen(false);
    setSelectedProgram(null);
    toast({
      title: "تم الحذف",
      description: "تم حذف البرنامج بنجاح",
    });
  };

  const openDeleteDialog = (program: any) => {
    setSelectedProgram(program);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="برامج الأسرة" showBack={true} />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 rounded-2xl shadow-[var(--shadow-soft)] flex-1">
            <h2 className="text-3xl font-bold mb-3">برامج الأسرة</h2>
            <p className="text-lg opacity-90">
              إشراك الأسرة في العملية التربوية وتعزيز العلاقات الأسرية
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground mr-4">
                إضافة برنامج جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>إضافة برنامج أسرة جديد</DialogTitle>
                <DialogDescription>
                  أدخل بيانات البرنامج الجديد في النموذج أدناه
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    عنوان البرنامج
                  </Label>
                  <Input
                    id="title"
                    value={newProgram.title}
                    onChange={(e) =>
                      setNewProgram({ ...newProgram, title: e.target.value })
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
                    value={newProgram.description}
                    onChange={(e) =>
                      setNewProgram({
                        ...newProgram,
                        description: e.target.value,
                      })
                    }
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="teacher" className="text-right">
                    المقدم
                  </Label>
                  <Input
                    id="teacher"
                    value={newProgram.teacher}
                    onChange={(e) =>
                      setNewProgram({ ...newProgram, teacher: e.target.value })
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
                    value={newProgram.duration}
                    onChange={(e) =>
                      setNewProgram({ ...newProgram, duration: e.target.value })
                    }
                    placeholder="مثال: ساعتان"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="verses" className="text-right">
                    الآيات
                  </Label>
                  <Input
                    id="verses"
                    value={newProgram.verses}
                    onChange={(e) =>
                      setNewProgram({ ...newProgram, verses: e.target.value })
                    }
                    placeholder="مثال: الروم 21"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recording" className="text-right">
                    التسجيل
                  </Label>
                  <Select
                    value={newProgram.recording}
                    onValueChange={(value) =>
                      setNewProgram({ ...newProgram, recording: value })
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
                <Button onClick={handleAddProgram}>إضافة البرنامج</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {programs.map((program) => (
            <Card key={program.id} className="border-r-4 border-r-primary">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{program.title}</CardTitle>
                  <Badge
                    variant={
                      program.recording === "available"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {program.recording === "available"
                      ? "متاح التسجيل"
                      : "قيد المعالجة"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {program.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">المقدم:</span>
                    <span>{program.teacher}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">التاريخ:</span>
                    <span>{program.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">المدة:</span>
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">الآيات:</span>
                    <span className="text-primary">{program.verses}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    {program.recording === "available"
                      ? "مشاهدة التسجيل"
                      : "قريباً"}
                  </Button>
                  <Button variant="outline">تحميل المادة</Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteDialog(program)}
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
              هل أنت متأكد من حذف البرنامج "{selectedProgram?.title}"؟ لا يمكن
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
            <Button variant="destructive" onClick={handleDeleteProgram}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EducationalFamilyPrograms;
