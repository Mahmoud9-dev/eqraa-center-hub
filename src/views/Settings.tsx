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
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/i18n";

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
  const { t, language } = useLanguage();
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
    const roleMap: Record<UserRole, string> = {
      admin: t.settings.users.roles.admin,
      teacher: t.settings.users.roles.teacher,
      student: t.settings.users.roles.student,
      parent: t.settings.users.roles.parent,
      viewer: t.settings.users.roles.viewer,
    };
    return roleMap[role] || role;
  };

  const getRolePermissions = (role: UserRole): string[] => {
    return t.settings.permissions.roles[role] || [];
  };

  // CRUD functions
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: t.settings.toasts.error,
        description: t.settings.toasts.requiredFields,
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
      title: t.settings.toasts.addSuccess,
      description: t.settings.toasts.addSuccessDescription,
    });
  };

  const handleEditUser = () => {
    if (!selectedUser || !editUser.name || !editUser.email) {
      toast({
        title: t.settings.toasts.error,
        description: t.settings.toasts.requiredFields,
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
      title: t.settings.toasts.editSuccess,
      description: t.settings.toasts.editSuccessDescription,
    });
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;

    setUsers(users.filter((user) => user.id !== selectedUser.id));
    setIsDeleteUserDialogOpen(false);
    setSelectedUser(null);
    toast({
      title: t.settings.toasts.deleteSuccess,
      description: t.settings.toasts.deleteSuccessDescription,
    });
  };

  const handleChangePassword = () => {
    if (
      !changePassword.currentPassword ||
      !changePassword.newPassword ||
      !changePassword.confirmPassword
    ) {
      toast({
        title: t.settings.toasts.error,
        description: t.settings.toasts.requiredFields,
        variant: "destructive",
      });
      return;
    }

    if (changePassword.newPassword !== changePassword.confirmPassword) {
      toast({
        title: t.settings.toasts.passwordMismatch,
        description: t.settings.toasts.passwordMismatchDescription,
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
      title: t.settings.toasts.passwordChanged,
      description: t.settings.toasts.passwordChangedDescription,
    });
  };

  const handleUpdateSettings = () => {
    // Here you would normally call an API to update settings
    setUserSettings({
      ...userSettings,
      updatedAt: new Date(),
    });
    toast({
      title: t.settings.toasts.settingsUpdated,
      description: t.settings.toasts.settingsUpdatedDescription,
    });
  };

  const handleUpdateProfile = () => {
    // Here you would normally call an API to update profile
    toast({
      title: t.settings.toasts.profileUpdated,
      description: t.settings.toasts.profileUpdatedDescription,
    });
  };

  const openEditUserDialog = (user: SystemUser) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    setIsEditUserDialogOpen(true);
  };

  const openDeleteUserDialog = (user: SystemUser) => {
    setSelectedUser(user);
    setIsDeleteUserDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t.settings.pageTitle} showBack={true} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t.settings.heading}</h2>
          <p className="text-muted-foreground mb-6">
            {t.settings.headingDescription}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">{t.settings.tabs.profile}</TabsTrigger>
            <TabsTrigger value="settings">{t.settings.tabs.settings}</TabsTrigger>
            <TabsTrigger value="users">{t.settings.tabs.users}</TabsTrigger>
            <TabsTrigger value="permissions">{t.settings.tabs.permissions}</TabsTrigger>
            <TabsTrigger value="system">{t.settings.tabs.system}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>{t.settings.profile.avatarTitle}</CardTitle>
                  <CardDescription>{t.settings.profile.avatarDescription}</CardDescription>
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
                  <Button variant="outline">{t.settings.profile.changeAvatar}</Button>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{t.settings.profile.infoTitle}</CardTitle>
                  <CardDescription>{t.settings.profile.infoDescription}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{t.settings.profile.fullName}</Label>
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
                      <Label htmlFor="email">{t.settings.profile.email}</Label>
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
                    <Label htmlFor="phone">{t.settings.profile.phone}</Label>
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
                    <Label htmlFor="role">{t.settings.profile.role}</Label>
                    <Select value={currentUser.role} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">{t.settings.users.roles.admin}</SelectItem>
                        <SelectItem value="teacher">{t.settings.users.roles.teacher}</SelectItem>
                        <SelectItem value="student">{t.settings.users.roles.student}</SelectItem>
                        <SelectItem value="parent">{t.settings.users.roles.parent}</SelectItem>
                        <SelectItem value="viewer">{t.settings.users.roles.viewer}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleUpdateProfile}>{t.settings.profile.saveChanges}</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t.settings.profile.changePassword}</CardTitle>
                <CardDescription>
                  {t.settings.profile.changePasswordDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">{t.settings.profile.currentPassword}</Label>
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
                    <Label htmlFor="newPassword">{t.settings.profile.newPassword}</Label>
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
                    <Label htmlFor="confirmPassword">{t.settings.profile.confirmPassword}</Label>
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
                      {t.settings.profile.changePasswordButton}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.settings.generalSettings.title}</CardTitle>
                <CardDescription>{t.settings.generalSettings.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="theme">{t.settings.theme.label}</Label>
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
                        <SelectItem value="فاتح">{t.settings.theme.light}</SelectItem>
                        <SelectItem value="داكن">{t.settings.theme.dark}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">{t.settings.language.label}</Label>
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
                        <SelectItem value="ar">{t.settings.language.arabic}</SelectItem>
                        <SelectItem value="en">{t.settings.language.english}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={handleUpdateSettings}>{t.settings.generalSettings.saveSettings}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">{t.settings.users.title}</h3>
              <Dialog
                open={isAddUserDialogOpen}
                onOpenChange={setIsAddUserDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground">
                    {t.settings.users.actions.addNewUser}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{t.settings.addUserDialog.title}</DialogTitle>
                    <DialogDescription>
                      {t.settings.addUserDialog.description}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="user-name" className="text-right">
                        {t.settings.addUserDialog.nameLabel}
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
                        {t.settings.addUserDialog.emailLabel}
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
                        {t.settings.addUserDialog.passwordLabel}
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
                        {t.settings.addUserDialog.roleLabel}
                      </Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) =>
                          setNewUser({ ...newUser, role: value as UserRole })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={t.settings.users.selectRole} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">{t.settings.users.roles.admin}</SelectItem>
                          <SelectItem value="teacher">{t.settings.users.roles.teacher}</SelectItem>
                          <SelectItem value="student">{t.settings.users.roles.student}</SelectItem>
                          <SelectItem value="parent">{t.settings.users.roles.parent}</SelectItem>
                          <SelectItem value="viewer">{t.settings.users.roles.viewer}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddUserDialogOpen(false)}
                    >
                      {t.common.cancel}
                    </Button>
                    <Button onClick={handleAddUser}>{t.settings.addUserDialog.submitButton}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t.settings.users.listTitle}</CardTitle>
                <CardDescription>
                  {t.settings.users.listDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.settings.users.table.name}</TableHead>
                      <TableHead>{t.settings.users.table.email}</TableHead>
                      <TableHead>{t.settings.users.table.role}</TableHead>
                      <TableHead>{t.settings.users.table.status}</TableHead>
                      <TableHead>{t.settings.users.table.createdAt}</TableHead>
                      <TableHead>{t.settings.users.table.lastLogin}</TableHead>
                      <TableHead>{t.settings.users.table.actions}</TableHead>
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
                            {user.isActive ? t.settings.users.status.active : t.settings.users.status.inactive}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(user.createdAt, language)}
                        </TableCell>
                        <TableCell>
                          {user.lastLogin
                            ? formatDate(user.lastLogin, language)
                            : t.settings.users.neverLoggedIn}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="outline" size="sm">
                              {t.settings.users.actions.view}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditUserDialog(user)}
                            >
                              {t.common.edit}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openDeleteUserDialog(user)}
                            >
                              {t.common.delete}
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
                      {t.settings.permissions.availableFor.replace('{{role}}', getRoleName(role))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {getRolePermissions(role).map((permission, index) => (
                        <li
                          key={index}
                          className="flex items-center space-x-2 space-x-reverse"
                        >
                          <span className="text-green-500">&#10003;</span>
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
                  <CardTitle>{t.settings.system.info.title}</CardTitle>
                  <CardDescription>{t.settings.system.info.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.settings.system.info.version}</span>
                    <span>1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t.settings.system.info.releaseDate}
                    </span>
                    <span>2025-11-05</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.settings.system.info.environment}</span>
                    <span>{t.settings.system.info.environmentValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t.settings.system.info.database}
                    </span>
                    <span>Supabase</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t.settings.system.backup.title}</CardTitle>
                  <CardDescription>
                    {t.settings.system.backup.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t.settings.system.backup.lastBackup}
                    </span>
                    <span>2025-11-04 23:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.settings.system.backup.backupSize}</span>
                    <span>125 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t.settings.system.backup.autoBackup}
                    </span>
                    <span>{t.settings.system.backup.autoBackupEnabled}</span>
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button variant="outline">{t.settings.system.backup.createNow}</Button>
                    <Button variant="outline">{t.settings.system.backup.restore}</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t.settings.system.logs.title}</CardTitle>
                  <CardDescription>{t.settings.system.logs.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t.settings.system.logs.totalUsers}
                    </span>
                    <span>156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.settings.system.logs.totalStudents}</span>
                    <span>120</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.settings.system.logs.totalTeachers}</span>
                    <span>25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t.settings.system.logs.sessionsToday}
                    </span>
                    <span>89</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    {t.settings.system.logs.viewAll}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t.settings.system.maintenance.title}</CardTitle>
                  <CardDescription>{t.settings.system.maintenance.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    {t.settings.system.maintenance.clearCache}
                  </Button>
                  <Button variant="outline" className="w-full">
                    {t.settings.system.maintenance.rebuildIndexes}
                  </Button>
                  <Button variant="outline" className="w-full">
                    {t.settings.system.maintenance.optimizeDb}
                  </Button>
                  <Button variant="outline" className="w-full">
                    {t.settings.system.maintenance.healthCheck}
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
            <DialogTitle>{t.settings.editUserDialog.title}</DialogTitle>
            <DialogDescription>{t.settings.editUserDialog.description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-user-name" className="text-right">
                {t.settings.editUserDialog.nameLabel}
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
                {t.settings.editUserDialog.emailLabel}
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
                {t.settings.editUserDialog.roleLabel}
              </Label>
              <Select
                value={editUser.role}
                onValueChange={(value) =>
                  setEditUser({ ...editUser, role: value as UserRole })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t.settings.users.selectRole} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t.settings.users.roles.admin}</SelectItem>
                  <SelectItem value="teacher">{t.settings.users.roles.teacher}</SelectItem>
                  <SelectItem value="student">{t.settings.users.roles.student}</SelectItem>
                  <SelectItem value="parent">{t.settings.users.roles.parent}</SelectItem>
                  <SelectItem value="viewer">{t.settings.users.roles.viewer}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditUserDialogOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button onClick={handleEditUser}>{t.settings.editUserDialog.saveButton}</Button>
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
            <DialogTitle>{t.settings.deleteDialog.title}</DialogTitle>
            <DialogDescription>
              {t.settings.deleteDialog.description.replace('{{name}}', selectedUser?.name || '')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteUserDialogOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              {t.common.delete}
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
            <DialogTitle>{t.settings.changePasswordDialog.title}</DialogTitle>
            <DialogDescription>{t.settings.changePasswordDialog.description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-password" className="text-right">
                {t.settings.changePasswordDialog.currentLabel}
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
                {t.settings.changePasswordDialog.newLabel}
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
                {t.settings.changePasswordDialog.confirmLabel}
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
              {t.common.cancel}
            </Button>
            <Button onClick={handleChangePassword}>{t.settings.changePasswordDialog.submitButton}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
