import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import { Department, Student, StudentImages } from "@/types";

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<Department | "all">(
    "all"
  );
  const [activeTab, setActiveTab] = useState("all");
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "أحمد محمد علي",
      age: 12,
      grade: "السادس ابتدائي",
      department: "quran" as Department,
      teacherId: "teacher1",
      partsMemorized: 5,
      currentProgress: "سورة آل عمران - الآية 50",
      previousProgress: "سورة البقرة - الآية 200",
      attendance: 85,
      parentName: "محمد علي",
      parentPhone: "01234567890",
      isActive: true,
      createdAt: new Date(),
      // إضافة خانات الصور المتعددة
      images: {
        new: "سورة النساء - الآية 1-30",
        recent1: "سورة آل عمران - الآية 1-50",
        recent2: "سورة البقرة - الآية 200-250",
        recent3: "سورة البقرة - الآية 150-200",
        distant1: "سورة البقرة - الآية 100-150",
        distant2: "سورة البقرة - الآية 50-100",
        distant3: "سورة الفاتحة",
      },
    },
    {
      id: "2",
      name: "عمر خالد حسن",
      age: 14,
      grade: "الثالث إعدادي",
      department: "tajweed" as Department,
      teacherId: "teacher2",
      partsMemorized: 8,
      currentProgress: "سورة النساء - الآية 100",
      previousProgress: "سورة آل عمران - الآية 50",
      attendance: 92,
      parentName: "خالد حسن",
      parentPhone: "01234567891",
      isActive: true,
      createdAt: new Date(),
      // إضافة خانات الصور المتعددة
      images: {
        new: "سورة المائدة - الآية 1-20",
        recent1: "سورة النساء - الآية 50-100",
        recent2: "سورة آل عمران - الآية 50-100",
        recent3: "سورة آل عمران - الآية 1-50",
        distant1: "سورة البقرة - الآية 200-285",
        distant2: "سورة البقرة - الآية 150-200",
        distant3: "سورة البقرة - الآية 100-150",
      },
    },
    {
      id: "3",
      name: "محمد سعيد أحمد",
      age: 11,
      grade: "الخامس ابتدائي",
      department: "tarbawi" as Department,
      teacherId: "teacher3",
      partsMemorized: 3,
      currentProgress: "سورة البقرة - الآية 150",
      previousProgress: "سورة البقرة - الآية 100",
      attendance: 78,
      parentName: "سعيد أحمد",
      parentPhone: "01234567892",
      isActive: true,
      createdAt: new Date(),
      // إضافة خانات الصور المتعددة
      images: {
        new: "سورة الأنعام - الآية 1-30",
        recent1: "سورة البقرة - الآية 150-200",
        recent2: "سورة البقرة - الآية 100-150",
        recent3: "سورة البقرة - الآية 50-100",
        distant1: "سورة البقرة - الآية 1-50",
        distant2: "سورة الفاتحة",
        distant3: "",
      },
    },
  ]);

  // Mock teacher data for display
  const teachers = {
    teacher1: "الشيخ خالد أحمد",
    teacher2: "الشيخ أحمد محمد",
    teacher3: "الشيخ محمد حسن",
  };

  // Mock grades and notes data
  const studentsGrades = {
    "1": [
      { subject: "قرآن", grade: 85, status: "ممتاز" },
      { subject: "تجويد", grade: 78, status: "جيد جداً" },
      { subject: "تربوي", grade: 92, status: "ممتاز" },
    ],
    "2": [
      { subject: "قرآن", grade: 78, status: "جيد جداً" },
      { subject: "تجويد", grade: 88, status: "ممتاز" },
      { subject: "تربوي", grade: 85, status: "ممتاز" },
    ],
    "3": [
      { subject: "قرآن", grade: 72, status: "جيد" },
      { subject: "تجويد", grade: 75, status: "جيد" },
      { subject: "تربوي", grade: 88, status: "ممتاز" },
    ],
  };

  const studentsNotes = {
    "1": [
      {
        id: "1",
        type: "إيجابي",
        content: "مشاركة ممتازة في الحلقة",
        date: "2025-11-01",
        teacher: "الشيخ خالد",
      },
      {
        id: "2",
        type: "سلبي",
        content: "تأخير في الحضور",
        date: "2025-10-28",
        teacher: "الشيخ خالد",
      },
    ],
    "2": [
      {
        id: "3",
        type: "إيجابي",
        content: "حفظ ممتاز للأحكام",
        date: "2025-11-02",
        teacher: "الشيخ أحمد",
      },
    ],
    "3": [],
  };

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: "",
    age: 0,
    grade: "",
    department: "quran",
    teacherId: "",
    partsMemorized: 0,
    currentProgress: "",
    previousProgress: "",
    attendance: 0,
    parentName: "",
    parentPhone: "",
    isActive: true,
    // إضافة خانات الصور المتعددة
    images: {
      new: "",
      recent1: "",
      recent2: "",
      recent3: "",
      distant1: "",
      distant2: "",
      distant3: "",
    },
  });
  const { toast } = useToast();

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teachers[student.teacherId as keyof typeof teachers] || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === "all" || student.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Filter students by department for specific views
  const getStudentsByDepartment = (dept: Department) => {
    return students.filter((student) => student.department === dept);
  };

  const getDepartmentName = (dept: Department) => {
    switch (dept) {
      case "quran":
        return "قرآن";
      case "tajweed":
        return "تجويد";
      case "tarbawi":
        return "تربوي";
      default:
        return dept;
    }
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return "text-green-600";
    if (attendance >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "bg-green-100 text-green-800";
    if (grade >= 80) return "bg-blue-100 text-blue-800";
    if (grade >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getNoteTypeColor = (type: string) => {
    return type === "إيجابي"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  // Functions for CRUD operations
  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.grade || !newStudent.teacherId) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const student: Student = {
      id: Date.now().toString(),
      name: newStudent.name || "",
      age: newStudent.age || 0,
      grade: newStudent.grade || "",
      department: newStudent.department as Department,
      teacherId: newStudent.teacherId || "",
      partsMemorized: newStudent.partsMemorized || 0,
      currentProgress: newStudent.currentProgress || "",
      previousProgress: newStudent.previousProgress || "",
      attendance: newStudent.attendance || 0,
      parentName: newStudent.parentName,
      parentPhone: newStudent.parentPhone,
      isActive: newStudent.isActive || true,
      createdAt: new Date(),
      images: newStudent.images,
    };

    setStudents([...students, student]);
    setNewStudent({
      name: "",
      age: 0,
      grade: "",
      department: "quran",
      teacherId: "",
      partsMemorized: 0,
      currentProgress: "",
      previousProgress: "",
      attendance: 0,
      parentName: "",
      parentPhone: "",
      isActive: true,
      images: {
        new: "",
        recent1: "",
        recent2: "",
        recent3: "",
        distant1: "",
        distant2: "",
        distant3: "",
      },
    });
    setIsAddDialogOpen(false);
    toast({
      title: "تم الإضافة",
      description: "تم إضافة الطالب بنجاح",
    });
  };

  const handleEditStudent = () => {
    if (
      !selectedStudent ||
      !newStudent.name ||
      !newStudent.grade ||
      !newStudent.teacherId
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setStudents(
      students.map((student) =>
        student.id === selectedStudent.id
          ? {
              ...student,
              name: newStudent.name || student.name,
              age: newStudent.age || student.age,
              grade: newStudent.grade || student.grade,
              department:
                (newStudent.department as Department) || student.department,
              teacherId: newStudent.teacherId || student.teacherId,
              partsMemorized:
                newStudent.partsMemorized || student.partsMemorized,
              currentProgress:
                newStudent.currentProgress || student.currentProgress,
              previousProgress:
                newStudent.previousProgress || student.previousProgress,
              attendance: newStudent.attendance || student.attendance,
              parentName: newStudent.parentName || student.parentName,
              parentPhone: newStudent.parentPhone || student.parentPhone,
              isActive:
                newStudent.isActive !== undefined
                  ? newStudent.isActive
                  : student.isActive,
              images: newStudent.images || student.images,
            }
          : student
      )
    );

    setIsEditDialogOpen(false);
    setSelectedStudent(null);
    setNewStudent({
      name: "",
      age: 0,
      grade: "",
      department: "quran",
      teacherId: "",
      partsMemorized: 0,
      currentProgress: "",
      previousProgress: "",
      attendance: 0,
      parentName: "",
      parentPhone: "",
      isActive: true,
      images: {
        new: "",
        recent1: "",
        recent2: "",
        recent3: "",
        distant1: "",
        distant2: "",
        distant3: "",
      },
    });
    toast({
      title: "تم التعديل",
      description: "تم تعديل بيانات الطالب بنجاح",
    });
  };

  const handleDeleteStudent = () => {
    if (!selectedStudent) return;

    setStudents(
      students.filter((student) => student.id !== selectedStudent.id)
    );
    setIsDeleteDialogOpen(false);
    setSelectedStudent(null);
    toast({
      title: "تم الحذف",
      description: "تم حذف الطالب بنجاح",
    });
  };

  const openEditDialog = (student: Student) => {
    setSelectedStudent(student);
    setNewStudent({
      name: student.name,
      age: student.age,
      grade: student.grade,
      department: student.department,
      teacherId: student.teacherId,
      partsMemorized: student.partsMemorized,
      currentProgress: student.currentProgress,
      previousProgress: student.previousProgress,
      attendance: student.attendance,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      isActive: student.isActive,
      images: student.images || {
        new: "",
        recent1: "",
        recent2: "",
        recent3: "",
        distant1: "",
        distant2: "",
        distant3: "",
      },
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="إدارة الطلاب" showBack={true} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">👥 الطلاب</h2>
          <p className="text-muted-foreground mb-6">
            إدارة بيانات الطلاب ومتابعة أدائهم وحضورهم
          </p>

          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4 space-x-reverse">
              <Input
                placeholder="البحث عن طالب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select
                value={filterDepartment}
                onValueChange={(value) =>
                  setFilterDepartment(value as Department | "all")
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="جميع الأقسام" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأقسام</SelectItem>
                  <SelectItem value="quran">قرآن</SelectItem>
                  <SelectItem value="tajweed">تجويد</SelectItem>
                  <SelectItem value="tarbawi">تربوي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground">
                  إضافة طالب جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>إضافة طالب جديد</DialogTitle>
                  <DialogDescription>
                    أدخل بيانات الطالب الجديد
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      الاسم
                    </Label>
                    <Input
                      id="name"
                      value={newStudent.name}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="age" className="text-right">
                      العمر
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={newStudent.age}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          age: parseInt(e.target.value) || 0,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="grade" className="text-right">
                      المرحلة الدراسية
                    </Label>
                    <Input
                      id="grade"
                      value={newStudent.grade}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, grade: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      القسم
                    </Label>
                    <Select
                      value={newStudent.department}
                      onValueChange={(value) =>
                        setNewStudent({
                          ...newStudent,
                          department: value as Department,
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="اختر القسم" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quran">قرآن</SelectItem>
                        <SelectItem value="tajweed">تجويد</SelectItem>
                        <SelectItem value="tarbawi">تربوي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacherId" className="text-right">
                      المعلم
                    </Label>
                    <Select
                      value={newStudent.teacherId}
                      onValueChange={(value) =>
                        setNewStudent({ ...newStudent, teacherId: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="اختر المعلم" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teacher1">
                          الشيخ خالد أحمد
                        </SelectItem>
                        <SelectItem value="teacher2">
                          الشيخ أحمد محمد
                        </SelectItem>
                        <SelectItem value="teacher3">الشيخ محمد حسن</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="parentName" className="text-right">
                      اسم ولي الأمر
                    </Label>
                    <Input
                      id="parentName"
                      value={newStudent.parentName}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          parentName: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="parentPhone" className="text-right">
                      هاتف ولي الأمر
                    </Label>
                    <Input
                      id="parentPhone"
                      value={newStudent.parentPhone}
                      onChange={(e) =>
                        setNewStudent({
                          ...newStudent,
                          parentPhone: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>

                  {/* إضافة خانات الصور المتعددة */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium">
                      الصور الجديدة
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Input
                        placeholder="الصورة الجديدة"
                        value={newStudent.images?.new || ""}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            images: {
                              ...newStudent.images,
                              new: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium">
                      الماضي القريب
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Input
                        placeholder="الماضي القريب 1"
                        value={newStudent.images?.recent1 || ""}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            images: {
                              ...newStudent.images,
                              recent1: e.target.value,
                            },
                          })
                        }
                      />
                      <Input
                        placeholder="الماضي القريب 2"
                        value={newStudent.images?.recent2 || ""}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            images: {
                              ...newStudent.images,
                              recent2: e.target.value,
                            },
                          })
                        }
                      />
                      <Input
                        placeholder="الماضي القريب 3"
                        value={newStudent.images?.recent3 || ""}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            images: {
                              ...newStudent.images,
                              recent3: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium">
                      الماضي البعيد
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Input
                        placeholder="الماضي البعيد 1"
                        value={newStudent.images?.distant1 || ""}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            images: {
                              ...newStudent.images,
                              distant1: e.target.value,
                            },
                          })
                        }
                      />
                      <Input
                        placeholder="الماضي البعيد 2"
                        value={newStudent.images?.distant2 || ""}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            images: {
                              ...newStudent.images,
                              distant2: e.target.value,
                            },
                          })
                        }
                      />
                      <Input
                        placeholder="الماضي البعيد 3"
                        value={newStudent.images?.distant3 || ""}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            images: {
                              ...newStudent.images,
                              distant3: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    إلغاء
                  </Button>
                  <Button onClick={handleAddStudent}>إضافة طالب</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">جميع الطلاب</TabsTrigger>
            <TabsTrigger value="attendance">الحضور والغياب</TabsTrigger>
            <TabsTrigger value="grades">الدرجات</TabsTrigger>
            <TabsTrigger value="images">الصور المحفوظة</TabsTrigger>
            <TabsTrigger value="notes">الملاحظات</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>قائمة الطلاب</CardTitle>
                <CardDescription>
                  جميع الطلاب المسجلين في المركز
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الطالب</TableHead>
                      <TableHead>العمر</TableHead>
                      <TableHead>القسم</TableHead>
                      <TableHead>المعلم</TableHead>
                      <TableHead>الأجزاء المحفوظة</TableHead>
                      <TableHead>نسبة الحضور</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <Avatar>
                              <AvatarImage src="" />
                              <AvatarFallback>
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {student.grade}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{student.age}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getDepartmentName(student.department)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {teachers[student.teacherId as keyof typeof teachers]}
                        </TableCell>
                        <TableCell>{student.partsMemorized}</TableCell>
                        <TableCell
                          className={getAttendanceColor(student.attendance)}
                        >
                          {student.attendance}%
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              student.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {student.isActive ? "نشط" : "غير نشط"}
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
                              onClick={() => openEditDialog(student)}
                            >
                              تعديل
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openDeleteDialog(student)}
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

          <TabsContent value="attendance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>الحضور والغياب</CardTitle>
                <CardDescription>
                  متابعة حضور الطلاب ونسبة الغياب
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{student.name}</h3>
                        <Badge
                          className={getAttendanceColor(student.attendance)}
                        >
                          {student.attendance}%
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {teachers[student.teacherId as keyof typeof teachers]} •{" "}
                        {getDepartmentName(student.department)}
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${student.attendance}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grades" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>درجات الاختبارات</CardTitle>
                <CardDescription>
                  عرض درجات الطلاب في جميع المواد
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-3">{student.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(studentsGrades[student.id] || []).map(
                          (grade, index) => (
                            <div key={index} className="text-center">
                              <div className="text-lg font-bold">
                                {grade.grade}%
                              </div>
                              <Badge className={getGradeColor(grade.grade)}>
                                {grade.status}
                              </Badge>
                              <div className="text-sm text-muted-foreground mt-1">
                                {grade.subject}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>الصور المحفوظة للطلاب</CardTitle>
                <CardDescription>
                  عرض ومتابعة صور القرآن المحفوظة لكل طالب
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-4 flex items-center gap-2">
                        {student.name}
                        <Badge variant="outline" className="text-xs">
                          {getDepartmentName(student.department)}
                        </Badge>
                      </h3>

                      {student.images && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* الصورة الجديدة */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-green-700 bg-green-50 p-2 rounded border border-green-200">
                              📖 الصورة الجديدة
                            </h4>
                            <div className="p-3 bg-green-100 rounded border border-green-300 min-h-[60px]">
                              <p className="text-sm text-green-800">
                                {student.images.new ||
                                  "لم يتم تسجيل صورة جديدة"}
                              </p>
                            </div>
                          </div>

                          {/* الماضي القريب */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
                              📚 الماضي القريب
                            </h4>
                            <div className="space-y-2">
                              <div className="p-2 bg-blue-100 rounded border border-blue-300">
                                <p className="text-xs text-blue-600">1:</p>
                                <p className="text-sm text-blue-800">
                                  {student.images.recent1 || "لا يوجد"}
                                </p>
                              </div>
                              <div className="p-2 bg-blue-100 rounded border border-blue-300">
                                <p className="text-xs text-blue-600">2:</p>
                                <p className="text-sm text-blue-800">
                                  {student.images.recent2 || "لا يوجد"}
                                </p>
                              </div>
                              <div className="p-2 bg-blue-100 rounded border border-blue-300">
                                <p className="text-xs text-blue-600">3:</p>
                                <p className="text-sm text-blue-800">
                                  {student.images.recent3 || "لا يوجد"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* الماضي البعيد */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">
                              📜 الماضي البعيد
                            </h4>
                            <div className="space-y-2">
                              <div className="p-2 bg-orange-100 rounded border border-orange-300">
                                <p className="text-xs text-orange-600">1:</p>
                                <p className="text-sm text-orange-800">
                                  {student.images.distant1 || "لا يوجد"}
                                </p>
                              </div>
                              <div className="p-2 bg-orange-100 rounded border border-orange-300">
                                <p className="text-xs text-orange-600">2:</p>
                                <p className="text-sm text-orange-800">
                                  {student.images.distant2 || "لا يوجد"}
                                </p>
                              </div>
                              <div className="p-2 bg-orange-100 rounded border border-orange-300">
                                <p className="text-xs text-orange-600">3:</p>
                                <p className="text-sm text-orange-800">
                                  {student.images.distant3 || "لا يوجد"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {!student.images && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>لا توجد صور مسجلة لهذا الطالب</p>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <span>
                            إجمالي الأجزاء المحفوظة: {student.partsMemorized}
                          </span>
                          <span>التقدم الحالي: {student.currentProgress}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>ملاحظات المشرفين</CardTitle>
                <CardDescription>ملاحظات سلوكية وأدائية للطلاب</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-3">{student.name}</h3>
                      {(studentsNotes[student.id] || []).length > 0 ? (
                        <div className="space-y-2">
                          {studentsNotes[student.id].map((note) => (
                            <div
                              key={note.id}
                              className="flex items-start justify-between p-3 bg-muted rounded-lg"
                            >
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 space-x-reverse mb-1">
                                  <Badge
                                    className={getNoteTypeColor(note.type)}
                                  >
                                    {note.type}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {note.date} • {note.teacher}
                                  </span>
                                </div>
                                <p>{note.content}</p>
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
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          لا توجد ملاحظات لهذا الطالب
                        </p>
                      )}
                      <Button variant="outline" className="mt-3">
                        إضافة ملاحظة جديدة
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل بيانات الطالب</DialogTitle>
            <DialogDescription>قم بتعديل بيانات الطالب</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                الاسم
              </Label>
              <Input
                id="edit-name"
                value={newStudent.name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-age" className="text-right">
                العمر
              </Label>
              <Input
                id="edit-age"
                type="number"
                value={newStudent.age}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    age: parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-grade" className="text-right">
                المرحلة الدراسية
              </Label>
              <Input
                id="edit-grade"
                value={newStudent.grade}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, grade: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-department" className="text-right">
                القسم
              </Label>
              <Select
                value={newStudent.department}
                onValueChange={(value) =>
                  setNewStudent({
                    ...newStudent,
                    department: value as Department,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر القسم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quran">قرآن</SelectItem>
                  <SelectItem value="tajweed">تجويد</SelectItem>
                  <SelectItem value="tarbawi">تربوي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-teacherId" className="text-right">
                المعلم
              </Label>
              <Select
                value={newStudent.teacherId}
                onValueChange={(value) =>
                  setNewStudent({ ...newStudent, teacherId: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر المعلم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher1">الشيخ خالد أحمد</SelectItem>
                  <SelectItem value="teacher2">الشيخ أحمد محمد</SelectItem>
                  <SelectItem value="teacher3">الشيخ محمد حسن</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-parentName" className="text-right">
                اسم ولي الأمر
              </Label>
              <Input
                id="edit-parentName"
                value={newStudent.parentName}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, parentName: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-parentPhone" className="text-right">
                هاتف ولي الأمر
              </Label>
              <Input
                id="edit-parentPhone"
                value={newStudent.parentPhone}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, parentPhone: e.target.value })
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
            <Button onClick={handleEditStudent}>حفظ التعديلات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف الطالب "{selectedStudent?.name}"؟ لا يمكن
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
            <Button variant="destructive" onClick={handleDeleteStudent}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
