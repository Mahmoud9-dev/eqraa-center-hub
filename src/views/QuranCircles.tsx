'use client';

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import { QuranCircle, CircleMember, MemorizationRecord } from "@/types";

const QuranCircles = () => {
  const [activeTab, setActiveTab] = useState("circles");
  const [isAddCircleDialogOpen, setIsAddCircleDialogOpen] = useState(false);
  const [isEditCircleDialogOpen, setIsEditCircleDialogOpen] = useState(false);
  const [isDeleteCircleDialogOpen, setIsDeleteCircleDialogOpen] =
    useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isAddRecordDialogOpen, setIsAddRecordDialogOpen] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState<QuranCircle | null>(
    null
  );
  const [selectedMember, setSelectedMember] = useState<CircleMember | null>(
    null
  );
  const { toast } = useToast();

  // Mock data - will be replaced with actual data from Supabase
  const [circles, setCircles] = useState<QuranCircle[]>([
    {
      id: "1",
      name: "حلقة حفظ القرآن الكريم - الصباحية",
      supervisorId: "teacher1",
      description: "حلقة متخصصة في حفظ القرآن الكريم للمرحلة الابتدائية",
      dailyMemorization: "صفحة واحدة يومياً",
      dailyRevision: "ربع صفحة يومياً",
      weeklyEvaluation: "اختبار شامل يوم الجمعة",
      isActive: true,
      createdAt: new Date("2025-09-01"),
    },
    {
      id: "2",
      name: "حلقة التجويد والقراءات",
      supervisorId: "teacher2",
      description: "حلقة متخصصة في تعليم أحكام التجويد والقراءات",
      dailyMemorization: "نصف صفحة مع التجويد",
      dailyRevision: "نصف صفحة مراجعة",
      weeklyEvaluation: "تقييم أداء القراءة",
      isActive: true,
      createdAt: new Date("2025-09-15"),
    },
    {
      id: "3",
      name: "حلقة المراجعة الشاملة",
      supervisorId: "teacher3",
      description: "حلقة لمراجعة ما تم حفظه من القرآن الكريم",
      dailyMemorization: "جزء واحد أسبوعياً",
      dailyRevision: "جزء واحد يومياً",
      weeklyEvaluation: "اختبار شامل للمحفوظ",
      isActive: true,
      createdAt: new Date("2025-10-01"),
    },
  ]);

  const [circleMembers, setCircleMembers] = useState<CircleMember[]>([
    {
      id: "1",
      circleId: "1",
      studentId: "student1",
      joinDate: new Date("2025-09-01"),
      isActive: true,
    },
    {
      id: "2",
      circleId: "1",
      studentId: "student2",
      joinDate: new Date("2025-09-05"),
      isActive: true,
    },
    {
      id: "3",
      circleId: "2",
      studentId: "student3",
      joinDate: new Date("2025-09-15"),
      isActive: true,
    },
  ]);

  const [memorizationRecords, setMemorizationRecords] = useState<
    MemorizationRecord[]
  >([
    {
      id: "1",
      studentId: "student1",
      circleId: "1",
      date: new Date("2025-11-01"),
      surahName: "سورة البقرة",
      versesFrom: 1,
      versesTo: 10,
      memorizationType: "حفظ جديد",
      evaluation: 9,
      notes: "حفظ ممتاز وأداء جيد",
      evaluatedBy: "teacher1",
    },
    {
      id: "2",
      studentId: "student2",
      circleId: "1",
      date: new Date("2025-11-02"),
      surahName: "سورة آل عمران",
      versesFrom: 1,
      versesTo: 5,
      memorizationType: "مراجعة",
      evaluation: 8,
      notes: "مراجعة جيدة تحتاج لبعض التحسين",
      evaluatedBy: "teacher1",
    },
    {
      id: "3",
      studentId: "student3",
      circleId: "2",
      date: new Date("2025-11-03"),
      surahName: "سورة الفاتحة",
      versesFrom: 1,
      versesTo: 7,
      memorizationType: "حفظ جديد",
      evaluation: 10,
      notes: "حفظ ممتاز وتجويد متقن",
      evaluatedBy: "teacher2",
    },
  ]);

  // Mock data for display
  const students = {
    student1: "أحمد محمد علي",
    student2: "عمر خالد حسن",
    student3: "محمد سعيد أحمد",
  };

  const teachers = {
    teacher1: "الشيخ أحمد محمد",
    teacher2: "الشيخ خالد حسن",
    teacher3: "الشيخ محمد سعيد",
  };

  // Form state
  const [newCircle, setNewCircle] = useState<Partial<QuranCircle>>({
    name: "",
    supervisorId: "",
    description: "",
    dailyMemorization: "",
    dailyRevision: "",
    weeklyEvaluation: "",
    isActive: true,
  });

  const [newMember, setNewMember] = useState<Partial<CircleMember>>({
    circleId: "",
    studentId: "",
    isActive: true,
  });

  const [newRecord, setNewRecord] = useState<Partial<MemorizationRecord>>({
    studentId: "",
    circleId: "",
    date: new Date(),
    surahName: "",
    versesFrom: 1,
    versesTo: 1,
    memorizationType: "حفظ جديد",
    evaluation: 0,
    notes: "",
  });

  const getEvaluationColor = (evaluation: number) => {
    if (evaluation >= 9) return "bg-green-100 text-green-800";
    if (evaluation >= 7) return "bg-blue-100 text-blue-800";
    if (evaluation >= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getMemorizationTypeColor = (type: string) => {
    return type === "حفظ جديد"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";
  };

  // CRUD functions
  const handleAddCircle = () => {
    if (!newCircle.name || !newCircle.supervisorId) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const circle: QuranCircle = {
      id: Date.now().toString(),
      name: newCircle.name || "",
      supervisorId: newCircle.supervisorId || "",
      description: newCircle.description,
      dailyMemorization: newCircle.dailyMemorization || "",
      dailyRevision: newCircle.dailyRevision || "",
      weeklyEvaluation: newCircle.weeklyEvaluation || "",
      isActive: newCircle.isActive || true,
      createdAt: new Date(),
    };

    setCircles([...circles, circle]);
    setNewCircle({
      name: "",
      supervisorId: "",
      description: "",
      dailyMemorization: "",
      dailyRevision: "",
      weeklyEvaluation: "",
      isActive: true,
    });
    setIsAddCircleDialogOpen(false);
    toast({
      title: "تم الإضافة",
      description: "تم إضافة الحلقة بنجاح",
    });
  };

  const handleEditCircle = () => {
    if (!selectedCircle || !newCircle.name || !newCircle.supervisorId) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setCircles(
      circles.map((circle) =>
        circle.id === selectedCircle.id
          ? {
              ...circle,
              name: newCircle.name || circle.name,
              supervisorId: newCircle.supervisorId || circle.supervisorId,
              description: newCircle.description || circle.description,
              dailyMemorization:
                newCircle.dailyMemorization || circle.dailyMemorization,
              dailyRevision: newCircle.dailyRevision || circle.dailyRevision,
              weeklyEvaluation:
                newCircle.weeklyEvaluation || circle.weeklyEvaluation,
              isActive:
                newCircle.isActive !== undefined
                  ? newCircle.isActive
                  : circle.isActive,
            }
          : circle
      )
    );

    setIsEditCircleDialogOpen(false);
    setSelectedCircle(null);
    setNewCircle({
      name: "",
      supervisorId: "",
      description: "",
      dailyMemorization: "",
      dailyRevision: "",
      weeklyEvaluation: "",
      isActive: true,
    });
    toast({
      title: "تم التعديل",
      description: "تم تعديل الحلقة بنجاح",
    });
  };

  const handleDeleteCircle = () => {
    if (!selectedCircle) return;

    setCircles(circles.filter((circle) => circle.id !== selectedCircle.id));
    setIsDeleteCircleDialogOpen(false);
    setSelectedCircle(null);
    toast({
      title: "تم الحذف",
      description: "تم حذف الحلقة بنجاح",
    });
  };

  const handleAddMember = () => {
    if (!newMember.circleId || !newMember.studentId) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار الحلقة والطالب",
        variant: "destructive",
      });
      return;
    }

    const member: CircleMember = {
      id: Date.now().toString(),
      circleId: newMember.circleId || "",
      studentId: newMember.studentId || "",
      joinDate: new Date(),
      isActive: newMember.isActive || true,
    };

    setCircleMembers([...circleMembers, member]);
    setNewMember({
      circleId: "",
      studentId: "",
      isActive: true,
    });
    setIsAddMemberDialogOpen(false);
    toast({
      title: "تم الإضافة",
      description: "تم إضافة الطالب للحلقة بنجاح",
    });
  };

  const handleAddRecord = () => {
    if (!newRecord.studentId || !newRecord.circleId || !newRecord.surahName) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const record: MemorizationRecord = {
      id: Date.now().toString(),
      studentId: newRecord.studentId || "",
      circleId: newRecord.circleId || "",
      date: newRecord.date || new Date(),
      surahName: newRecord.surahName || "",
      versesFrom: newRecord.versesFrom || 1,
      versesTo: newRecord.versesTo || 1,
      memorizationType:
        (newRecord.memorizationType as "حفظ جديد" | "مراجعة") || "حفظ جديد",
      evaluation: newRecord.evaluation || 0,
      notes: newRecord.notes,
      evaluatedBy: "current_user", // Will be replaced with actual user ID
    };

    setMemorizationRecords([...memorizationRecords, record]);
    setNewRecord({
      studentId: "",
      circleId: "",
      date: new Date(),
      surahName: "",
      versesFrom: 1,
      versesTo: 1,
      memorizationType: "حفظ جديد",
      evaluation: 0,
      notes: "",
    });
    setIsAddRecordDialogOpen(false);
    toast({
      title: "تم الإضافة",
      description: "تم إضافة سجل الحفظ بنجاح",
    });
  };

  const openEditCircleDialog = (circle: QuranCircle) => {
    setSelectedCircle(circle);
    setNewCircle({
      name: circle.name,
      supervisorId: circle.supervisorId,
      description: circle.description,
      dailyMemorization: circle.dailyMemorization,
      dailyRevision: circle.dailyRevision,
      weeklyEvaluation: circle.weeklyEvaluation,
      isActive: circle.isActive,
    });
    setIsEditCircleDialogOpen(true);
  };

  const openDeleteCircleDialog = (circle: QuranCircle) => {
    setSelectedCircle(circle);
    setIsDeleteCircleDialogOpen(true);
  };

  const getCircleMembers = (circleId: string) => {
    return circleMembers.filter((member) => member.circleId === circleId);
  };

  const getStudentRecords = (studentId: string) => {
    return memorizationRecords.filter(
      (record) => record.studentId === studentId
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="حلقات القرآن" showBack={true} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">📖 حلقات القرآن</h2>
          <p className="text-muted-foreground mb-6">
            إدارة حلقات القرآن ومتابعة تقدم الطلاب في الحفظ والمراجعة
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
            <div className="w-full sm:w-auto">
              <Input placeholder="البحث عن حلقة..." className="w-full sm:w-64" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Dialog
                open={isAddMemberDialogOpen}
                onOpenChange={setIsAddMemberDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">إضافة طالب</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>إضافة طالب لحلقة</DialogTitle>
                    <DialogDescription>
                      اختر الحلقة والطالب المراد إضافته
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="circle" className="text-right">
                        الحلقة
                      </Label>
                      <Select
                        value={newMember.circleId}
                        onValueChange={(value) =>
                          setNewMember({ ...newMember, circleId: value })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="اختر الحلقة" />
                        </SelectTrigger>
                        <SelectContent>
                          {circles.map((circle) => (
                            <SelectItem key={circle.id} value={circle.id}>
                              {circle.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="student" className="text-right">
                        الطالب
                      </Label>
                      <Select
                        value={newMember.studentId}
                        onValueChange={(value) =>
                          setNewMember({ ...newMember, studentId: value })
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
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddMemberDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button onClick={handleAddMember}>إضافة طالب</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isAddCircleDialogOpen}
                onOpenChange={setIsAddCircleDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground">
                    إنشاء حلقة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>إنشاء حلقة جديدة</DialogTitle>
                    <DialogDescription>
                      أدخل بيانات الحلقة الجديدة
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        اسم الحلقة
                      </Label>
                      <Input
                        id="name"
                        value={newCircle.name}
                        onChange={(e) =>
                          setNewCircle({ ...newCircle, name: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="supervisor" className="text-right">
                        المشرف
                      </Label>
                      <Select
                        value={newCircle.supervisorId}
                        onValueChange={(value) =>
                          setNewCircle({ ...newCircle, supervisorId: value })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="اختر المشرف" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(teachers).map(([id, name]) => (
                            <SelectItem key={id} value={id}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        الوصف
                      </Label>
                      <Textarea
                        id="description"
                        value={newCircle.description}
                        onChange={(e) =>
                          setNewCircle({
                            ...newCircle,
                            description: e.target.value,
                          })
                        }
                        className="col-span-3"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="dailyMemorization" className="text-right">
                        ورد الحفظ اليومي
                      </Label>
                      <Input
                        id="dailyMemorization"
                        value={newCircle.dailyMemorization}
                        onChange={(e) =>
                          setNewCircle({
                            ...newCircle,
                            dailyMemorization: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="dailyRevision" className="text-right">
                        ورد المراجعة اليومي
                      </Label>
                      <Input
                        id="dailyRevision"
                        value={newCircle.dailyRevision}
                        onChange={(e) =>
                          setNewCircle({
                            ...newCircle,
                            dailyRevision: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="weeklyEvaluation" className="text-right">
                        التقييم الأسبوعي
                      </Label>
                      <Input
                        id="weeklyEvaluation"
                        value={newCircle.weeklyEvaluation}
                        onChange={(e) =>
                          setNewCircle({
                            ...newCircle,
                            weeklyEvaluation: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddCircleDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button onClick={handleAddCircle}>إنشاء حلقة</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="circles">الحلقات</TabsTrigger>
            <TabsTrigger value="members">الأعضاء</TabsTrigger>
            <TabsTrigger value="records">سجلات الحفظ</TabsTrigger>
          </TabsList>

          <TabsContent value="circles" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>قائمة الحلقات</CardTitle>
                <CardDescription>عرض وإدارة جميع حلقات القرآن</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mobile Card View */}
                <div className="block md:hidden space-y-4">
                  {circles.map((circle) => (
                    <div key={circle.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm leading-tight">{circle.name}</h4>
                        <Badge
                          className={`text-xs shrink-0 ${
                            circle.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {circle.isActive ? "نشطة" : "غير نشطة"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        المشرف: {teachers[circle.supervisorId as keyof typeof teachers]}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-muted rounded">
                          <span className="text-muted-foreground">ورد الحفظ:</span>
                          <div className="font-medium">{circle.dailyMemorization}</div>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <span className="text-muted-foreground">ورد المراجعة:</span>
                          <div className="font-medium">{circle.dailyRevision}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        عدد الأعضاء: {getCircleMembers(circle.id).length}
                      </div>
                      <div className="flex gap-2 pt-2 border-t">
                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                          عرض
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => openEditCircleDialog(circle)}
                        >
                          تعديل
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => openDeleteCircleDialog(circle)}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>اسم الحلقة</TableHead>
                        <TableHead>المشرف</TableHead>
                        <TableHead className="hidden lg:table-cell">ورد الحفظ</TableHead>
                        <TableHead className="hidden lg:table-cell">ورد المراجعة</TableHead>
                        <TableHead>عدد الأعضاء</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {circles.map((circle) => (
                        <TableRow key={circle.id}>
                          <TableCell className="font-medium max-w-[150px] truncate">
                            {circle.name}
                          </TableCell>
                          <TableCell>
                            {
                              teachers[
                                circle.supervisorId as keyof typeof teachers
                              ]
                            }
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{circle.dailyMemorization}</TableCell>
                          <TableCell className="hidden lg:table-cell">{circle.dailyRevision}</TableCell>
                          <TableCell>
                            {getCircleMembers(circle.id).length}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                circle.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {circle.isActive ? "نشطة" : "غير نشطة"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" className="text-xs px-2">
                                عرض
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs px-2"
                                onClick={() => openEditCircleDialog(circle)}
                              >
                                تعديل
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="text-xs px-2"
                                onClick={() => openDeleteCircleDialog(circle)}
                              >
                                حذف
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {circles.map((circle) => (
                <Card key={circle.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 space-x-reverse">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {circle.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{circle.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {
                            teachers[
                              circle.supervisorId as keyof typeof teachers
                            ]
                          }
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">أعضاء الحلقة</h4>
                        <div className="space-y-2">
                          {getCircleMembers(circle.id).map((member) => (
                            <div
                              key={member.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded gap-3"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8 shrink-0">
                                  <AvatarImage src="" />
                                  <AvatarFallback className="text-xs">
                                    {students[
                                      member.studentId as keyof typeof students
                                    ]
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <div className="font-medium text-sm truncate">
                                    {
                                      students[
                                        member.studentId as keyof typeof students
                                      ]
                                    }
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    انضم:{" "}
                                    {member.joinDate.toLocaleDateString(
                                      "ar-SA"
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 sm:shrink-0">
                                <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs">
                                  تعديل
                                </Button>
                                <Button variant="destructive" size="sm" className="flex-1 sm:flex-none text-xs">
                                  حذف
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="records" className="mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-lg font-medium">سجلات الحفظ والمراجعة</h3>
              <Dialog
                open={isAddRecordDialogOpen}
                onOpenChange={setIsAddRecordDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>إضافة سجل جديد</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>إضافة سجل حفظ جديد</DialogTitle>
                    <DialogDescription>
                      أدخل بيانات سجل الحفظ الجديد
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="record-circle" className="text-right">
                        الحلقة
                      </Label>
                      <Select
                        value={newRecord.circleId}
                        onValueChange={(value) =>
                          setNewRecord({ ...newRecord, circleId: value })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="اختر الحلقة" />
                        </SelectTrigger>
                        <SelectContent>
                          {circles.map((circle) => (
                            <SelectItem key={circle.id} value={circle.id}>
                              {circle.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="record-student" className="text-right">
                        الطالب
                      </Label>
                      <Select
                        value={newRecord.studentId}
                        onValueChange={(value) =>
                          setNewRecord({ ...newRecord, studentId: value })
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
                      <Label htmlFor="surah" className="text-right">
                        السورة
                      </Label>
                      <Input
                        id="surah"
                        value={newRecord.surahName}
                        onChange={(e) =>
                          setNewRecord({
                            ...newRecord,
                            surahName: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="from" className="text-right">
                        من آية
                      </Label>
                      <Input
                        id="from"
                        type="number"
                        value={newRecord.versesFrom}
                        onChange={(e) =>
                          setNewRecord({
                            ...newRecord,
                            versesFrom: parseInt(e.target.value) || 1,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="to" className="text-right">
                        إلى آية
                      </Label>
                      <Input
                        id="to"
                        type="number"
                        value={newRecord.versesTo}
                        onChange={(e) =>
                          setNewRecord({
                            ...newRecord,
                            versesTo: parseInt(e.target.value) || 1,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        النوع
                      </Label>
                      <Select
                        value={newRecord.memorizationType}
                        onValueChange={(value) =>
                          setNewRecord({
                            ...newRecord,
                            memorizationType: value as "حفظ جديد" | "مراجعة",
                          })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="حفظ جديد">حفظ جديد</SelectItem>
                          <SelectItem value="مراجعة">مراجعة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="evaluation" className="text-right">
                        التقييم (من 10)
                      </Label>
                      <Input
                        id="evaluation"
                        type="number"
                        min="1"
                        max="10"
                        value={newRecord.evaluation}
                        onChange={(e) =>
                          setNewRecord({
                            ...newRecord,
                            evaluation: parseInt(e.target.value) || 0,
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
                        value={newRecord.notes}
                        onChange={(e) =>
                          setNewRecord({ ...newRecord, notes: e.target.value })
                        }
                        className="col-span-3"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddRecordDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button onClick={handleAddRecord}>إضافة سجل</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>سجلات الحفظ</CardTitle>
                <CardDescription>
                  عرض جميع سجلات الحفظ والمراجعة للطلاب
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mobile Card View */}
                <div className="block md:hidden space-y-4">
                  {memorizationRecords.map((record) => (
                    <div key={record.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-sm">
                            {students[record.studentId as keyof typeof students]}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {circles.find((c) => c.id === record.circleId)?.name}
                          </p>
                        </div>
                        <Badge className={`${getEvaluationColor(record.evaluation)} text-xs shrink-0`}>
                          {record.evaluation}/10
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${getMemorizationTypeColor(record.memorizationType)} text-xs`}>
                          {record.memorizationType}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {record.surahName} ({record.versesFrom} - {record.versesTo})
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {record.date.toLocaleDateString("ar-SA")}
                      </div>
                      <div className="flex gap-2 pt-2 border-t">
                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                          تعديل
                        </Button>
                        <Button variant="destructive" size="sm" className="flex-1 text-xs">
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الطالب</TableHead>
                        <TableHead className="hidden lg:table-cell">الحلقة</TableHead>
                        <TableHead>السورة</TableHead>
                        <TableHead>الآيات</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>التقييم</TableHead>
                        <TableHead className="hidden lg:table-cell">التاريخ</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {memorizationRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="max-w-[120px] truncate">
                            {students[record.studentId as keyof typeof students]}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell max-w-[120px] truncate">
                            {circles.find((c) => c.id === record.circleId)?.name}
                          </TableCell>
                          <TableCell>{record.surahName}</TableCell>
                          <TableCell>
                            {record.versesFrom} - {record.versesTo}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getMemorizationTypeColor(
                                record.memorizationType
                              )}
                            >
                              {record.memorizationType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getEvaluationColor(record.evaluation)}
                            >
                              {record.evaluation}/10
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {record.date.toLocaleDateString("ar-SA")}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" className="text-xs px-2">
                                تعديل
                              </Button>
                              <Button variant="destructive" size="sm" className="text-xs px-2">
                                حذف
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Circle Dialog */}
      <Dialog
        open={isEditCircleDialogOpen}
        onOpenChange={setIsEditCircleDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل الحلقة</DialogTitle>
            <DialogDescription>قم بتعديل بيانات الحلقة</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                اسم الحلقة
              </Label>
              <Input
                id="edit-name"
                value={newCircle.name}
                onChange={(e) =>
                  setNewCircle({ ...newCircle, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-supervisor" className="text-right">
                المشرف
              </Label>
              <Select
                value={newCircle.supervisorId}
                onValueChange={(value) =>
                  setNewCircle({ ...newCircle, supervisorId: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر المشرف" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(teachers).map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                الوصف
              </Label>
              <Textarea
                id="edit-description"
                value={newCircle.description}
                onChange={(e) =>
                  setNewCircle({ ...newCircle, description: e.target.value })
                }
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-dailyMemorization" className="text-right">
                ورد الحفظ اليومي
              </Label>
              <Input
                id="edit-dailyMemorization"
                value={newCircle.dailyMemorization}
                onChange={(e) =>
                  setNewCircle({
                    ...newCircle,
                    dailyMemorization: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-dailyRevision" className="text-right">
                ورد المراجعة اليومي
              </Label>
              <Input
                id="edit-dailyRevision"
                value={newCircle.dailyRevision}
                onChange={(e) =>
                  setNewCircle({
                    ...newCircle,
                    dailyRevision: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-weeklyEvaluation" className="text-right">
                التقييم الأسبوعي
              </Label>
              <Input
                id="edit-weeklyEvaluation"
                value={newCircle.weeklyEvaluation}
                onChange={(e) =>
                  setNewCircle({
                    ...newCircle,
                    weeklyEvaluation: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditCircleDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleEditCircle}>حفظ التعديلات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Circle Dialog */}
      <Dialog
        open={isDeleteCircleDialogOpen}
        onOpenChange={setIsDeleteCircleDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف الحلقة "{selectedCircle?.name}"؟ لا يمكن
              التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteCircleDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteCircle}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuranCircles;
