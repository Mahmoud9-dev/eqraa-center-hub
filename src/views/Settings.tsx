'use client';

import { useState } from "react";
import { useTheme } from "next-themes";
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
import { UserRole, UserSettings } from "@/types";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  lastLogin: Date | null;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const { toast } = useToast();
  useTheme(); // Theme provider hook - used by child components

  // Mock data - will be replaced with actual data from Supabase
  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: "1",
      name: "أحمد محمد علي",
      email: "ahmed@example.com",
      role: "admin" as UserRole,
      isActive: true,
      createdAt: new Date("2025-09-01"),
      lastLogin: new Date("2025-11-05"),
    },
    {
      id: "2",
      name: "عمر خالد حسن",
      email: "omar@example.com",
      role: "teacher" as UserRole,
      isActive: true,
      createdAt: new Date("2025-09-05"),
      lastLogin: new Date("2025-11-04"),
    },
    {
      id: "3",
      name: "محمد سعيد أحمد",
      email: "mohammed@example.com",
      role: "student" as UserRole,
      isActive: true,
      createdAt: new Date("2025-09-10"),
      lastLogin: new Date("2025-11-03"),
    },
    {
      id: "4",
      name: "فاطمة محمود",
      email: "fatima@example.com",
      role: "parent" as UserRole,
      isActive: true,
      createdAt: new Date("2025-09-15"),
      lastLogin: new Date("2025-11-02"),
    },
    {
      id: "5",
      name: "عائشة عبد الله",
      email: "aisha@example.com",
      role: "viewer" as UserRole,
      isActive: false,
      createdAt: new Date("2025-09-20"),
      lastLogin: new Date("2025-10-28"),
    },
  ]);

  const [userSettings, setUserSettings] = useState<UserSettings>({
    id: "1",
    userId: "current_user",
    theme: "فاتح",
    language: "ar",
    updatedAt: new Date(),
  });

  const [currentUser, setCurrentUser] = useState({
    id: "current_user",
    name: "أحمد محمد علي",
    email: "ahmed@example.com",
    phone: "+966 50 123 4567",
    role: "admin" as UserRole,
    avatar: "",
  });

  // Form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as UserRole,
    isActive: true,
  });

  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    role: "student" as UserRole,
    isActive: true,
  });

  const [changePassword, setChangePassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "teacher":
        return "bg-blue-100 text-blue-800";
      case "student":
        return "bg-green-100 text-green-800";
      case "parent":
        return "bg-yellow-100 text-yellow-800";
      case "viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "الإدارة";
      case "teacher":
        return "المدرس";
      case "student":
        return "الطالب";
      case "parent":
        return "ولي الأمر";
      case "viewer":
        return "المشاهد";
      default:
        return role;
    }
  };

  const getRolePermissions = (role: UserRole) => {
    switch (role) {
      case "admin":
        return [
          "التحكم الكامل في النظام",
          "إدارة المستخدمين والصلاحيات",
          "إدارة جميع البيانات",
          "عرض التقارير والإحصائيات",
          "إدارة الإعدادات العامة",
        ];
      case "teacher":
        return [
          "إدارة الطلاب المسؤولين",
          "إضافة وتعديل الدروس والمحتوى",
          "تقييم الطلاب",
          "عرض التقارير الخاصة بالطلاب",
          "إدارة الجداول الخاصة",
        ];
      case "student":
        return [
          "عرض بياناتي الشخصية",
          "عرض الدروس والمحتوى",
          "المشاركة في الاختبارات",
          "عرض جدولي الدراسي",
          "عرض تقاريري الشخصية",
        ];
      case "parent":
        return [
          "عرض بيانات الأبناء",
          "عرض أداء الأبناء",
          "متابعة الحضور والغياب",
          "عرض التقارير الخاصة بالأبناء",
          "التواصل مع المدرسين",
        ];
      case "viewer":
        return [
          "عرض البيانات العامة",
          "عرض التقارير والإحصائيات",
          "عرض المحتوى التعليمي",
          "عرض الجداول العامة",
        ];
      default:
        return [];
    }
  };

  // CRUD functions
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const user = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isActive: newUser.isActive,
      createdAt: new Date(),
      lastLogin: null,
    };

    setUsers([...users, user]);
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "student",
      isActive: true,
    });
    setIsAddUserDialogOpen(false);
    toast({
      title: "تم الإضافة",
      description: "تم إضافة المستخدم بنجاح",
    });
  };

  const handleEditUser = () => {
    if (!selectedUser || !editUser.name || !editUser.email) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setUsers(
      users.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              name: editUser.name || user.name,
              email: editUser.email || user.email,
              role: editUser.role || user.role,
              isActive:
                editUser.isActive !== undefined
                  ? editUser.isActive
                  : user.isActive,
            }
          : user
      )
    );

    setIsEditUserDialogOpen(false);
    setSelectedUser(null);
    setEditUser({
      name: "",
      email: "",
      role: "student",
      isActive: true,
    });
    toast({
      title: "تم التعديل",
      description: "تم تعديل المستخدم بنجاح",
    });
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;

    setUsers(users.filter((user) => user.id !== selectedUser.id));
    setIsDeleteUserDialogOpen(false);
    setSelectedUser(null);
    toast({
      title: "تم الحذف",
      description: "تم حذف المستخدم بنجاح",
    });
  };

  const handleChangePassword = () => {
    if (
      !changePassword.currentPassword ||
      !changePassword.newPassword ||
      !changePassword.confirmPassword
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    if (changePassword.newPassword !== changePassword.confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمة المرور الجديدة وتأكيد الكلمة غير متطابقين",
        variant: "destructive",
      });
      return;
    }

    // Here you would normally call an API to change the password
    setChangePassword({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsChangePasswordDialogOpen(false);
    toast({
      title: "تم التغيير",
      description: "تم تغيير كلمة المرور بنجاح",
    });
  };

  const handleUpdateSettings = () => {
    // Here you would normally call an API to update settings
    setUserSettings({
      ...userSettings,
      updatedAt: new Date(),
    });
    toast({
      title: "تم التحديث",
      description: "تم تحديث الإعدادات بنجاح",
    });
  };

  const handleUpdateProfile = () => {
    // Here you would normally call an API to update profile
    toast({
      title: "تم التحديث",
      description: "تم تحديث الملف الشخصي بنجاح",
    });
  };

  const openEditUserDialog = (user: any) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    setIsEditUserDialogOpen(true);
  };

  const openDeleteUserDialog = (user: any) => {
    setSelectedUser(user);
    setIsDeleteUserDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="الإعدادات والصلاحيات" showBack={true} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">⚙️ الإعدادات والصلاحيات</h2>
          <p className="text-muted-foreground mb-6">
            إدارة الإعدادات الشخصية والصلاحيات والتحكم في النظام
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
            <TabsTrigger value="users">المستخدمون</TabsTrigger>
            <TabsTrigger value="permissions">الصلاحيات</TabsTrigger>
            <TabsTrigger value="system">النظام</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>الصورة الشخصية</CardTitle>
                  <CardDescription>تحديث صورتك الشخصية</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={currentUser.avatar}
                      alt={currentUser.name}
                    />
                    <AvatarFallback className="text-2xl">
                      {currentUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline">تغيير الصورة</Button>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>المعلومات الشخصية</CardTitle>
                  <CardDescription>تحديث معلوماتك الشخصية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">الاسم الكامل</Label>
                      <Input
                        id="name"
                        value={currentUser.name}
                        onChange={(e) =>
                          setCurrentUser({
                            ...currentUser,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        value={currentUser.email}
                        onChange={(e) =>
                          setCurrentUser({
                            ...currentUser,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={currentUser.phone}
                      onChange={(e) =>
                        setCurrentUser({
                          ...currentUser,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">الدور</Label>
                    <Select value={currentUser.role} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">الإدارة</SelectItem>
                        <SelectItem value="teacher">المدرس</SelectItem>
                        <SelectItem value="student">الطالب</SelectItem>
                        <SelectItem value="parent">ولي الأمر</SelectItem>
                        <SelectItem value="viewer">المشاهد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleUpdateProfile}>حفظ التغييرات</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>تغيير كلمة المرور</CardTitle>
                <CardDescription>
                  تغيير كلمة المرور الخاصة بحسابك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={changePassword.currentPassword}
                      onChange={(e) =>
                        setChangePassword({
                          ...changePassword,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={changePassword.newPassword}
                      onChange={(e) =>
                        setChangePassword({
                          ...changePassword,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={changePassword.confirmPassword}
                      onChange={(e) =>
                        setChangePassword({
                          ...changePassword,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => setIsChangePasswordDialogOpen(true)}>
                      تغيير كلمة المرور
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>الإعدادات العامة</CardTitle>
                <CardDescription>تخصيص إعدادات التطبيق</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="theme">المظهر</Label>
                    <Select
                      value={userSettings.theme}
                      onValueChange={(value) =>
                        setUserSettings({
                          ...userSettings,
                          theme: value as "فاتح" | "داكن",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="فاتح">فاتح</SelectItem>
                        <SelectItem value="داكن">داكن</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">اللغة</Label>
                    <Select
                      value={userSettings.language}
                      onValueChange={(value) =>
                        setUserSettings({
                          ...userSettings,
                          language: value as "ar" | "en",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={handleUpdateSettings}>حفظ الإعدادات</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">إدارة المستخدمين</h3>
              <Dialog
                open={isAddUserDialogOpen}
                onOpenChange={setIsAddUserDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground">
                    إضافة مستخدم جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                    <DialogDescription>
                      أدخل بيانات المستخدم الجديد
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="user-name" className="text-right">
                        الاسم
                      </Label>
                      <Input
                        id="user-name"
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="user-email" className="text-right">
                        البريد الإلكتروني
                      </Label>
                      <Input
                        id="user-email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="user-password" className="text-right">
                        كلمة المرور
                      </Label>
                      <Input
                        id="user-password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="user-role" className="text-right">
                        الدور
                      </Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) =>
                          setNewUser({ ...newUser, role: value as UserRole })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="اختر الدور" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">الإدارة</SelectItem>
                          <SelectItem value="teacher">المدرس</SelectItem>
                          <SelectItem value="student">الطالب</SelectItem>
                          <SelectItem value="parent">ولي الأمر</SelectItem>
                          <SelectItem value="viewer">المشاهد</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddUserDialogOpen(false)}
                    >
                      إلغاء
                    </Button>
                    <Button onClick={handleAddUser}>إضافة مستخدم</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>قائمة المستخدمين</CardTitle>
                <CardDescription>
                  عرض وإدارة جميع مستخدمي النظام
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>الدور</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>تاريخ الإنشاء</TableHead>
                      <TableHead>آخر تسجيل</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(user.role)}>
                            {getRoleName(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {user.isActive ? "نشط" : "غير نشط"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.createdAt.toLocaleDateString("ar-SA")}
                        </TableCell>
                        <TableCell>
                          {user.lastLogin
                            ? user.lastLogin.toLocaleDateString("ar-SA")
                            : "لم يسجل بعد"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="outline" size="sm">
                              عرض
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditUserDialog(user)}
                            >
                              تعديل
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openDeleteUserDialog(user)}
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

          <TabsContent value="permissions" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(
                [
                  "admin",
                  "teacher",
                  "student",
                  "parent",
                  "viewer",
                ] as UserRole[]
              ).map((role) => (
                <Card key={role}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{getRoleName(role)}</CardTitle>
                      <Badge className={getRoleColor(role)}>
                        {getRoleName(role)}
                      </Badge>
                    </div>
                    <CardDescription>
                      الصلاحيات المتاحة لدور {getRoleName(role)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {getRolePermissions(role).map((permission, index) => (
                        <li
                          key={index}
                          className="flex items-center space-x-2 space-x-reverse"
                        >
                          <span className="text-green-500">✓</span>
                          <span className="text-sm">{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="system" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات النظام</CardTitle>
                  <CardDescription>معلومات حول النظام والإصدار</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">إصدار النظام:</span>
                    <span>1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      تاريخ الإصدار:
                    </span>
                    <span>2025-11-05</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">البيئة:</span>
                    <span>تطوير</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      قاعدة البيانات:
                    </span>
                    <span>Supabase</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>النسخ الاحتياطية</CardTitle>
                  <CardDescription>
                    إدارة النسخ الاحتياطية للبيانات
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      آخر نسخة احتياطية:
                    </span>
                    <span>2025-11-04 23:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">حجم النسخة:</span>
                    <span>125 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      النسخ التلقائية:
                    </span>
                    <span>مفعل</span>
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button variant="outline">إنشاء نسخة الآن</Button>
                    <Button variant="outline">استعادة نسخة</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>السجلات</CardTitle>
                  <CardDescription>عرض سجلات النظام والأنشطة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      عدد المستخدمين:
                    </span>
                    <span>156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">عدد الطلاب:</span>
                    <span>120</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">عدد المدرسين:</span>
                    <span>25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      عدد الجلسات اليوم:
                    </span>
                    <span>89</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    عرض السجلات الكاملة
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>الصيانة</CardTitle>
                  <CardDescription>أدوات الصيانة والتحسين</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    تنظيف ذاكرة التخزين المؤقت
                  </Button>
                  <Button variant="outline" className="w-full">
                    إعادة بناء الفهارس
                  </Button>
                  <Button variant="outline" className="w-full">
                    تحسين قاعدة البيانات
                  </Button>
                  <Button variant="outline" className="w-full">
                    فحص سلامة النظام
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit User Dialog */}
      <Dialog
        open={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل المستخدم</DialogTitle>
            <DialogDescription>قم بتعديل بيانات المستخدم</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-user-name" className="text-right">
                الاسم
              </Label>
              <Input
                id="edit-user-name"
                value={editUser.name}
                onChange={(e) =>
                  setEditUser({ ...editUser, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-user-email" className="text-right">
                البريد الإلكتروني
              </Label>
              <Input
                id="edit-user-email"
                type="email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-user-role" className="text-right">
                الدور
              </Label>
              <Select
                value={editUser.role}
                onValueChange={(value) =>
                  setEditUser({ ...editUser, role: value as UserRole })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">الإدارة</SelectItem>
                  <SelectItem value="teacher">المدرس</SelectItem>
                  <SelectItem value="student">الطالب</SelectItem>
                  <SelectItem value="parent">ولي الأمر</SelectItem>
                  <SelectItem value="viewer">المشاهد</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditUserDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleEditUser}>حفظ التعديلات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog
        open={isDeleteUserDialogOpen}
        onOpenChange={setIsDeleteUserDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف المستخدم "{selectedUser?.name}"؟ لا يمكن
              التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteUserDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog
        open={isChangePasswordDialogOpen}
        onOpenChange={setIsChangePasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تغيير كلمة المرور</DialogTitle>
            <DialogDescription>أدخل بيانات تغيير كلمة المرور</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-password" className="text-right">
                كلمة المرور الحالية
              </Label>
              <Input
                id="current-password"
                type="password"
                value={changePassword.currentPassword}
                onChange={(e) =>
                  setChangePassword({
                    ...changePassword,
                    currentPassword: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-password" className="text-right">
                كلمة المرور الجديدة
              </Label>
              <Input
                id="new-password"
                type="password"
                value={changePassword.newPassword}
                onChange={(e) =>
                  setChangePassword({
                    ...changePassword,
                    newPassword: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirm-password" className="text-right">
                تأكيد كلمة المرور
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={changePassword.confirmPassword}
                onChange={(e) =>
                  setChangePassword({
                    ...changePassword,
                    confirmPassword: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsChangePasswordDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleChangePassword}>تغيير كلمة المرور</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
