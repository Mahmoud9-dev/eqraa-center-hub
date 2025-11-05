import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import { ExamType, Exam, ExamResult } from "@/types";

const Exams = () => {
  const [activeTab, setActiveTab] = useState<ExamType>("قرآن");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const { toast } = useToast();

  // Mock data - will be replaced with actual data from Supabase
  const [exams, setExams] = useState<Exam[]>([
    {
      id: "1",
      type: "قرآن",
      title: "اختبار حفظ سورة البقرة",
      description: "اختبار حفظ سورة البقرة من الآية 1 إلى 100",
      date: new Date("2025-11-10"),
      duration: 60,
      totalMarks: 100,
      passingMarks: 60,
      createdBy: "teacher1",
      isActive: true,
      createdAt: new Date("2025-11-01"),
    },
    {
      id: "2",
      type: "قرآن",
      title: "اختبار مراجعة الجزء الأول",
      description: "اختبار شامل للجزء الأول من القرآن",
      date: new Date("2025-11-15"),
      duration: 90,
      totalMarks: 100,
      passingMarks: 70,
      createdBy: "teacher2",
      isActive: true,
      createdAt: new Date("2025-11-02"),
    },
    {
      id: "3",
      type: "تجويد",
      title: "اختبار أحكام النون الساكنة",
      description: "اختبار في أحكام النون الساكنة والتنوين",
      date: new Date("2025-11-12"),
      duration: 45,
      totalMarks: 50,
      passingMarks: 35,
      createdBy: "teacher1",
      isActive: true,
      createdAt: new Date("2025-11-03"),
    },
    {
      id: "4",
      type: "تربوي",
      title: "اختبار الآداب الإسلامية",
      description: "اختبار في الآداب الإسلامية العامة",
      date: new Date("2025-11-08"),
      duration: 60,
      totalMarks: 100,
      passingMarks: 60,
      createdBy: "teacher3",
      isActive: true,
      createdAt: new Date("2025-11-01"),
    },
  ]);

  const [examResults, setExamResults] = useState<ExamResult[]>([
    {
      id: "1",
      examId: "1",
      studentId: "student1",
      marks: 85,
      percentage: 85,
      status: "ناجح",
      notes: "أداء ممتاز",
      evaluatedBy: "teacher1",
      evaluatedAt: new Date("2025-11-10"),
    },
    {
      id: "2",
      examId: "1",
      studentId: "student2",
      marks: 45,
      percentage: 45,
      status: "راسب",
      notes: "يحتاج للمزيد من المراجعة",
      evaluatedBy: "teacher1",
      evaluatedAt: new Date("2025-11-10"),
    },
    {
      id: "3",
      examId: "3",
      studentId: "student3",
      marks: 40,
      percentage: 80,
      status: "ناجح",
      notes: "فهم جيد للأحكام",
      evaluatedBy: "teacher1",
      evaluatedAt: new Date("2025-11-12"),
    },
  ]);

  // Mock student data
  const students = {
    student1: "أحمد محمد علي",
    student2: "عمر خالد حسن",
    student3: "محمد سعيد أحمد",
  };

  // Mock teacher data
  const teachers = {
    teacher1: "الشيخ أحمد محمد",
    teacher2: "الشيخ خالد حسن",
    teacher3: "الشيخ محمد سعيد",
  };

  // Form state
  const [newExam, setNewExam] = useState<Partial<Exam>>({
    type: "قرآن",
    title: "",
    description: "",
    date: new Date(),
    duration: 60,
    totalMarks: 100,
    passingMarks: 60,
    isActive: true,
  });

  const [newResult, setNewResult] = useState<Partial<ExamResult>>({
    examId: "",
    studentId: "",
    marks: 0,
    percentage: 0,
    status: "ناجح",
    notes: "",
  });

  const filteredExams = exams.filter((exam) => exam.type === activeTab);
  const filteredResults = examResults.filter((result) => {
    const exam = exams.find((e) => e.id === result.examId);
    return exam && exam.type === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ناجح":
        return "bg-green-100 text-green-800";
      case "راسب":
        return "bg-red-100 text-red-800";
      case "غائب":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getExamStatusColor = (exam: Exam) => {
    const examDate = new Date(exam.date);
    const today = new Date();
    if (examDate < today) return "bg-gray-100 text-gray-800";
    if (examDate.toDateString() === today.toDateString())
      return "bg-blue-100 text-blue-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getExamStatusText = (exam: Exam) => {
    const examDate = new Date(exam.date);
    const today = new Date();
    if (examDate < today) return "منتهي";
    if (examDate.toDateString() === today.toDateString()) return "اليوم";
    return "قادم";
  };

  // CRUD functions
  const handleAddExam = () => {
    if (!newExam.title || !newExam.description || !newExam.date) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const exam: Exam = {
      id: Date.now().toString(),
      type: newExam.type as ExamType,
      title: newExam.title || "",
      description: newExam.description || "",
      date: newExam.date || new Date(),
      duration: newExam.duration || 60,
      totalMarks: newExam.totalMarks || 100,
      passingMarks: newExam.passingMarks || 60,
      createdBy: "current_user", // Will be replaced with actual user ID
      isActive: newExam.isActive || true,
      createdAt: new Date(),
    };

    setExams([...exams, exam]);
    setNewExam({
      type: "قرآن",
      title: "",
      description: "",
      date: new Date(),
      duration: 60,
      totalMarks: 100,
      passingMarks: 60,
      isActive: true,
    });
    setIsAddDialogOpen(false);
    toast({
      title: "تم الإضافة",
      description: "تم إضافة الامتحان بنجاح",
    });
  };

  const handleEditExam = () => {
    if (
      !selectedExam ||
      !newExam.title ||
      !newExam.description ||
      !newExam.date
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setExams(
      exams.map((exam) =>
        exam.id === selectedExam.id
          ? {
              ...exam,
              type: (newExam.type as ExamType) || exam.type,
              title: newExam.title || exam.title,
              description: newExam.description || exam.description,
              date: newExam.date || exam.date,
              duration: newExam.duration || exam.duration,
              totalMarks: newExam.totalMarks || exam.totalMarks,
              passingMarks: newExam.passingMarks || exam.passingMarks,
              isActive:
                newExam.isActive !== undefined
                  ? newExam.isActive
                  : exam.isActive,
            }
          : exam
      )
    );

    setIsEditDialogOpen(false);
    setSelectedExam(null);
    setNewExam({
      type: "قرآن",
      title: "",
      description: "",
      date: new Date(),
      duration: 60,
      totalMarks: 100,
      passingMarks: 60,
      isActive: true,
    });
    toast({
      title: "تم التعديل",
      description: "تم تعديل الامتحان بنجاح",
    });
  };

  const handleDeleteExam = () => {
    if (!selectedExam) return;

    setExams(exams.filter((exam) => exam.id !== selectedExam.id));
    setIsDeleteDialogOpen(false);
    setSelectedExam(null);
    toast({
      title: "تم الحذف",
      description: "تم حذف الامتحان بنجاح",
    });
  };

  const handleAddResult = () => {
    if (
      !newResult.examId ||
      !newResult.studentId ||
      newResult.marks === undefined
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const exam = exams.find((e) => e.id === newResult.examId);
    if (!exam) return;

    const percentage = Math.round((newResult.marks / exam.totalMarks) * 100);
    const status = percentage >= exam.passingMarks ? "ناجح" : "راسب";

    const result: ExamResult = {
      id: Date.now().toString(),
      examId: newResult.examId,
      studentId: newResult.studentId,
      marks: newResult.marks,
      percentage,
      status,
      notes: newResult.notes,
      evaluatedBy: "current_user", // Will be replaced with actual user ID
      evaluatedAt: new Date(),
    };

    setExamResults([...examResults, result]);
    setNewResult({
      examId: "",
      studentId: "",
      marks: 0,
      percentage: 0,
      status: "ناجح",
      notes: "",
    });
    setIsResultDialogOpen(false);
    toast({
      title: "تم الإضافة",
      description: "تم إضافة النتيجة بنجاح",
    });
  };

  const openEditDialog = (exam: Exam) => {
    setSelectedExam(exam);
    setNewExam({
      type: exam.type,
      title: exam.title,
      description: exam.description,
      date: exam.date,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      passingMarks: exam.passingMarks,
      isActive: exam.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (exam: Exam) => {
    setSelectedExam(exam);
    setIsDeleteDialogOpen(true);
  };

  const openResultDialog = (examId: string) => {
    setNewResult({ ...newResult, examId });
    setIsResultDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="الامتحانات والتقييم" showBack={true} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">📝 الاختبارات والتقييم</h2>
          <p className="text-muted-foreground mb-6">
            إدارة وتتبع امتحانات القرآن والتجويد والجانب التربوي
          </p>

          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4 space-x-reverse">
              <Input placeholder="البحث عن امتحان..." className="w-64" />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground">
                  إنشاء امتحان جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>إنشاء امتحان جديد</DialogTitle>
                  <DialogDescription>
                    أدخل بيانات الامتحان الجديد
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      النوع
                    </Label>
                    <Select
                      value={newExam.type}
                      onValueChange={(value) =>
                        setNewExam({ ...newExam, type: value as ExamType })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="قرآن">قرآن</SelectItem>
                        <SelectItem value="تجويد">تجويد</SelectItem>
                        <SelectItem value="تربوي">تربوي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      العنوان
                    </Label>
                    <Input
                      id="title"
                      value={newExam.title}
                      onChange={(e) =>
                        setNewExam({ ...newExam, title: e.target.value })
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
                      value={newExam.description}
                      onChange={(e) =>
                        setNewExam({ ...newExam, description: e.target.value })
                      }
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      التاريخ
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={newExam.date?.toISOString().split("T")[0]}
                      onChange={(e) =>
                        setNewExam({
                          ...newExam,
                          date: new Date(e.target.value),
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right">
                      المدة (دقائق)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newExam.duration}
                      onChange={(e) =>
                        setNewExam({
                          ...newExam,
                          duration: parseInt(e.target.value) || 60,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="totalMarks" className="text-right">
                      الدرجة الكاملة
                    </Label>
                    <Input
                      id="totalMarks"
                      type="number"
                      value={newExam.totalMarks}
                      onChange={(e) =>
                        setNewExam({
                          ...newExam,
                          totalMarks: parseInt(e.target.value) || 100,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="passingMarks" className="text-right">
                      درجة النجاح
                    </Label>
                    <Input
                      id="passingMarks"
                      type="number"
                      value={newExam.passingMarks}
                      onChange={(e) =>
                        setNewExam({
                          ...newExam,
                          passingMarks: parseInt(e.target.value) || 60,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    إلغاء
                  </Button>
                  <Button onClick={handleAddExam}>إنشاء امتحان</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ExamType)}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="قرآن">امتحانات القرآن</TabsTrigger>
            <TabsTrigger value="تجويد">امتحانات التجويد</TabsTrigger>
            <TabsTrigger value="تربوي">امتحانات تربوية</TabsTrigger>
            <TabsTrigger value="results">النتائج والإحصائيات</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {activeTab !== "results" &&
              activeTab !== "قرآن" &&
              activeTab !== "تجويد" &&
              activeTab !== "تربوي" && (
                <div className="space-y-6">
                  {/* عرض الامتحانات حسب الحالة */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["قادم", "اليوم", "منتهي"].map((status) => {
                      const statusExams = filteredExams.filter((exam) => {
                        const examDate = new Date(exam.date);
                        const today = new Date();

                        if (status === "قادم") return examDate > today;
                        if (status === "اليوم")
                          return (
                            examDate.toDateString() === today.toDateString()
                          );
                        if (status === "منتهي") return examDate < today;
                        return false;
                      });

                      if (statusExams.length === 0) return null;

                      return (
                        <Card
                          key={status}
                          className="border-r-4 border-r-primary/20"
                        >
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center justify-between">
                              <span>الامتحانات {status}</span>
                              <Badge variant="outline">
                                {statusExams.length} امتحان
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {statusExams.map((exam) => (
                              <div
                                key={exam.id}
                                className="p-3 border rounded-lg bg-muted/30"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-medium text-sm">
                                    {exam.title}
                                  </h5>
                                  <Badge className={getExamStatusColor(exam)}>
                                    {getExamStatusText(exam)}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground mb-2">
                                  {exam.description}
                                </div>
                                <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                                  <span>
                                    📅 {exam.date.toLocaleDateString("ar-SA")}
                                  </span>
                                  <span>⏱️ {exam.duration} دقيقة</span>
                                  <span>📊 {exam.totalMarks} درجة</span>
                                </div>
                                <div className="flex space-x-2 space-x-reverse">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openResultDialog(exam.id)}
                                    className="text-xs"
                                  >
                                    نتيجة
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditDialog(exam)}
                                    className="text-xs"
                                  >
                                    تعديل
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => openDeleteDialog(exam)}
                                    className="text-xs"
                                  >
                                    حذف
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* عرض جميع الامتحانات في جدول */}
                  <Card>
                    <CardHeader>
                      <CardTitle>جميع امتحانات {activeTab}</CardTitle>
                      <CardDescription>
                        عرض جميع الامتحانات في جدول واحد
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>عنوان الامتحان</TableHead>
                            <TableHead>التاريخ</TableHead>
                            <TableHead>المدة</TableHead>
                            <TableHead>الدرجة الكاملة</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredExams.map((exam) => (
                            <TableRow key={exam.id}>
                              <TableCell className="font-medium">
                                {exam.title}
                              </TableCell>
                              <TableCell>
                                {exam.date.toLocaleDateString("ar-SA")}
                              </TableCell>
                              <TableCell>{exam.duration} دقيقة</TableCell>
                              <TableCell>{exam.totalMarks}</TableCell>
                              <TableCell>
                                <Badge className={getExamStatusColor(exam)}>
                                  {getExamStatusText(exam)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2 space-x-reverse">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openResultDialog(exam.id)}
                                  >
                                    إضافة نتيجة
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditDialog(exam)}
                                  >
                                    تعديل
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => openDeleteDialog(exam)}
                                  >
                                    حذف
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>نتائج الامتحانات</CardTitle>
                  <CardDescription>
                    عرض نتائج الطلاب في جميع الامتحانات
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredResults.map((result) => {
                      const exam = exams.find((e) => e.id === result.examId);
                      return (
                        <div key={result.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">
                              {
                                students[
                                  result.studentId as keyof typeof students
                                ]
                              }
                            </h4>
                            <Badge className={getStatusColor(result.status)}>
                              {result.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {exam?.title} • {result.percentage}%
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm">
                              الدرجة: {result.marks}/{exam?.totalMarks}
                            </div>
                            <div className="flex space-x-2 space-x-reverse">
                              <Button variant="outline" size="sm">
                                تعديل
                              </Button>
                              <Button variant="destructive" size="sm">
                                حذف
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>إحصائيات الأداء</CardTitle>
                  <CardDescription>نظرة عامة على أداء الطلاب</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">معدل النجاح</h4>
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(
                          (filteredResults.filter((r) => r.status === "ناجح")
                            .length /
                            filteredResults.length) *
                            100
                        )}
                        %
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">متوسط الدرجات</h4>
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(
                          filteredResults.reduce(
                            (acc, r) => acc + r.percentage,
                            0
                          ) / filteredResults.length
                        )}
                        %
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">إجمالي الامتحانات</h4>
                      <div className="text-2xl font-bold text-purple-600">
                        {filteredExams.length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل الامتحان</DialogTitle>
            <DialogDescription>قم بتعديل بيانات الامتحان</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                النوع
              </Label>
              <Select
                value={newExam.type}
                onValueChange={(value) =>
                  setNewExam({ ...newExam, type: value as ExamType })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="قرآن">قرآن</SelectItem>
                  <SelectItem value="تجويد">تجويد</SelectItem>
                  <SelectItem value="تربوي">تربوي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                العنوان
              </Label>
              <Input
                id="edit-title"
                value={newExam.title}
                onChange={(e) =>
                  setNewExam({ ...newExam, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                الوصف
              </Label>
              <Textarea
                id="edit-description"
                value={newExam.description}
                onChange={(e) =>
                  setNewExam({ ...newExam, description: e.target.value })
                }
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-date" className="text-right">
                التاريخ
              </Label>
              <Input
                id="edit-date"
                type="date"
                value={newExam.date?.toISOString().split("T")[0]}
                onChange={(e) =>
                  setNewExam({ ...newExam, date: new Date(e.target.value) })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-duration" className="text-right">
                المدة (دقائق)
              </Label>
              <Input
                id="edit-duration"
                type="number"
                value={newExam.duration}
                onChange={(e) =>
                  setNewExam({
                    ...newExam,
                    duration: parseInt(e.target.value) || 60,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-totalMarks" className="text-right">
                الدرجة الكاملة
              </Label>
              <Input
                id="edit-totalMarks"
                type="number"
                value={newExam.totalMarks}
                onChange={(e) =>
                  setNewExam({
                    ...newExam,
                    totalMarks: parseInt(e.target.value) || 100,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-passingMarks" className="text-right">
                درجة النجاح
              </Label>
              <Input
                id="edit-passingMarks"
                type="number"
                value={newExam.passingMarks}
                onChange={(e) =>
                  setNewExam({
                    ...newExam,
                    passingMarks: parseInt(e.target.value) || 60,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleEditExam}>حفظ التعديلات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف الامتحان "{selectedExam?.title}"؟ لا يمكن
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
            <Button variant="destructive" onClick={handleDeleteExam}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Result Dialog */}
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إضافة نتيجة امتحان</DialogTitle>
            <DialogDescription>أدخل نتيجة الطالب في الامتحان</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student" className="text-right">
                الطالب
              </Label>
              <Select
                value={newResult.studentId}
                onValueChange={(value) =>
                  setNewResult({ ...newResult, studentId: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر الطالب" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(students).map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="marks" className="text-right">
                الدرجة
              </Label>
              <Input
                id="marks"
                type="number"
                value={newResult.marks}
                onChange={(e) =>
                  setNewResult({
                    ...newResult,
                    marks: parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                ملاحظات
              </Label>
              <Textarea
                id="notes"
                value={newResult.notes}
                onChange={(e) =>
                  setNewResult({ ...newResult, notes: e.target.value })
                }
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResultDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleAddResult}>إضافة نتيجة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Exams;
