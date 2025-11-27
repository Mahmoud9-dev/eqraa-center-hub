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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import { Announcement, NotificationType, UserRole } from "@/types";

const Announcements = () => {
  const [activeTab, setActiveTab] = useState("announcements");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const { toast } = useToast();

  // Mock data - will be replaced with actual data from Supabase
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "إعلان هام: بدء التسجيل للحلقات الصيفية",
      content:
        "يسر المركز الإعلان عن بدء التسجيل في الحلقات القرآنية الصيفية للعام 2025، مع توفير خصومات خاصة للمبكرين في التسجيل.",
      type: "إعلان عام",
      targetAudience: ["admin", "teacher", "student", "parent"],
      isActive: true,
      createdBy: "admin1",
      createdAt: new Date("2025-11-01"),
      scheduledFor: new Date("2025-11-05"),
    },
    {
      id: "2",
      title: "تنبيه: اختبار تجويد يوم الأحد القادم",
      content:
        "تنبيه لجميع طلاب قسم التجويد بوجود اختبار شامل يوم الأحد القادم الساعة 10 صباحاً، يرجى المراجعة الجيدة.",
      type: "تنبيه",
      targetAudience: ["student"],
      isActive: true,
      createdBy: "teacher1",
      createdAt: new Date("2025-11-02"),
    },
    {
      id: "3",
      title: "موعد حلقة حفظ القرآن",
      content:
        "تذكير بموعد حلقة حفظ القرآن يوم الثلاثاء القادم الساعة 4 عصراً، في القاعة الرئيسية.",
      type: "موعد حلقة",
      targetAudience: ["student"],
      isActive: true,
      createdBy: "teacher2",
      createdAt: new Date("2025-11-03"),
    },
    {
      id: "4",
      title: "موعد اختبار تربوي",
      content:
        "اختبار في مادة الآداب الإسلامية يوم الخميس القادم الساعة 11 صباحاً، في قاعة الاختبارات.",
      type: "موعد اختبار",
      targetAudience: ["student"],
      isActive: true,
      createdBy: "teacher3",
      createdAt: new Date("2025-11-04"),
    },
  ]);

  // Form state
  const [newAnnouncement, setNewAnnouncement] = useState<Partial<Announcement>>(
    {
      title: "",
      content: "",
      type: "إعلان عام",
      targetAudience: [],
      isActive: true,
      scheduledFor: undefined,
    }
  );

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case "إعلان عام":
        return "bg-blue-100 text-blue-800";
      case "تنبيه":
        return "bg-yellow-100 text-yellow-800";
      case "موعد حلقة":
        return "bg-green-100 text-green-800";
      case "موعد اختبار":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "الإدارة";
      case "teacher":
        return "المدرسون";
      case "student":
        return "الطلاب";
      case "parent":
        return "أولياء الأمور";
      case "viewer":
        return "المشاهدون";
      default:
        return role;
    }
  };

  // CRUD functions
  const handleAddAnnouncement = () => {
    if (
      !newAnnouncement.title ||
      !newAnnouncement.content ||
      !newAnnouncement.type
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    if (
      !newAnnouncement.targetAudience ||
      newAnnouncement.targetAudience.length === 0
    ) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار الجمهور المستهدف",
        variant: "destructive",
      });
      return;
    }

    const announcement: Announcement = {
      id: Date.now().toString(),
      title: newAnnouncement.title || "",
      content: newAnnouncement.content || "",
      type: newAnnouncement.type as NotificationType,
      targetAudience: newAnnouncement.targetAudience as UserRole[],
      isActive: newAnnouncement.isActive || true,
      createdBy: "current_user", // Will be replaced with actual user ID
      createdAt: new Date(),
      scheduledFor: newAnnouncement.scheduledFor,
    };

    setAnnouncements([...announcements, announcement]);
    setNewAnnouncement({
      title: "",
      content: "",
      type: "إعلان عام",
      targetAudience: [],
      isActive: true,
      scheduledFor: undefined,
    });
    setIsAddDialogOpen(false);
    toast({
      title: "تم الإضافة",
      description: "تم إضافة الإعلان بنجاح",
    });
  };

  const handleEditAnnouncement = () => {
    if (
      !selectedAnnouncement ||
      !newAnnouncement.title ||
      !newAnnouncement.content ||
      !newAnnouncement.type
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    if (
      !newAnnouncement.targetAudience ||
      newAnnouncement.targetAudience.length === 0
    ) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار الجمهور المستهدف",
        variant: "destructive",
      });
      return;
    }

    setAnnouncements(
      announcements.map((announcement) =>
        announcement.id === selectedAnnouncement.id
          ? {
              ...announcement,
              title: newAnnouncement.title || announcement.title,
              content: newAnnouncement.content || announcement.content,
              type:
                (newAnnouncement.type as NotificationType) || announcement.type,
              targetAudience:
                (newAnnouncement.targetAudience as UserRole[]) ||
                announcement.targetAudience,
              isActive:
                newAnnouncement.isActive !== undefined
                  ? newAnnouncement.isActive
                  : announcement.isActive,
              scheduledFor:
                newAnnouncement.scheduledFor || announcement.scheduledFor,
            }
          : announcement
      )
    );

    setIsEditDialogOpen(false);
    setSelectedAnnouncement(null);
    setNewAnnouncement({
      title: "",
      content: "",
      type: "إعلان عام",
      targetAudience: [],
      isActive: true,
      scheduledFor: undefined,
    });
    toast({
      title: "تم التعديل",
      description: "تم تعديل الإعلان بنجاح",
    });
  };

  const handleDeleteAnnouncement = () => {
    if (!selectedAnnouncement) return;

    setAnnouncements(
      announcements.filter(
        (announcement) => announcement.id !== selectedAnnouncement.id
      )
    );
    setIsDeleteDialogOpen(false);
    setSelectedAnnouncement(null);
    toast({
      title: "تم الحذف",
      description: "تم حذف الإعلان بنجاح",
    });
  };

  const openEditDialog = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      targetAudience: announcement.targetAudience,
      isActive: announcement.isActive,
      scheduledFor: announcement.scheduledFor,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDeleteDialogOpen(true);
  };

  const handleTargetAudienceChange = (role: UserRole, checked: boolean) => {
    const currentAudience = newAnnouncement.targetAudience || [];
    if (checked) {
      setNewAnnouncement({
        ...newAnnouncement,
        targetAudience: [...currentAudience, role],
      });
    } else {
      setNewAnnouncement({
        ...newAnnouncement,
        targetAudience: currentAudience.filter((r) => r !== role),
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="الإعلانات والتنبيهات" showBack={true} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">📢 الإعلانات والتنبيهات</h2>
          <p className="text-muted-foreground mb-6">
            إدارة الإعلانات العامة والتنبيهات والمواعيد الهامة
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Input placeholder="البحث عن إعلان..." className="w-full sm:w-64" />
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="جميع الأنواع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="إعلان عام">إعلان عام</SelectItem>
                  <SelectItem value="تنبيه">تنبيه</SelectItem>
                  <SelectItem value="موعد حلقة">موعد حلقة</SelectItem>
                  <SelectItem value="موعد اختبار">موعد اختبار</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground">
                  إنشاء إعلان جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>إنشاء إعلان جديد</DialogTitle>
                  <DialogDescription>
                    أدخل بيانات الإعلان الجديد
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      العنوان
                    </Label>
                    <Input
                      id="title"
                      value={newAnnouncement.title}
                      onChange={(e) =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          title: e.target.value,
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
                      value={newAnnouncement.type}
                      onValueChange={(value) =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          type: value as NotificationType,
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="إعلان عام">إعلان عام</SelectItem>
                        <SelectItem value="تنبيه">تنبيه</SelectItem>
                        <SelectItem value="موعد حلقة">موعد حلقة</SelectItem>
                        <SelectItem value="موعد اختبار">موعد اختبار</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="content" className="text-right">
                      المحتوى
                    </Label>
                    <Textarea
                      id="content"
                      value={newAnnouncement.content}
                      onChange={(e) =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          content: e.target.value,
                        })
                      }
                      className="col-span-3"
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="scheduledFor" className="text-right">
                      موعد النشر
                    </Label>
                    <Input
                      id="scheduledFor"
                      type="datetime-local"
                      value={newAnnouncement.scheduledFor
                        ?.toISOString()
                        .slice(0, 16)}
                      onChange={(e) =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          scheduledFor: e.target.value
                            ? new Date(e.target.value)
                            : undefined,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">الجمهور المستهدف</Label>
                    <div className="col-span-3 space-y-2">
                      {(
                        [
                          "admin",
                          "teacher",
                          "student",
                          "parent",
                          "viewer",
                        ] as UserRole[]
                      ).map((role) => (
                        <div
                          key={role}
                          className="flex items-center space-x-2 space-x-reverse"
                        >
                          <Checkbox
                            id={role}
                            checked={
                              newAnnouncement.targetAudience?.includes(role) ||
                              false
                            }
                            onCheckedChange={(checked) =>
                              handleTargetAudienceChange(
                                role,
                                checked as boolean
                              )
                            }
                          />
                          <Label htmlFor={role} className="text-sm">
                            {getRoleName(role)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="isActive" className="text-right">
                      الحالة
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id="isActive"
                        checked={newAnnouncement.isActive || false}
                        onCheckedChange={(checked) =>
                          setNewAnnouncement({
                            ...newAnnouncement,
                            isActive: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="isActive" className="text-sm">
                        نشط
                      </Label>
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
                  <Button onClick={handleAddAnnouncement}>إنشاء إعلان</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="announcements">الإعلانات</TabsTrigger>
            <TabsTrigger value="notifications">التنبيهات</TabsTrigger>
            <TabsTrigger value="scheduled">المجدولة</TabsTrigger>
          </TabsList>

          <TabsContent value="announcements" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>قائمة الإعلانات</CardTitle>
                <CardDescription>
                  عرض وإدارة جميع الإعلانات والتنبيهات
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mobile Card View */}
                <div className="block md:hidden space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm leading-tight">{announcement.title}</h4>
                        <Badge className={`${getTypeColor(announcement.type)} text-xs shrink-0`}>
                          {announcement.type}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {announcement.targetAudience.map((role) => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {getRoleName(role)}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{announcement.createdAt.toLocaleDateString("ar-SA")}</span>
                        <Badge
                          className={
                            announcement.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {announcement.isActive ? "نشط" : "غير نشط"}
                        </Badge>
                      </div>
                      <div className="flex gap-2 pt-2 border-t">
                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                          عرض
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => openEditDialog(announcement)}
                        >
                          تعديل
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => openDeleteDialog(announcement)}
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
                        <TableHead>العنوان</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead className="hidden lg:table-cell">الجمهور المستهدف</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead className="hidden lg:table-cell">تاريخ الإنشاء</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {announcements.map((announcement) => (
                        <TableRow key={announcement.id}>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {announcement.title}
                          </TableCell>
                          <TableCell>
                            <Badge className={getTypeColor(announcement.type)}>
                              {announcement.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {announcement.targetAudience.map((role) => (
                                <Badge
                                  key={role}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {getRoleName(role)}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                announcement.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {announcement.isActive ? "نشط" : "غير نشط"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {announcement.createdAt.toLocaleDateString("ar-SA")}
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
                                onClick={() => openEditDialog(announcement)}
                              >
                                تعديل
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="text-xs px-2"
                                onClick={() => openDeleteDialog(announcement)}
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

          <TabsContent value="notifications" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>التنبيهات الفورية</CardTitle>
                  <CardDescription>
                    إرسال تنبيهات فورية للمستخدمين
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="block text-sm font-medium mb-2">
                        نوع التنبيه
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع التنبيه..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">تنبيه عام</SelectItem>
                          <SelectItem value="urgent">تنبيه عاجل</SelectItem>
                          <SelectItem value="reminder">تذكير</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="block text-sm font-medium mb-2">
                        الرسالة
                      </Label>
                      <Textarea placeholder="اكتب رسالة التنبيه..." rows={4} />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium mb-2">
                        المستهدفون
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المستهدفين..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">الجميع</SelectItem>
                          <SelectItem value="students">الطلاب فقط</SelectItem>
                          <SelectItem value="teachers">المدرسون فقط</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full bg-primary text-primary-foreground">
                      إرسال التنبيه
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>التنبيهات المجدولة</CardTitle>
                  <CardDescription>
                    التنبيهات المجدولة للإرسال المستقبلي
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {announcements
                      .filter(
                        (a) => a.scheduledFor && a.scheduledFor > new Date()
                      )
                      .map((announcement) => (
                        <div
                          key={announcement.id}
                          className="p-4 border rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">
                              {announcement.title}
                            </h4>
                            <Badge className={getTypeColor(announcement.type)}>
                              {announcement.type}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {announcement.content}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            موعد الإرسال:{" "}
                            {announcement.scheduledFor?.toLocaleString("ar-SA")}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>الإعلانات المجدولة</CardTitle>
                <CardDescription>
                  الإعلانات المجدولة للنشر المستقبلي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements
                    .filter(
                      (a) => a.scheduledFor && a.scheduledFor > new Date()
                    )
                    .map((announcement) => (
                      <div
                        key={announcement.id}
                        className="p-4 border rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{announcement.title}</h4>
                          <Badge className={getTypeColor(announcement.type)}>
                            {announcement.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {announcement.content}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            موعد النشر:{" "}
                            {announcement.scheduledFor?.toLocaleString("ar-SA")}
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
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تعديل الإعلان</DialogTitle>
            <DialogDescription>قم بتعديل بيانات الإعلان</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                العنوان
              </Label>
              <Input
                id="edit-title"
                value={newAnnouncement.title}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    title: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                النوع
              </Label>
              <Select
                value={newAnnouncement.type}
                onValueChange={(value) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    type: value as NotificationType,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="إعلان عام">إعلان عام</SelectItem>
                  <SelectItem value="تنبيه">تنبيه</SelectItem>
                  <SelectItem value="موعد حلقة">موعد حلقة</SelectItem>
                  <SelectItem value="موعد اختبار">موعد اختبار</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-content" className="text-right">
                المحتوى
              </Label>
              <Textarea
                id="edit-content"
                value={newAnnouncement.content}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    content: e.target.value,
                  })
                }
                className="col-span-3"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-scheduledFor" className="text-right">
                موعد النشر
              </Label>
              <Input
                id="edit-scheduledFor"
                type="datetime-local"
                value={newAnnouncement.scheduledFor?.toISOString().slice(0, 16)}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    scheduledFor: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">الجمهور المستهدف</Label>
              <div className="col-span-3 space-y-2">
                {(
                  [
                    "admin",
                    "teacher",
                    "student",
                    "parent",
                    "viewer",
                  ] as UserRole[]
                ).map((role) => (
                  <div
                    key={role}
                    className="flex items-center space-x-2 space-x-reverse"
                  >
                    <Checkbox
                      id={`edit-${role}`}
                      checked={
                        newAnnouncement.targetAudience?.includes(role) || false
                      }
                      onCheckedChange={(checked) =>
                        handleTargetAudienceChange(role, checked as boolean)
                      }
                    />
                    <Label htmlFor={`edit-${role}`} className="text-sm">
                      {getRoleName(role)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-isActive" className="text-right">
                الحالة
              </Label>
              <div className="col-span-3 flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="edit-isActive"
                  checked={newAnnouncement.isActive || false}
                  onCheckedChange={(checked) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      isActive: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="edit-isActive" className="text-sm">
                  نشط
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleEditAnnouncement}>حفظ التعديلات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف الإعلان "{selectedAnnouncement?.title}"؟ لا
              يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteAnnouncement}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Announcements;
