'use client';

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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Department, Teacher } from "@/types";

const Teachers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<Department | "all">(
    "all"
  );
  const [activeTab, setActiveTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const { toast } = useToast();

  // Mock data - will be replaced with actual data from Supabase
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: "1",
      name: "الشيخ أحمد محمد علي",
      specialization: "حفظ القرآن الكريم وتجويد",
      department: "quran" as Department,
      email: "ahmed@example.com",
      phone: "01234567890",
      experience: 15,
      isActive: true,
      createdAt: new Date("2020-09-01"),
    },
    {
      id: "2",
      name: "الشيخ خالد حسن محمد",
      specialization: "الفقه والعقيدة",
      department: "tarbawi" as Department,
      email: "khaled@example.com",
      phone: "01234567891",
      experience: 10,
      isActive: true,
      createdAt: new Date("2021-03-15"),
    },
    {
      id: "3",
      name: "الشيخ محمد سعيد أحمد",
      specialization: "السيرة والحديث",
      department: "tarbawi" as Department,
      email: "mohammed@example.com",
      phone: "01234567892",
      experience: 8,
      isActive: true,
      createdAt: new Date("2022-01-10"),
    },
    {
      id: "4",
      name: "الشيخ عمر عبدالله",
      specialization: "التجويد والقراءات",
      department: "tajweed" as Department,
      email: "omar@example.com",
      phone: "01234567893",
      experience: 12,
      isActive: true,
      createdAt: new Date("2019-11-20"),
    },
  ]);

  // Extended teacher data for display
  const teachersExtended = teachers.map((teacher) => ({
    ...teacher,
    bio:
      teacher.id === "1"
        ? "شيخ متخصص في حفظ القرآن الكريم بإجازة في القراءات العشر"
        : teacher.id === "2"
        ? "متخصص في الفقه المقارن وأصول الفقه"
        : teacher.id === "3"
        ? "باحث في السيرة النبوية وعلوم الحديث"
        : "مجاز في التجويد والقراءات السبع",
    subjects:
      teacher.id === "1"
        ? ["حفظ القرآن", "تجويد", "القراءات"]
        : teacher.id === "2"
        ? ["الفقه", "العقيدة", "أصول الفقه"]
        : teacher.id === "3"
        ? ["السيرة النبوية", "الحديث", "التربية الإسلامية"]
        : ["التجويد", "القراءات", "القرآن"],
    studentsCount:
      teacher.id === "1"
        ? 25
        : teacher.id === "2"
        ? 18
        : teacher.id === "3"
        ? 22
        : 20,
  }));

  // Form state
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    name: "",
    specialization: "",
    department: "quran",
    email: "",
    phone: "",
    experience: 0,
    isActive: true,
  });

  const filteredTeachers = teachersExtended.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === "all" || teacher.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

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

  const getExperienceColor = (years: number) => {
    if (years >= 15) return "bg-green-100 text-green-800";
    if (years >= 10) return "bg-blue-100 text-blue-800";
    if (years >= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  // CRUD functions
  const handleAddTeacher = () => {
    if (
      !newTeacher.name ||
      !newTeacher.specialization ||
      !newTeacher.department
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const teacher: Teacher = {
      id: Date.now().toString(),
      name: newTeacher.name || "",
      specialization: newTeacher.specialization || "",
      department: newTeacher.department as Department,
      email: newTeacher.email,
      phone: newTeacher.phone,
      experience: newTeacher.experience || 0,
      isActive: newTeacher.isActive || true,
      createdAt: new Date(),
    };

    setTeachers([...teachers, teacher]);
    setNewTeacher({
      name: "",
      specialization: "",
      department: "quran",
      email: "",
      phone: "",
      experience: 0,
      isActive: true,
    });
    setIsAddDialogOpen(false);
    toast({
      title: "تم الإضافة",
      description: "تم إضافة المدرس بنجاح",
    });
  };

  const handleEditTeacher = () => {
    if (
      !selectedTeacher ||
      !newTeacher.name ||
      !newTeacher.specialization ||
      !newTeacher.department
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setTeachers(
      teachers.map((teacher) =>
        teacher.id === selectedTeacher.id
          ? {
              ...teacher,
              name: newTeacher.name || teacher.name,
              specialization:
                newTeacher.specialization || teacher.specialization,
              department:
                (newTeacher.department as Department) || teacher.department,
              email: newTeacher.email || teacher.email,
              phone: newTeacher.phone || teacher.phone,
              experience: newTeacher.experience || teacher.experience,
              isActive:
                newTeacher.isActive !== undefined
                  ? newTeacher.isActive
                  : teacher.isActive,
            }
          : teacher
      )
    );

    setIsEditDialogOpen(false);
    setSelectedTeacher(null);
    setNewTeacher({
      name: "",
      specialization: "",
      department: "quran",
      email: "",
      phone: "",
      experience: 0,
      isActive: true,
    });
    toast({
      title: "تم التعديل",
      description: "تم تعديل بيانات المدرس بنجاح",
    });
  };

  const handleDeleteTeacher = () => {
    if (!selectedTeacher) return;

    setTeachers(
      teachers.filter((teacher) => teacher.id !== selectedTeacher.id)
    );
    setIsDeleteDialogOpen(false);
    setSelectedTeacher(null);
    toast({
      title: "تم الحذف",
      description: "تم حذف المدرس بنجاح",
    });
  };

  const openEditDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setNewTeacher({
      name: teacher.name,
      specialization: teacher.specialization,
      department: teacher.department,
      email: teacher.email,
      phone: teacher.phone,
      experience: teacher.experience,
      isActive: teacher.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="المدرسون والمشايخ" showBack={true} />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            🧑‍🏫 المدرسون والمشايخ
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
            إدارة بيانات المدرسين والمشايخ والمواد التي يدرسونها
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-4 space-x-0 sm:space-x-4 space-x-reverse">
              <Input
                placeholder="البحث عن مدرس..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 text-base sm:text-sm"
              />
              <Select
                value={filterDepartment}
                onValueChange={(value) =>
                  setFilterDepartment(value as Department | "all")
                }
              >
                <SelectTrigger className="w-full sm:w-48 text-base sm:text-sm">
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
                <Button className="bg-primary text-primary-foreground w-full sm:w-auto text-sm">
                  إضافة مدرس جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-base">
                    إضافة مدرس جديد
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-xs">
                    أدخل بيانات المدرس الجديد
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <Label htmlFor="name" className="text-right sm:text-sm">
                      الاسم
                    </Label>
                    <Input
                      id="name"
                      value={newTeacher.name}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, name: e.target.value })
                      }
                      className="col-span-1 sm:col-span-3 text-base sm:text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <Label
                      htmlFor="specialization"
                      className="text-right sm:text-sm"
                    >
                      التخصص
                    </Label>
                    <Input
                      id="specialization"
                      value={newTeacher.specialization}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          specialization: e.target.value,
                        })
                      }
                      className="col-span-1 sm:col-span-3 text-base sm:text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <Label
                      htmlFor="department"
                      className="text-right sm:text-sm"
                    >
                      القسم
                    </Label>
                    <Select
                      value={newTeacher.department}
                      onValueChange={(value) =>
                        setNewTeacher({
                          ...newTeacher,
                          department: value as Department,
                        })
                      }
                    >
                      <SelectTrigger className="col-span-1 sm:col-span-3 text-base sm:text-sm">
                        <SelectValue placeholder="اختر القسم" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quran">قرآن</SelectItem>
                        <SelectItem value="tajweed">تجويد</SelectItem>
                        <SelectItem value="tarbawi">تربوي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <Label htmlFor="email" className="text-right sm:text-sm">
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newTeacher.email}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, email: e.target.value })
                      }
                      className="col-span-1 sm:col-span-3 text-base sm:text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <Label htmlFor="phone" className="text-right sm:text-sm">
                      رقم الهاتف
                    </Label>
                    <Input
                      id="phone"
                      value={newTeacher.phone}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, phone: e.target.value })
                      }
                      className="col-span-1 sm:col-span-3 text-base sm:text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <Label
                      htmlFor="experience"
                      className="text-right sm:text-sm"
                    >
                      الخبرة (سنوات)
                    </Label>
                    <Input
                      id="experience"
                      type="number"
                      value={newTeacher.experience}
                      onChange={(e) =>
                        setNewTeacher({
                          ...newTeacher,
                          experience: parseInt(e.target.value) || 0,
                        })
                      }
                      className="col-span-1 sm:col-span-3 text-base sm:text-sm"
                    />
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
                  <Button onClick={handleAddTeacher} className="text-sm">
                    إضافة مدرس
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
            <TabsTrigger value="all">جميع المدرسين</TabsTrigger>
            <TabsTrigger value="profile">الملفات الشخصية</TabsTrigger>
            <TabsTrigger value="contact">التواصل</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>قائمة المدرسين</CardTitle>
                <CardDescription>
                  جميع المدرسين والمشايخ المسجلين في المركز
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">
                          المدرس
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">
                          التخصص
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm">
                          القسم
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">
                          الخبرة
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">
                          الطلاب
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm">
                          الحالة
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm">
                          إجراءات
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTeachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse">
                              <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                                <AvatarImage src="" />
                                <AvatarFallback className="text-xs sm:text-sm">
                                  {teacher.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-xs sm:text-sm">
                                  {teacher.name}
                                </div>
                                <div className="text-xs text-muted-foreground hidden sm:block">
                                  {teacher.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                            {teacher.specialization}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <Badge variant="outline" className="text-xs">
                              {getDepartmentName(teacher.department)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                            <Badge
                              className={getExperienceColor(teacher.experience)}
                            >
                              {teacher.experience} سنة
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            {teacher.studentsCount}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <Badge
                              className={
                                teacher.isActive
                                  ? "bg-green-100 text-green-800 text-xs"
                                  : "bg-red-100 text-red-800 text-xs"
                              }
                            >
                              {teacher.isActive ? "نشط" : "غير نشط"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex space-x-1 space-x-reverse">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs px-2 py-1 h-7 sm:h-8 sm:px-3"
                              >
                                عرض
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(teacher)}
                                className="text-xs px-2 py-1 h-7 sm:h-8 sm:px-3"
                              >
                                تعديل
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openDeleteDialog(teacher)}
                                className="text-xs px-2 py-1 h-7 sm:h-8 sm:px-3"
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

          <TabsContent value="profile" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTeachers.map((teacher) => (
                <Card key={teacher.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 space-x-reverse">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {teacher.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{teacher.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {teacher.specialization}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">نبذة عن المدرس</h4>
                        <p className="text-sm text-muted-foreground">
                          {teacher.bio}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">المواد التي يدرسها</h4>
                        <div className="flex flex-wrap gap-2">
                          {teacher.subjects.map((subject, index) => (
                            <Badge key={index} variant="outline">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-1">الخبرة</h4>
                          <p className="text-sm text-muted-foreground">
                            {teacher.experience} سنة
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">عدد الطلاب</h4>
                          <p className="text-sm text-muted-foreground">
                            {teacher.studentsCount} طالب
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-1">
                            البريد الإلكتروني
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {teacher.email}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">رقم الهاتف</h4>
                          <p className="text-sm text-muted-foreground">
                            {teacher.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2 space-x-reverse">
                        <Button variant="outline" size="sm">
                          تعديل الملف الشخصي
                        </Button>
                        <Button variant="outline" size="sm">
                          عرض الجدول
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>إرسال سؤال للمدرسين</CardTitle>
                <CardDescription>
                  اختر المدرس وأرسل سؤالك مباشرة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      اختر المدرس
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المدرس..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredTeachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      نوع السؤال
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع السؤال..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">سؤال عام</SelectItem>
                        <SelectItem value="academic">سؤال أكاديمي</SelectItem>
                        <SelectItem value="administrative">
                          سؤال إداري
                        </SelectItem>
                        <SelectItem value="private">سؤال خاص</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      السؤال
                    </label>
                    <Textarea placeholder="اكتب سؤالك هنا..." rows={4} />
                  </div>

                  <div className="flex space-x-2 space-x-reverse">
                    <Button className="bg-primary text-primary-foreground">
                      إرسال السؤال
                    </Button>
                    <Button variant="outline">إرسال لجميع المدرسين</Button>
                  </div>
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
            <DialogTitle>تعديل بيانات المدرس</DialogTitle>
            <DialogDescription>قم بتعديل بيانات المدرس</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                الاسم
              </Label>
              <Input
                id="edit-name"
                value={newTeacher.name}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-specialization" className="text-right">
                التخصص
              </Label>
              <Input
                id="edit-specialization"
                value={newTeacher.specialization}
                onChange={(e) =>
                  setNewTeacher({
                    ...newTeacher,
                    specialization: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-department" className="text-right">
                القسم
              </Label>
              <Select
                value={newTeacher.department}
                onValueChange={(value) =>
                  setNewTeacher({
                    ...newTeacher,
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
              <Label htmlFor="edit-email" className="text-right">
                البريد الإلكتروني
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={newTeacher.email}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone" className="text-right">
                رقم الهاتف
              </Label>
              <Input
                id="edit-phone"
                value={newTeacher.phone}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, phone: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-experience" className="text-right">
                الخبرة (سنوات)
              </Label>
              <Input
                id="edit-experience"
                type="number"
                value={newTeacher.experience}
                onChange={(e) =>
                  setNewTeacher({
                    ...newTeacher,
                    experience: parseInt(e.target.value) || 0,
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
            <Button onClick={handleEditTeacher}>حفظ التعديلات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف المدرس "{selectedTeacher?.name}"؟ لا يمكن
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
            <Button variant="destructive" onClick={handleDeleteTeacher}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teachers;
