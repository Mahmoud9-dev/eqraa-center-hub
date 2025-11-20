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

const EducationalStudentActivities = () => {
  const { toast } = useToast();

  // State for activities management
  const [activities, setActivities] = useState([
    {
      id: "1",
      title: "مسابقة حفظ القرآن الكريم",
      description: "مسابقة سنوية لحفظ وتجويد القرآن الكريم بمختلف مستوياته",
      teacher: "الشيخ أحمد محمد",
      date: "2025-11-12",
      duration: "يوم كامل",
      recording: "available",
      verses: "المزمل 1-20",
    },
    {
      id: "2",
      title: "معسكر القيم الإسلامية",
      description: "معسكر تربوي لتعزيز القيم الإسلامية وبناء الشخصية",
      teacher: "الشيخ خالد حسن",
      date: "2025-11-05",
      duration: "3 أيام",
      recording: "available",
      verses: "الأنعام 151-153",
    },
    {
      id: "3",
      title: "مشروع الخدمة المجتمعية",
      description: "مشروع طلابي لخدمة المجتمع وتطبيق مبادئ الإسلام العملي",
      teacher: "الشيخ محمد سعيد",
      date: "2025-10-29",
      duration: "أسبوع",
      recording: "processing",
      verses: "البقرة 177",
    },
  ]);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  // Form state for new activity
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    teacher: "",
    duration: "",
    verses: "",
    recording: "processing",
  });

  // Functions for CRUD operations
  const handleAddActivity = () => {
    if (
      !newActivity.title ||
      !newActivity.description ||
      !newActivity.teacher ||
      !newActivity.duration ||
      !newActivity.verses
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const activity = {
      id: Date.now().toString(),
      title: newActivity.title,
      description: newActivity.description,
      teacher: newActivity.teacher,
      date: new Date().toISOString().split("T")[0],
      duration: newActivity.duration,
      verses: newActivity.verses,
      recording: newActivity.recording,
    };

    setActivities([...activities, activity]);
    setNewActivity({
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
      description: "تم إضافة النشاط بنجاح",
    });
  };

  const handleDeleteActivity = () => {
    if (!selectedActivity) return;

    setActivities(
      activities.filter((activity) => activity.id !== selectedActivity.id)
    );
    setIsDeleteDialogOpen(false);
    setSelectedActivity(null);
    toast({
      title: "تم الحذف",
      description: "تم حذف النشاط بنجاح",
    });
  };

  const openDeleteDialog = (activity: any) => {
    setSelectedActivity(activity);
    setIsDeleteDialogOpen(true);
  };

  const handleViewRecording = (activity: any) => {
    if (activity.recording === "available") {
      toast({
        title: "فتح التسجيل",
        description: "جاري فتح تسجيل النشاط...",
      });
      // هنا يمكن إضافة رابط الفيديو أو فتح نافذة جديدة
      window.open("#", "_blank");
    } else {
      toast({
        title: "التسجيل غير متاح",
        description: "هذا النشاط قيد المعالجة وسيكون متاحاً قريباً",
        variant: "destructive",
      });
    }
  };

  const handleDownloadMaterial = (activity: any) => {
    toast({
      title: "تحميل المادة",
      description: "جاري تحميل مادة النشاط...",
    });
    // هنا يمكن إضافة رابط التحميل
    const link = document.createElement("a");
    link.href = "#";
    link.download = `${activity.title}.pdf`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="الأنشطة الطلابية" showBack={true} />

      <main className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-[var(--shadow-soft)] flex-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">
              الأنشطة الطلابية
            </h2>
            <p className="text-sm sm:text-base md:text-lg opacity-90">
              مسابقات وفعاليات تربوية هادفة لتطوير مهارات الطلاب
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground w-full sm:w-auto">
                إضافة نشاط جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-base">
                  إضافة نشاط طلابي جديد
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-xs">
                  أدخل بيانات النشاط الجديد في النموذج أدناه
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="title" className="text-right sm:text-sm">
                    عنوان النشاط
                  </Label>
                  <Input
                    id="title"
                    value={newActivity.title}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, title: e.target.value })
                    }
                    className="col-span-1 sm:col-span-3 text-base sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
                  <Label
                    htmlFor="description"
                    className="text-right sm:text-sm sm:mt-2"
                  >
                    الوصف
                  </Label>
                  <Textarea
                    id="description"
                    value={newActivity.description}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        description: e.target.value,
                      })
                    }
                    className="col-span-1 sm:col-span-3 text-base sm:text-sm"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="teacher" className="text-right sm:text-sm">
                    المشرف
                  </Label>
                  <Input
                    id="teacher"
                    value={newActivity.teacher}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        teacher: e.target.value,
                      })
                    }
                    className="col-span-1 sm:col-span-3 text-base sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="duration" className="text-right sm:text-sm">
                    المدة
                  </Label>
                  <Input
                    id="duration"
                    value={newActivity.duration}
                    onChange={(e) =>
                      setNewActivity({
                        ...newActivity,
                        duration: e.target.value,
                      })
                    }
                    placeholder="مثال: يوم كامل"
                    className="col-span-1 sm:col-span-3 text-base sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="verses" className="text-right sm:text-sm">
                    الآيات
                  </Label>
                  <Input
                    id="verses"
                    value={newActivity.verses}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, verses: e.target.value })
                    }
                    placeholder="مثال: المزمل 1-20"
                    className="col-span-1 sm:col-span-3 text-base sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="recording" className="text-right sm:text-sm">
                    التسجيل
                  </Label>
                  <Select
                    value={newActivity.recording}
                    onValueChange={(value) =>
                      setNewActivity({ ...newActivity, recording: value })
                    }
                  >
                    <SelectTrigger className="col-span-1 sm:col-span-3 text-base sm:text-sm">
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
                  className="text-sm"
                >
                  إلغاء
                </Button>
                <Button onClick={handleAddActivity} className="text-sm">
                  إضافة النشاط
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {activities.map((activity) => (
            <Card key={activity.id} className="border-r-4 border-r-primary">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <CardTitle className="text-lg sm:text-xl">
                    {activity.title}
                  </CardTitle>
                  <Badge
                    variant={
                      activity.recording === "available"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {activity.recording === "available"
                      ? "متاح التسجيل"
                      : "قيد المعالجة"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                  {activity.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="font-medium">المشرف:</span>
                    <span>{activity.teacher}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="font-medium">التاريخ:</span>
                    <span>{activity.date}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="font-medium">المدة:</span>
                    <span>{activity.duration}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="font-medium">الآيات:</span>
                    <span className="text-primary">{activity.verses}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    className="flex-1 text-sm"
                    onClick={() => handleViewRecording(activity)}
                  >
                    {activity.recording === "available"
                      ? "مشاهدة التسجيل"
                      : "قريباً"}
                  </Button>
                  <Button
                    variant="outline"
                    className="text-sm"
                    onClick={() => handleDownloadMaterial(activity)}
                  >
                    تحميل المادة
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteDialog(activity)}
                    className="text-sm"
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
        <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-base">
              تأكيد الحذف
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-xs">
              هل أنت متأكد من حذف النشاط "{selectedActivity?.title}"؟ لا يمكن
              التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="text-sm"
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteActivity}
              className="text-sm"
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EducationalStudentActivities;
