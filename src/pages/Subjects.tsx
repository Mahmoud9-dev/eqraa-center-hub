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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import {
  Subject,
  ResourceType,
  SubjectData,
  Lesson,
  Assignment,
} from "@/types";

const Subjects = () => {
  const [activeSubject, setActiveSubject] = useState<Subject>("عقيدة");
  const [isAddSubjectDialogOpen, setIsAddSubjectDialogOpen] = useState(false);
  const [isAddLessonDialogOpen, setIsAddLessonDialogOpen] = useState(false);
  const [isAddAssignmentDialogOpen, setIsAddAssignmentDialogOpen] =
    useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { toast } = useToast();

  // Mock data - will be replaced with actual data from Supabase
  const [subjects, setSubjects] = useState<SubjectData[]>([
    {
      id: "1",
      name: "عقيدة" as Subject,
      description: "دراسة أصول العقيدة الإسلامية",
      teacherId: "teacher1",
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "فقه" as Subject,
      description: "دراسة أحكام الفقه الإسلامي",
      teacherId: "teacher2",
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: "3",
      name: "سيرة" as Subject,
      description: "دراسة سيرة النبي صلى الله عليه وسلم",
      teacherId: "teacher3",
      isActive: true,
      createdAt: new Date(),
    },
  ]);

  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: "1",
      subjectId: "1",
      title: "مقدمة في العقيدة",
      description: "مقدمة شاملة لعلم العقيدة",
      type: "فيديو" as ResourceType,
      contentUrl: "#",
      order: 1,
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: "2",
      subjectId: "1",
      title: "أركان الإيمان",
      description: "شرح أركان الإيمان الستة",
      type: "PDF" as ResourceType,
      contentUrl: "#",
      order: 2,
      isActive: true,
      createdAt: new Date(),
    },
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "1",
      subjectId: "1",
      title: "بحث في أسماء الله الحسنى",
      description: "بحث مفصل عن أسماء الله الحسنى وصفاتها",
      dueDate: new Date("2025-11-15"),
      totalMarks: 100,
      isActive: true,
      createdAt: new Date(),
    },
  ]);

  // Mock teacher data
  const teachers = {
    teacher1: "الشيخ أحمد محمد",
    teacher2: "الشيخ خالد علي",
    teacher3: "الشيخ محمد حسن",
  };

  // Form states
  const [newSubject, setNewSubject] = useState<Partial<SubjectData>>({
    name: "عقيدة",
    description: "",
    teacherId: "",
    isActive: true,
  });

  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({
    title: "",
    description: "",
    type: "فيديو",
    contentUrl: "",
    order: 1,
    isActive: true,
  });

  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    title: "",
    description: "",
    dueDate: new Date(),
    totalMarks: 100,
    isActive: true,
  });

  const currentSubject = subjects.find((s) => s.name === activeSubject);
  const currentLessons = lessons.filter(
    (l) => l.subjectId === currentSubject?.id
  );
  const currentAssignments = assignments.filter(
    (a) => a.subjectId === currentSubject?.id
  );

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case "فيديو":
        return "🎥";
      case "صوت":
        return "🎵";
      case "PDF":
        return "📄";
      case "رابط":
        return "🔗";
      default:
        return "📄";
    }
  };

  const getResourceColor = (type: ResourceType) => {
    switch (type) {
      case "فيديو":
        return "bg-blue-100 text-blue-800";
      case "صوت":
        return "bg-green-100 text-green-800";
      case "PDF":
        return "bg-red-100 text-red-800";
      case "رابط":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="المواد الدراسية الشرعية" showBack={true} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">📚 المواد الدراسية</h2>
          <p className="text-muted-foreground mb-6">
            إدارة ومتابعة جميع المواد الدراسية الشرعية والدروس المتاحة
          </p>

          <div className="flex justify-between items-center mb-6">
            <Dialog
              open={isAddSubjectDialogOpen}
              onOpenChange={setIsAddSubjectDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground">
                  إضافة مادة جديدة
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>إضافة مادة جديدة</DialogTitle>
                  <DialogDescription>
                    أدخل بيانات المادة الجديدة
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject-name" className="text-right">
                      اسم المادة
                    </Label>
                    <Select
                      value={newSubject.name}
                      onValueChange={(value) =>
                        setNewSubject({ ...newSubject, name: value as Subject })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="اختر المادة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="عقيدة">عقيدة</SelectItem>
                        <SelectItem value="فقه">فقه</SelectItem>
                        <SelectItem value="سيرة">سيرة</SelectItem>
                        <SelectItem value="تفسير">تفسير</SelectItem>
                        <SelectItem value="حديث">حديث</SelectItem>
                        <SelectItem value="تربية">تربية</SelectItem>
                        <SelectItem value="لغة عربية">لغة عربية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject-description" className="text-right">
                      الوصف
                    </Label>
                    <Textarea
                      id="subject-description"
                      value={newSubject.description}
                      onChange={(e) =>
                        setNewSubject({
                          ...newSubject,
                          description: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject-teacher" className="text-right">
                      المعلم
                    </Label>
                    <Select
                      value={newSubject.teacherId}
                      onValueChange={(value) =>
                        setNewSubject({ ...newSubject, teacherId: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="اختر المعلم" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teacher1">
                          الشيخ أحمد محمد
                        </SelectItem>
                        <SelectItem value="teacher2">الشيخ خالد علي</SelectItem>
                        <SelectItem value="teacher3">الشيخ محمد حسن</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddSubjectDialogOpen(false)}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={() => {
                      if (newSubject.name && newSubject.teacherId) {
                        const subject: SubjectData = {
                          id: Date.now().toString(),
                          name: newSubject.name as Subject,
                          description: newSubject.description || "",
                          teacherId: newSubject.teacherId,
                          isActive: newSubject.isActive || true,
                          createdAt: new Date(),
                        };
                        setSubjects([...subjects, subject]);
                        setNewSubject({
                          name: "عقيدة",
                          description: "",
                          teacherId: "",
                          isActive: true,
                        });
                        setIsAddSubjectDialogOpen(false);
                        toast({
                          title: "تم الإضافة",
                          description: "تم إضافة المادة بنجاح",
                        });
                      }
                    }}
                  >
                    إضافة مادة
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs
          value={activeSubject}
          onValueChange={(value) => setActiveSubject(value as Subject)}
        >
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="عقيدة">عقيدة</TabsTrigger>
            <TabsTrigger value="فقه">فقه</TabsTrigger>
            <TabsTrigger value="سيرة">سيرة</TabsTrigger>
            <TabsTrigger value="تفسير">تفسير</TabsTrigger>
            <TabsTrigger value="حديث">حديث</TabsTrigger>
            <TabsTrigger value="تربية">تربية</TabsTrigger>
            <TabsTrigger value="لغة عربية">لغة عربية</TabsTrigger>
          </TabsList>

          <TabsContent value={activeSubject} className="mt-6">
            {currentSubject && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {currentSubject.name}
                      <Badge variant="outline">
                        {
                          teachers[
                            currentSubject.teacherId as keyof typeof teachers
                          ]
                        }
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {currentSubject.description}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        الدروس
                        <Dialog
                          open={isAddLessonDialogOpen}
                          onOpenChange={setIsAddLessonDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              إضافة درس
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>إضافة درس جديد</DialogTitle>
                              <DialogDescription>
                                أدخل بيانات الدرس الجديد
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="lesson-title"
                                  className="text-right"
                                >
                                  عنوان الدرس
                                </Label>
                                <Input
                                  id="lesson-title"
                                  value={newLesson.title}
                                  onChange={(e) =>
                                    setNewLesson({
                                      ...newLesson,
                                      title: e.target.value,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="lesson-description"
                                  className="text-right"
                                >
                                  الوصف
                                </Label>
                                <Textarea
                                  id="lesson-description"
                                  value={newLesson.description}
                                  onChange={(e) =>
                                    setNewLesson({
                                      ...newLesson,
                                      description: e.target.value,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="lesson-type"
                                  className="text-right"
                                >
                                  نوع المحتوى
                                </Label>
                                <Select
                                  value={newLesson.type}
                                  onValueChange={(value) =>
                                    setNewLesson({
                                      ...newLesson,
                                      type: value as ResourceType,
                                    })
                                  }
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="اختر النوع" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="فيديو">فيديو</SelectItem>
                                    <SelectItem value="صوت">صوت</SelectItem>
                                    <SelectItem value="PDF">PDF</SelectItem>
                                    <SelectItem value="رابط">رابط</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="lesson-url"
                                  className="text-right"
                                >
                                  رابط المحتوى
                                </Label>
                                <Input
                                  id="lesson-url"
                                  value={newLesson.contentUrl}
                                  onChange={(e) =>
                                    setNewLesson({
                                      ...newLesson,
                                      contentUrl: e.target.value,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="lesson-order"
                                  className="text-right"
                                >
                                  الترتيب
                                </Label>
                                <Input
                                  id="lesson-order"
                                  type="number"
                                  value={newLesson.order}
                                  onChange={(e) =>
                                    setNewLesson({
                                      ...newLesson,
                                      order: parseInt(e.target.value) || 1,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsAddLessonDialogOpen(false)}
                              >
                                إلغاء
                              </Button>
                              <Button
                                onClick={() => {
                                  if (newLesson.title && currentSubject) {
                                    const lesson: Lesson = {
                                      id: Date.now().toString(),
                                      subjectId: currentSubject.id,
                                      title: newLesson.title,
                                      description: newLesson.description || "",
                                      type: newLesson.type as ResourceType,
                                      contentUrl: newLesson.contentUrl || "",
                                      order: newLesson.order || 1,
                                      isActive: newLesson.isActive || true,
                                      createdAt: new Date(),
                                    };
                                    setLessons([...lessons, lesson]);
                                    setNewLesson({
                                      title: "",
                                      description: "",
                                      type: "فيديو",
                                      contentUrl: "",
                                      order: 1,
                                      isActive: true,
                                    });
                                    setIsAddLessonDialogOpen(false);
                                    toast({
                                      title: "تم الإضافة",
                                      description: "تم إضافة الدرس بنجاح",
                                    });
                                  }
                                }}
                              >
                                إضافة درس
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardTitle>
                      <CardDescription>
                        جميع دروس المادة المتاحة
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* تصنيف الدروس حسب النوع */}
                      <div className="space-y-6">
                        {["فيديو", "صوت", "PDF", "رابط"].map((type) => {
                          const filteredLessons = currentLessons.filter(
                            (lesson) => lesson.type === type
                          );

                          if (filteredLessons.length === 0) return null;

                          return (
                            <div key={type} className="space-y-3">
                              <div className="flex items-center space-x-2 space-x-reverse mb-3">
                                <span className="text-lg font-semibold">
                                  {getResourceIcon(type as ResourceType)}
                                </span>
                                <h4 className="text-lg font-semibold">
                                  الدروس{" "}
                                  {type === "فيديو"
                                    ? "المرئية"
                                    : type === "صوت"
                                    ? "الصوتية"
                                    : type === "PDF"
                                    ? "المكتوبة"
                                    : "الروابط"}
                                </h4>
                                <Badge
                                  className={getResourceColor(
                                    type as ResourceType
                                  )}
                                >
                                  {filteredLessons.length} درس
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {filteredLessons.map((lesson) => (
                                  <Card
                                    key={lesson.id}
                                    className="border-r-4 border-r-primary/20"
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <h5 className="font-medium text-sm">
                                          {lesson.title}
                                        </h5>
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          الترتيب: {lesson.order}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                        {lesson.description}
                                      </p>
                                      <div className="flex justify-between items-center">
                                        <div className="flex space-x-1 space-x-reverse">
                                          <Button variant="outline" size="sm">
                                            عرض
                                          </Button>
                                          <Button variant="outline" size="sm">
                                            تعديل
                                          </Button>
                                          <Button
                                            variant="destructive"
                                            size="sm"
                                          >
                                            حذف
                                          </Button>
                                        </div>
                                        <Badge
                                          className={getResourceColor(
                                            lesson.type
                                          )}
                                        >
                                          {lesson.type}
                                        </Badge>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          );
                        })}

                        {currentLessons.length === 0 && (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">
                              لا توجد دروس متاحة لهذه المادة
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        الواجبات والاختبارات
                        <Dialog
                          open={isAddAssignmentDialogOpen}
                          onOpenChange={setIsAddAssignmentDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              إضافة واجب
                            </Button>
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
                                <Label
                                  htmlFor="assignment-title"
                                  className="text-right"
                                >
                                  عنوان الواجب
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
                                    newAssignment.dueDate
                                      ?.toISOString()
                                      .split("T")[0]
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
                                  htmlFor="assignment-marks"
                                  className="text-right"
                                >
                                  الدرجة الكاملة
                                </Label>
                                <Input
                                  id="assignment-marks"
                                  type="number"
                                  value={newAssignment.totalMarks}
                                  onChange={(e) =>
                                    setNewAssignment({
                                      ...newAssignment,
                                      totalMarks:
                                        parseInt(e.target.value) || 100,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  setIsAddAssignmentDialogOpen(false)
                                }
                              >
                                إلغاء
                              </Button>
                              <Button
                                onClick={() => {
                                  if (newAssignment.title && currentSubject) {
                                    const assignment: Assignment = {
                                      id: Date.now().toString(),
                                      subjectId: currentSubject.id,
                                      title: newAssignment.title,
                                      description:
                                        newAssignment.description || "",
                                      dueDate:
                                        newAssignment.dueDate || new Date(),
                                      totalMarks:
                                        newAssignment.totalMarks || 100,
                                      isActive: newAssignment.isActive || true,
                                      createdAt: new Date(),
                                    };
                                    setAssignments([
                                      ...assignments,
                                      assignment,
                                    ]);
                                    setNewAssignment({
                                      title: "",
                                      description: "",
                                      dueDate: new Date(),
                                      totalMarks: 100,
                                      isActive: true,
                                    });
                                    setIsAddAssignmentDialogOpen(false);
                                    toast({
                                      title: "تم الإضافة",
                                      description: "تم إضافة الواجب بنجاح",
                                    });
                                  }
                                }}
                              >
                                إضافة واجب
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardTitle>
                      <CardDescription>واجبات واختبارات المادة</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>العنوان</TableHead>
                            <TableHead>تاريخ التسليم</TableHead>
                            <TableHead>الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentAssignments.map((assignment) => (
                            <TableRow key={assignment.id}>
                              <TableCell className="font-medium">
                                {assignment.title}
                              </TableCell>
                              <TableCell>
                                {assignment.dueDate.toLocaleDateString("ar-SA")}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2 space-x-reverse">
                                  <Button variant="outline" size="sm">
                                    عرض
                                  </Button>
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
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>أسئلة موجهة للشيخ</CardTitle>
                    <CardDescription>
                      طرح الأسئلة والمشاكل على المدرس
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        لا توجد أسئلة حالياً
                      </p>
                      <Button variant="outline">طرح سؤال جديد</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Subjects;
