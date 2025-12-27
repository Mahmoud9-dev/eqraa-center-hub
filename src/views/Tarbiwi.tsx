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

const Tarbiwi = () => {
  const [activeTab, setActiveTab] = useState("programs");
  const [isAddProgramDialogOpen, setIsAddProgramDialogOpen] = useState(false);
  const [isEditProgramDialogOpen, setIsEditProgramDialogOpen] = useState(false);
  const [isDeleteProgramDialogOpen, setIsDeleteProgramDialogOpen] =
    useState(false);
  const [isAddAssignmentDialogOpen, setIsAddAssignmentDialogOpen] =
    useState(false);
  const [isEditAssignmentDialogOpen, setIsEditAssignmentDialogOpen] =
    useState(false);
  const [isDeleteAssignmentDialogOpen, setIsDeleteAssignmentDialogOpen] =
    useState(false);
  const [isAddAssessmentDialogOpen, setIsAddAssessmentDialogOpen] =
    useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const { toast } = useToast();

  // Mock data - will be replaced with actual data from Supabase
  const [programs, setPrograms] = useState([
    {
      id: "1",
      title: "برنامج الآداب الإسلامية",
      description: "برنامج أسبوعي لتعليم الآداب الإسلامية والسلوكيات الحميدة",
      dayOfWeek: 1, // Sunday
      time: "09:00",
      duration: 60,
      targetAge: "6-12",
      isActive: true,
      createdAt: new Date("2025-09-01"),
    },
    {
      id: "2",
      title: "برنامج القيم والأخلاق",
      description: "برنامج لغرس القيم الإسلامية والأخلاق الحميدة",
      dayOfWeek: 3, // Tuesday
      time: "10:00",
      duration: 45,
      targetAge: "13-18",
      isActive: true,
      createdAt: new Date("2025-09-15"),
    },
    {
      id: "3",
      title: "برنامج العبادات اليومية",
      description: "برنامج لتعزيز العبادات اليومية والالتزام بها",
      dayOfWeek: 5, // Thursday
      time: "11:00",
      duration: 30,
      targetAge: "جميع الأعمار",
      isActive: true,
      createdAt: new Date("2025-10-01"),
    },
  ]);

  const [assignments, setAssignments] = useState([
    {
      id: "1",
      title: "حفظ سورة الفاتحة مع معانيها",
      description: "حفظ سورة الفاتحة وفهم معانيها وتطبيقها في الحياة",
      type: "عبادية",
      dueDate: new Date("2025-11-10"),
      targetAge: "6-12",
      points: 10,
      isActive: true,
      createdAt: new Date("2025-11-01"),
    },
    {
      id: "2",
      title: "بر الوضوء والصلاة",
      description: "الالتزام بالوضوء والصلاة في أوقاتها وتسجيل ذلك",
      type: "عبادية",
      dueDate: new Date("2025-11-15"),
      targetAge: "جميع الأعمار",
      points: 15,
      isActive: true,
      createdAt: new Date("2025-11-02"),
    },
    {
      id: "3",
      title: "مساعدة الوالدين",
      description: "مساعدة الوالدين في أعمال المنزل وتقدير جهودهم",
      type: "سلوكية",
      dueDate: new Date("2025-11-08"),
      targetAge: "جميع الأعمار",
      points: 20,
      isActive: true,
      createdAt: new Date("2025-11-03"),
    },
  ]);

  const [assessments, setAssessments] = useState([
    {
      id: "1",
      studentId: "student1",
      date: new Date("2025-11-01"),
      criteria: "الالتزام بالصلاة",
      rating: 9,
      notes: "ممتاز في الالتزام بالصلاة في أوقاتها",
      evaluatedBy: "teacher1",
    },
    {
      id: "2",
      studentId: "student2",
      date: new Date("2025-11-02"),
      criteria: "حسن الخلق",
      rating: 8,
      notes: "أخلاق جيدة ولكن يحتاج لتحسين في التعامل مع الآخرين",
      evaluatedBy: "teacher1",
    },
    {
      id: "3",
      studentId: "student3",
      date: new Date("2025-11-03"),
      criteria: "الصدق",
      rating: 10,
      notes: "ممتاز في الصدق والأمانة",
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
  const [newProgram, setNewProgram] = useState({
    title: "",
    description: "",
    dayOfWeek: 1,
    time: "",
    duration: 60,
    targetAge: "",
    isActive: true,
  });

  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    type: "عبادية",
    dueDate: new Date(),
    targetAge: "",
    points: 10,
    isActive: true,
  });

  const [newAssessment, setNewAssessment] = useState({
    studentId: "",
    date: new Date(),
    criteria: "",
    rating: 0,
    notes: "",
    evaluatedBy: "current_user",
  });

  const getDayName = (dayOfWeek: number) => {
    const days = [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    return days[dayOfWeek];
  };

  const getAssignmentTypeColor = (type: string) => {
    return type === "عبادية"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return "bg-green-100 text-green-800";
    if (rating >= 7) return "bg-blue-100 text-blue-800";
    if (rating >= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // CRUD functions
  const handleAddProgram = () => {
    if (!newProgram.title || !newProgram.description || !newProgram.time) {
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
      dayOfWeek: newProgram.dayOfWeek,
      time: newProgram.time,
      duration: newProgram.duration,
      targetAge: newProgram.targetAge,
      isActive: newProgram.isActive,
      createdAt: new Date(),
    };

    setPrograms([...programs, program]);
    setNewProgram({
      title: "",
      description: "",
      dayOfWeek: 1,
      time: "",
      duration: 60,
      targetAge: "",
      isActive: true,
    });
    setIsAddProgramDialogOpen(false);
    toast({
      title: "تم الإضافة",
      description: "تم إضافة البرنامج بنجاح",
    });
  };

  const handleEditProgram = () => {
    if (
      !selectedProgram ||
      !newProgram.title ||
      !newProgram.description ||
      !newProgram.time
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setPrograms(
      programs.map((program) =>
        program.id === selectedProgram.id
          ? {
              ...program,
              title: newProgram.title || program.title,
              description: newProgram.description || program.description,
              dayOfWeek: newProgram.dayOfWeek || program.dayOfWeek,
              time: newProgram.time || program.time,
              duration: newProgram.duration || program.duration,
              targetAge: newProgram.targetAge || program.targetAge,
              isActive:
                newProgram.isActive !== undefined
                  ? newProgram.isActive
                  : program.isActive,
            }
          : program
      )
    );

    setIsEditProgramDialogOpen(false);
    setSelectedProgram(null);
    setNewProgram({
      title: "",
      description: "",
      dayOfWeek: 1,
      time: "",
      duration: 60,
      targetAge: "",
      isActive: true,
    });
    toast({
      title: "تم التعديل",
      description: "تم تعديل البرنامج بنجاح",
    });
  };

  const handleDeleteProgram = () => {
    if (!selectedProgram) return;

    setPrograms(
      programs.filter((program) => program.id !== selectedProgram.id)
    );
    setIsDeleteProgramDialogOpen(false);
    setSelectedProgram(null);
    toast({
      title: "تم الحذف",
      description: "تم حذف البرنامج بنجاح",
    });
  };

  const handleAddAssignment = () => {
    if (
      !newAssignment.title ||
      !newAssignment.description ||
      !newAssignment.dueDate
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const assignment = {
      id: Date.now().toString(),
      title: newAssignment.title,
      description: newAssignment.description,
      type: newAssignment.type,
      dueDate: newAssignment.dueDate,
      targetAge: newAssignment.targetAge,
      points: newAssignment.points,
      isActive: newAssignment.isActive,
      createdAt: new Date(),
    };

    setAssignments([...assignments, assignment]);
    setNewAssignment({
      title: "",
      description: "",
      type: "عبادية",
      dueDate: new Date(),
      targetAge: "",
      points: 10,
      isActive: true,
    });
    setIsAddAssignmentDialogOpen(false);
    toast({
      title: "تم الإضافة",
      description: "تم إضافة الواجب بنجاح",
    });
  };

  const handleEditAssignment = () => {
    if (
      !selectedAssignment ||
      !newAssignment.title ||
      !newAssignment.description ||
      !newAssignment.dueDate
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setAssignments(
      assignments.map((assignment) =>
        assignment.id === selectedAssignment.id
          ? {
              ...assignment,
              title: newAssignment.title || assignment.title,
              description: newAssignment.description || assignment.description,
              type: newAssignment.type || assignment.type,
              dueDate: newAssignment.dueDate || assignment.dueDate,
              targetAge: newAssignment.targetAge || assignment.targetAge,
              points: newAssignment.points || assignment.points,
              isActive:
                newAssignment.isActive !== undefined
                  ? newAssignment.isActive
                  : assignment.isActive,
            }
          : assignment
      )
    );

    setIsEditAssignmentDialogOpen(false);
    setSelectedAssignment(null);
    setNewAssignment({
      title: "",
      description: "",
      type: "عبادية",
      dueDate: new Date(),
      targetAge: "",
      points: 10,
      isActive: true,
    });
    toast({
      title: "تم التعديل",
      description: "تم تعديل الواجب بنجاح",
    });
  };

  const handleDeleteAssignment = () => {
    if (!selectedAssignment) return;

    setAssignments(
      assignments.filter(
        (assignment) => assignment.id !== selectedAssignment.id
      )
    );
    setIsDeleteAssignmentDialogOpen(false);
    setSelectedAssignment(null);
    toast({
      title: "تم الحذف",
      description: "تم حذف الواجب بنجاح",
    });
  };

  const handleAddAssessment = () => {
    if (
      !newAssessment.studentId ||
      !newAssessment.criteria ||
      newAssessment.rating === 0
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const assessment = {
      id: Date.now().toString(),
      studentId: newAssessment.studentId,
      date: newAssessment.date,
      criteria: newAssessment.criteria,
      rating: newAssessment.rating,
      notes: newAssessment.notes,
      evaluatedBy: newAssessment.evaluatedBy,
    };

    setAssessments([...assessments, assessment]);
    setNewAssessment({
      studentId: "",
      date: new Date(),
      criteria: "",
      rating: 0,
      notes: "",
      evaluatedBy: "current_user",
    });
    setIsAddAssessmentDialogOpen(false);
    toast({
      title: "تم الإضافة",
      description: "تم إضافة التقييم بنجاح",
    });
  };

  const openEditProgramDialog = (program: any) => {
    setSelectedProgram(program);
    setNewProgram({
      title: program.title,
      description: program.description,
      dayOfWeek: program.dayOfWeek,
      time: program.time,
      duration: program.duration,
      targetAge: program.targetAge,
      isActive: program.isActive,
    });
    setIsEditProgramDialogOpen(true);
  };

  const openDeleteProgramDialog = (program: any) => {
    setSelectedProgram(program);
    setIsDeleteProgramDialogOpen(true);
  };

  const openEditAssignmentDialog = (assignment: any) => {
    setSelectedAssignment(assignment);
    setNewAssignment({
      title: assignment.title,
      description: assignment.description,
      type: assignment.type,
      dueDate: new Date(assignment.dueDate),
      targetAge: assignment.targetAge,
      points: assignment.points,
      isActive: assignment.isActive,
    });
    setIsEditAssignmentDialogOpen(true);
  };

  const openDeleteAssignmentDialog = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsDeleteAssignmentDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="الجانب التربوي" showBack={true} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">🕌 الجانب التربوي</h2>
          <p className="text-muted-foreground mb-6">
            إدارة البرامج التربوية والواجبات السلوكية والتقييمات
          </p>

          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4 space-x-reverse">
              <Input placeholder="البحث عن برنامج..." className="w-64" />
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <Dialog
                open={isAddAssignmentDialogOpen}
                onOpenChange={setIsAddAssignmentDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">إضافة واجب</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>إضافة واجب جديد</DialogTitle>
                    <DialogDescription>
                      أدخل بيانات الواجب الجديد
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="assignment-title" className="text-right">
                        العنوان
                      </Label>
                      <Input
                        id="assignment-title"
                        value={newAssignment.title}
                        onChange={(e) =>
                          setNewAssignment({
                            ...newAssignment,
                            title: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="assignment-type" className="text-right">
                        النوع
                      </Label>
                      <Select
                        value={newAssignment.type}
                        onValueChange={(value) =>
                          setNewAssignment({ ...newAssignment, type: value })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="عبادية">عبادية</SelectItem>
                          <SelectItem value="سلوكية">سلوكية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="assignment-description"
                        className="text-right"
                      >
                        الوصف
                      </Label>
                      <Textarea
                        id="assignment-description"
                        value={newAssignment.description}
                        onChange={(e) =>
                          setNewAssignment({
                            ...newAssignment,
                            description: e.target.value,
                          })
                        }
                        className="col-span-3"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="assignment-dueDate"
                        className="text-right"
                      >
                        تاريخ التسليم
                      </Label>
                      <Input
                        id="assignment-dueDate"
                        type="date"
                        value={
                          newAssignment.dueDate?.toISOString().split("T")[0]
                        }
                        onChange={(e) =>
                          setNewAssignment({
                            ...newAssignment,
                            dueDate: new Date(e.target.value),
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="assignment-targetAge"
                        className="text-right"
                      >
                        الفئة العمرية
                      </Label>
                      <Input
                        id="assignment-targetAge"
                        value={newAssignment.targetAge}
                        onChange={(e) =>
                          setNewAssignment({
                            ...newAssignment,
                            targetAge: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="assignment-points" className="text-right">
                        النقاط
                      </Label>
                      <Input
                        id="assignment-points"
                        type="number"
                        value={newAssignment.points}
                        onChange={(e) =>
                          setNewAssignment({
                            ...newAssignment,
                            points: parseInt(e.target.value) || 10,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddAssignmentDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button onClick={handleAddAssignment}>إضافة واجب</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isAddProgramDialogOpen}
                onOpenChange={setIsAddProgramDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground">
                    إنشاء برنامج جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>إنشاء برنامج جديد</DialogTitle>
                    <DialogDescription>
                      أدخل بيانات البرنامج الجديد
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="program-title" className="text-right">
                        العنوان
                      </Label>
                      <Input
                        id="program-title"
                        value={newProgram.title}
                        onChange={(e) =>
                          setNewProgram({
                            ...newProgram,
                            title: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="program-description"
                        className="text-right"
                      >
                        الوصف
                      </Label>
                      <Textarea
                        id="program-description"
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
                      <Label htmlFor="program-day" className="text-right">
                        اليوم
                      </Label>
                      <Select
                        value={newProgram.dayOfWeek.toString()}
                        onValueChange={(value) =>
                          setNewProgram({
                            ...newProgram,
                            dayOfWeek: parseInt(value),
                          })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="اختر اليوم" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">الأحد</SelectItem>
                          <SelectItem value="1">الإثنين</SelectItem>
                          <SelectItem value="2">الثلاثاء</SelectItem>
                          <SelectItem value="3">الأربعاء</SelectItem>
                          <SelectItem value="4">الخميس</SelectItem>
                          <SelectItem value="5">الجمعة</SelectItem>
                          <SelectItem value="6">السبت</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="program-time" className="text-right">
                        الوقت
                      </Label>
                      <Input
                        id="program-time"
                        type="time"
                        value={newProgram.time}
                        onChange={(e) =>
                          setNewProgram({ ...newProgram, time: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="program-duration" className="text-right">
                        المدة (دقائق)
                      </Label>
                      <Input
                        id="program-duration"
                        type="number"
                        value={newProgram.duration}
                        onChange={(e) =>
                          setNewProgram({
                            ...newProgram,
                            duration: parseInt(e.target.value) || 60,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="program-targetAge" className="text-right">
                        الفئة العمرية
                      </Label>
                      <Input
                        id="program-targetAge"
                        value={newProgram.targetAge}
                        onChange={(e) =>
                          setNewProgram({
                            ...newProgram,
                            targetAge: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddProgramDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button onClick={handleAddProgram}>إنشاء برنامج</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="programs">البرامج الأسبوعية</TabsTrigger>
            <TabsTrigger value="assignments">الواجبات السلوكية</TabsTrigger>
            <TabsTrigger value="assessments">التقييمات التربوية</TabsTrigger>
            <TabsTrigger value="content">محتوى تربوي</TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>البرامج الأسبوعية</CardTitle>
                <CardDescription>
                  عرض وإدارة جميع البرامج التربوية الأسبوعية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>عنوان البرنامج</TableHead>
                      <TableHead>اليوم</TableHead>
                      <TableHead>الوقت</TableHead>
                      <TableHead>المدة</TableHead>
                      <TableHead>الفئة العمرية</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programs.map((program) => (
                      <TableRow key={program.id}>
                        <TableCell className="font-medium">
                          {program.title}
                        </TableCell>
                        <TableCell>{getDayName(program.dayOfWeek)}</TableCell>
                        <TableCell>{program.time}</TableCell>
                        <TableCell>{program.duration} دقيقة</TableCell>
                        <TableCell>{program.targetAge}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              program.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {program.isActive ? "نشط" : "غير نشط"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="outline" size="sm">
                              عرض
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditProgramDialog(program)}
                            >
                              تعديل
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openDeleteProgramDialog(program)}
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
          </TabsContent>

          <TabsContent value="assignments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>الواجبات السلوكية والعبادية</CardTitle>
                <CardDescription>
                  عرض وإدارة جميع الواجبات السلوكية والعبادية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>عنوان الواجب</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>تاريخ التسليم</TableHead>
                      <TableHead>الفئة العمرية</TableHead>
                      <TableHead>النقاط</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">
                          {assignment.title}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getAssignmentTypeColor(assignment.type)}
                          >
                            {assignment.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(assignment.dueDate).toLocaleDateString(
                            "ar-SA"
                          )}
                        </TableCell>
                        <TableCell>{assignment.targetAge}</TableCell>
                        <TableCell>{assignment.points}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              assignment.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {assignment.isActive ? "نشط" : "غير نشط"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="outline" size="sm">
                              عرض
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                openEditAssignmentDialog(assignment)
                              }
                            >
                              تعديل
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                openDeleteAssignmentDialog(assignment)
                              }
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
          </TabsContent>

          <TabsContent value="assessments" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">التقييمات التربوية للطلاب</h3>
              <Dialog
                open={isAddAssessmentDialogOpen}
                onOpenChange={setIsAddAssessmentDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>إضافة تقييم جديد</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>إضافة تقييم جديد</DialogTitle>
                    <DialogDescription>
                      أدخل بيانات التقييم الجديد
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="assessment-student"
                        className="text-right"
                      >
                        الطالب
                      </Label>
                      <Select
                        value={newAssessment.studentId}
                        onValueChange={(value) =>
                          setNewAssessment({
                            ...newAssessment,
                            studentId: value,
                          })
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
                      <Label
                        htmlFor="assessment-criteria"
                        className="text-right"
                      >
                        معيار التقييم
                      </Label>
                      <Input
                        id="assessment-criteria"
                        value={newAssessment.criteria}
                        onChange={(e) =>
                          setNewAssessment({
                            ...newAssessment,
                            criteria: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="assessment-rating" className="text-right">
                        التقييم (من 10)
                      </Label>
                      <Input
                        id="assessment-rating"
                        type="number"
                        min="1"
                        max="10"
                        value={newAssessment.rating}
                        onChange={(e) =>
                          setNewAssessment({
                            ...newAssessment,
                            rating: parseInt(e.target.value) || 0,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="assessment-notes" className="text-right">
                        ملاحظات
                      </Label>
                      <Textarea
                        id="assessment-notes"
                        value={newAssessment.notes}
                        onChange={(e) =>
                          setNewAssessment({
                            ...newAssessment,
                            notes: e.target.value,
                          })
                        }
                        className="col-span-3"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddAssessmentDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button onClick={handleAddAssessment}>إضافة تقييم</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>سجل التقييمات</CardTitle>
                <CardDescription>
                  عرض جميع التقييمات التربوية للطلاب
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الطالب</TableHead>
                      <TableHead>معيار التقييم</TableHead>
                      <TableHead>التقييم</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>المقيم</TableHead>
                      <TableHead>ملاحظات</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell>
                          {
                            students[
                              assessment.studentId as keyof typeof students
                            ]
                          }
                        </TableCell>
                        <TableCell>{assessment.criteria}</TableCell>
                        <TableCell>
                          <Badge className={getRatingColor(assessment.rating)}>
                            {assessment.rating}/10
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(assessment.date).toLocaleDateString(
                            "ar-SA"
                          )}
                        </TableCell>
                        <TableCell>
                          {
                            teachers[
                              assessment.evaluatedBy as keyof typeof teachers
                            ]
                          }
                        </TableCell>
                        <TableCell>{assessment.notes}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="outline" size="sm">
                              تعديل
                            </Button>
                            <Button variant="destructive" size="sm">
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
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>مقالات تربوية</CardTitle>
                  <CardDescription>
                    مقالات قصيرة ومحتوى تربوي يومي
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">
                        أهمية الصلاة في حياة المسلم
                      </h4>
                      <div className="text-sm text-muted-foreground mb-2">
                        الصلاة هي عماد الدين وأهم ركن من أركان الإسلام بعد
                        الشهادتين...
                      </div>
                      <div className="text-xs text-muted-foreground">
                        نشر: 2025-11-01
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">
                        آداب الطعام في الإسلام
                      </h4>
                      <div className="text-sm text-muted-foreground mb-2">
                        علمنا الإسلام آداب الطعام والشراب التي يجب على المسلم
                        الالتزام بها...
                      </div>
                      <div className="text-xs text-muted-foreground">
                        نشر: 2025-11-02
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">
                        بر الوالدين في الإسلام
                      </h4>
                      <div className="text-sm text-muted-foreground mb-2">
                        بر الوالدين من أعظم الأعمال الصالحة التي حث عليها
                        الإسلام...
                      </div>
                      <div className="text-xs text-muted-foreground">
                        نشر: 2025-11-03
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>مقاطع فيديو تربوية</CardTitle>
                  <CardDescription>
                    مقاطع قصيرة ومحتوى مرئي تربوي
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">كيفية الوضوء الصحيح</h4>
                      <div className="text-sm text-muted-foreground mb-2">
                        فيديو تعليمي يوضح خطوات الوضوء الصحيح بالتفصيل...
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-muted-foreground">
                          مدة: 5 دقائق
                        </div>
                        <Button variant="outline" size="sm">
                          مشاهدة
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">
                        أهمية الصدق في التعامل
                      </h4>
                      <div className="text-sm text-muted-foreground mb-2">
                        محاضرة قصيرة عن أهمية الصدق في التعامل مع الآخرين...
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-muted-foreground">
                          مدة: 8 دقائق
                        </div>
                        <Button variant="outline" size="sm">
                          مشاهدة
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">
                        حقوق الجار في الإسلام
                      </h4>
                      <div className="text-sm text-muted-foreground mb-2">
                        شرح لحقوق الجار في الإسلام وكيفية حسن الجوار...
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-muted-foreground">
                          مدة: 10 دقائق
                        </div>
                        <Button variant="outline" size="sm">
                          مشاهدة
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Program Dialog */}
      <Dialog
        open={isEditProgramDialogOpen}
        onOpenChange={setIsEditProgramDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل البرنامج</DialogTitle>
            <DialogDescription>قم بتعديل بيانات البرنامج</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-program-title" className="text-right">
                العنوان
              </Label>
              <Input
                id="edit-program-title"
                value={newProgram.title}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-program-description" className="text-right">
                الوصف
              </Label>
              <Textarea
                id="edit-program-description"
                value={newProgram.description}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, description: e.target.value })
                }
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-program-day" className="text-right">
                اليوم
              </Label>
              <Select
                value={newProgram.dayOfWeek.toString()}
                onValueChange={(value) =>
                  setNewProgram({ ...newProgram, dayOfWeek: parseInt(value) })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر اليوم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">الأحد</SelectItem>
                  <SelectItem value="1">الإثنين</SelectItem>
                  <SelectItem value="2">الثلاثاء</SelectItem>
                  <SelectItem value="3">الأربعاء</SelectItem>
                  <SelectItem value="4">الخميس</SelectItem>
                  <SelectItem value="5">الجمعة</SelectItem>
                  <SelectItem value="6">السبت</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-program-time" className="text-right">
                الوقت
              </Label>
              <Input
                id="edit-program-time"
                type="time"
                value={newProgram.time}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, time: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-program-duration" className="text-right">
                المدة (دقائق)
              </Label>
              <Input
                id="edit-program-duration"
                type="number"
                value={newProgram.duration}
                onChange={(e) =>
                  setNewProgram({
                    ...newProgram,
                    duration: parseInt(e.target.value) || 60,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-program-targetAge" className="text-right">
                الفئة العمرية
              </Label>
              <Input
                id="edit-program-targetAge"
                value={newProgram.targetAge}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, targetAge: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditProgramDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleEditProgram}>حفظ التعديلات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Program Dialog */}
      <Dialog
        open={isDeleteProgramDialogOpen}
        onOpenChange={setIsDeleteProgramDialogOpen}
      >
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
              onClick={() => setIsDeleteProgramDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteProgram}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Assignment Dialog */}
      <Dialog
        open={isEditAssignmentDialogOpen}
        onOpenChange={setIsEditAssignmentDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل الواجب</DialogTitle>
            <DialogDescription>قم بتعديل بيانات الواجب</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-assignment-title" className="text-right">
                العنوان
              </Label>
              <Input
                id="edit-assignment-title"
                value={newAssignment.title}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-assignment-type" className="text-right">
                النوع
              </Label>
              <Select
                value={newAssignment.type}
                onValueChange={(value) =>
                  setNewAssignment({ ...newAssignment, type: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="عبادية">عبادية</SelectItem>
                  <SelectItem value="سلوكية">سلوكية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="edit-assignment-description"
                className="text-right"
              >
                الوصف
              </Label>
              <Textarea
                id="edit-assignment-description"
                value={newAssignment.description}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-assignment-dueDate" className="text-right">
                تاريخ التسليم
              </Label>
              <Input
                id="edit-assignment-dueDate"
                type="date"
                value={newAssignment.dueDate?.toISOString().split("T")[0]}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    dueDate: new Date(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-assignment-targetAge" className="text-right">
                الفئة العمرية
              </Label>
              <Input
                id="edit-assignment-targetAge"
                value={newAssignment.targetAge}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    targetAge: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-assignment-points" className="text-right">
                النقاط
              </Label>
              <Input
                id="edit-assignment-points"
                type="number"
                value={newAssignment.points}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    points: parseInt(e.target.value) || 10,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditAssignmentDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleEditAssignment}>حفظ التعديلات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Assignment Dialog */}
      <Dialog
        open={isDeleteAssignmentDialogOpen}
        onOpenChange={setIsDeleteAssignmentDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف الواجب "{selectedAssignment?.title}"؟ لا يمكن
              التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteAssignmentDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteAssignment}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tarbiwi;
