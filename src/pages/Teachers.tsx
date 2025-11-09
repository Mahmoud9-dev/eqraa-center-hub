import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

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
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load data from Supabase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: teachersData } = await supabase
      .from("teachers")
      .select("*")
      .order("name");

    if (teachersData) {
      const mappedTeachers: Teacher[] = teachersData.map((t: any) => ({
        id: t.id,
        name: t.name,
        specialization: t.specialization,
        department: t.department as Department,
        email: t.email,
        phone: t.phone,
        experience: t.experience,
        isActive: t.is_active,
        createdAt: new Date(t.created_at),
      }));
      setTeachers(mappedTeachers);
    }
    setLoading(false);
  };

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
  const handleAddTeacher = async () => {
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

    const { error } = await supabase.from("teachers").insert([
      {
        name: newTeacher.name || "",
        specialization: newTeacher.specialization || "",
        department: newTeacher.department,
        email: newTeacher.email || null,
        phone: newTeacher.phone || null,
        experience: newTeacher.experience || 0,
        is_active: newTeacher.isActive !== undefined ? newTeacher.isActive : true,
      },
    ]);

    if (error) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

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
    loadData();
  };

  const handleEditTeacher = async () => {
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

    const { error } = await supabase
      .from("teachers")
      .update({
        name: newTeacher.name,
        specialization: newTeacher.specialization,
        department: newTeacher.department,
        email: newTeacher.email || null,
        phone: newTeacher.phone || null,
        experience: newTeacher.experience,
        is_active: newTeacher.isActive,
      })
      .eq("id", selectedTeacher.id);

    if (error) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

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
    loadData();
  };

  const handleDeleteTeacher = async () => {
    if (!selectedTeacher) return;

    const { error } = await supabase
      .from("teachers")
      .delete()
      .eq("id", selectedTeacher.id);

    if (error) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setIsDeleteDialogOpen(false);
    setSelectedTeacher(null);
    toast({
      title: "تم الحذف",
      description: "تم حذف المدرس بنجاح",
    });
    loadData();
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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">🧑‍🏫 المدرسون والمشايخ</h2>
          <p className="text-muted-foreground mb-6">
            إدارة بيانات المدرسين والمشايخ والمواد التي يدرسونها
          </p>

          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4 space-x-reverse">
              <Input
                placeholder="البحث عن مدرس..."
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
                  إضافة مدرس جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>إضافة مدرس جديد</DialogTitle>
                  <DialogDescription>
                    أدخل بيانات المدرس الجديد
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      الاسم
                    </Label>
                    <Input
                      id="name"
                      value={newTeacher.name}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="specialization" className="text-right">
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
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
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
                    <Label htmlFor="email" className="text-right">
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newTeacher.email}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, email: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      رقم الهاتف
                    </Label>
                    <Input
                      id="phone"
                      value={newTeacher.phone}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, phone: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="experience" className="text-right">
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
                  <Button onClick={handleAddTeacher}>إضافة مدرس</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المدرس</TableHead>
                      <TableHead>التخصص</TableHead>
                      <TableHead>القسم</TableHead>
                      <TableHead>الخبرة</TableHead>
                      <TableHead>عدد الطلاب</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <Avatar>
                              <AvatarImage src="" />
                              <AvatarFallback>
                                {teacher.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{teacher.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {teacher.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{teacher.specialization}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getDepartmentName(teacher.department)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getExperienceColor(teacher.experience)}
                          >
                            {teacher.experience} سنة
                          </Badge>
                        </TableCell>
                        <TableCell>{teacher.studentsCount}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              teacher.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {teacher.isActive ? "نشط" : "غير نشط"}
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
                              onClick={() => openEditDialog(teacher)}
                            >
                              تعديل
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openDeleteDialog(teacher)}
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
