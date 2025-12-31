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
import { Input } from "@/components/ui/input";
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
import { Schedule as ScheduleType } from "@/types";

const Schedule = () => {
  const [isAddSessionDialogOpen, setIsAddSessionDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Mock data - will be replaced with actual data from Supabase
  const [weeklySchedule, setWeeklySchedule] = useState([
    {
      id: "1",
      day: "الأحد",
      dayOfWeek: 0,
      sessions: [
        {
          id: "1",
          title: "حلقة حفظ القرآن",
          startTime: "08:00",
          endTime: "10:00",
          teacherId: "teacher1",
          location: "قاعة 1",
          type: "حلقة قرآن",
          subjectId: "quran",
          isActive: true,
        },
        {
          id: "2",
          title: "درس التجويد",
          startTime: "10:30",
          endTime: "12:00",
          teacherId: "teacher2",
          location: "قاعة 2",
          type: "تجويد",
          subjectId: "tajweed",
          isActive: true,
        },
      ],
    },
    {
      id: "2",
      day: "الإثنين",
      dayOfWeek: 1,
      sessions: [
        {
          id: "3",
          title: "حلقة مراجعة",
          startTime: "08:00",
          endTime: "10:00",
          teacherId: "teacher3",
          location: "قاعة 1",
          type: "مراجعة",
          subjectId: "quran",
          isActive: true,
        },
        {
          id: "4",
          title: "درس العقيدة",
          startTime: "14:00",
          endTime: "16:00",
          teacherId: "teacher1",
          location: "قاعة 3",
          type: "مادة شرعية",
          subjectId: "aqeedah",
          isActive: true,
        },
      ],
    },
    {
      id: "3",
      day: "الثلاثاء",
      dayOfWeek: 2,
      sessions: [
        {
          id: "5",
          title: "حلقة حفظ القرآن",
          startTime: "08:00",
          endTime: "10:00",
          teacherId: "teacher2",
          location: "قاعة 1",
          type: "حلقة قرآن",
          subjectId: "quran",
          isActive: true,
        },
      ],
    },
    {
      id: "4",
      day: "الأربعاء",
      dayOfWeek: 3,
      sessions: [
        {
          id: "6",
          title: "حلقة تجويد",
          startTime: "09:00",
          endTime: "11:00",
          teacherId: "teacher3",
          location: "قاعة 2",
          type: "تجويد",
          subjectId: "tajweed",
          isActive: true,
        },
        {
          id: "7",
          title: "درس الفقه",
          startTime: "14:00",
          endTime: "16:00",
          teacherId: "teacher1",
          location: "قاعة 3",
          type: "مادة شرعية",
          subjectId: "fiqh",
          isActive: true,
        },
      ],
    },
    {
      id: "5",
      day: "الخميس",
      dayOfWeek: 4,
      sessions: [
        {
          id: "8",
          title: "حلقة مراجعة شاملة",
          startTime: "08:00",
          endTime: "10:00",
          teacherId: "teacher2",
          location: "قاعة 1",
          type: "مراجعة",
          subjectId: "quran",
          isActive: true,
        },
      ],
    },
    {
      id: "6",
      day: "الجمعة",
      dayOfWeek: 5,
      sessions: [
        {
          id: "9",
          title: "محاضرة عامة",
          startTime: "11:00",
          endTime: "12:30",
          teacherId: "teacher3",
          location: "المسجد",
          type: "محاضرة",
          subjectId: "general",
          isActive: true,
        },
      ],
    },
    {
      id: "7",
      day: "السبت",
      dayOfWeek: 6,
      sessions: [],
    },
  ]);

  const [upcomingSessions, setUpcomingSessions] = useState([
    {
      id: "1",
      title: "حلقة حفظ القرآن",
      date: "2025-11-06",
      time: "08:00",
      teacherId: "teacher1",
    },
    {
      id: "2",
      title: "درس التجويد",
      date: "2025-11-06",
      time: "10:30",
      teacherId: "teacher2",
    },
  ]);

  // Mock teacher data
  const teachers = {
    teacher1: "الشيخ أحمد محمد",
    teacher2: "الشيخ خالد علي",
    teacher3: "الشيخ محمد حسن",
  };

  // Form state
  const [newSession, setNewSession] = useState({
    title: "",
    dayOfWeek: 0,
    startTime: "",
    endTime: "",
    teacherId: "",
    location: "",
    type: "حلقة قرآن",
    subjectId: "",
    isActive: true,
  });

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case "حلقة قرآن":
        return "bg-green-100 text-green-800";
      case "تجويد":
        return "bg-blue-100 text-blue-800";
      case "مادة شرعية":
        return "bg-purple-100 text-purple-800";
      case "مراجعة":
        return "bg-yellow-100 text-yellow-800";
      case "محاضرة":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  // CRUD functions
  const handleAddSession = () => {
    if (
      !newSession.title ||
      !newSession.startTime ||
      !newSession.endTime ||
      !newSession.teacherId
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const session = {
      id: Date.now().toString(),
      ...newSession,
    };

    const updatedSchedule = weeklySchedule.map((day) => {
      if (day.dayOfWeek === newSession.dayOfWeek) {
        return {
          ...day,
          sessions: [...day.sessions, session],
        };
      }
      return day;
    });

    setWeeklySchedule(updatedSchedule);
    setNewSession({
      title: "",
      dayOfWeek: 0,
      startTime: "",
      endTime: "",
      teacherId: "",
      location: "",
      type: "حلقة قرآن",
      subjectId: "",
      isActive: true,
    });
    setIsAddSessionDialogOpen(false);
    toast({
      title: "تم الإضافة",
      description: "تم إضافة الجلسة بنجاح",
    });
  };

  const handleEditSession = () => {
    if (
      !selectedSession ||
      !newSession.title ||
      !newSession.startTime ||
      !newSession.endTime ||
      !newSession.teacherId
    ) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const updatedSchedule = weeklySchedule.map((day) => {
      if (day.dayOfWeek === selectedSession.dayOfWeek) {
        return {
          ...day,
          sessions: day.sessions.map((session) =>
            session.id === selectedSession.id
              ? { ...session, ...newSession }
              : session
          ),
        };
      }
      return day;
    });

    setWeeklySchedule(updatedSchedule);
    setIsEditDialogOpen(false);
    setSelectedSession(null);
    setNewSession({
      title: "",
      dayOfWeek: 0,
      startTime: "",
      endTime: "",
      teacherId: "",
      location: "",
      type: "حلقة قرآن",
      subjectId: "",
      isActive: true,
    });
    toast({
      title: "تم التعديل",
      description: "تم تعديل الجلسة بنجاح",
    });
  };

  const handleDeleteSession = () => {
    if (!selectedSession) return;

    const updatedSchedule = weeklySchedule.map((day) => {
      if (day.dayOfWeek === selectedSession.dayOfWeek) {
        return {
          ...day,
          sessions: day.sessions.filter(
            (session) => session.id !== selectedSession.id
          ),
        };
      }
      return day;
    });

    setWeeklySchedule(updatedSchedule);
    setIsDeleteDialogOpen(false);
    setSelectedSession(null);
    toast({
      title: "تم الحذف",
      description: "تم حذف الجلسة بنجاح",
    });
  };

  const openEditDialog = (session: any, dayOfWeek: number) => {
    setSelectedSession({ ...session, dayOfWeek });
    setNewSession({
      title: session.title,
      dayOfWeek: dayOfWeek,
      startTime: session.startTime,
      endTime: session.endTime,
      teacherId: session.teacherId,
      location: session.location,
      type: session.type,
      subjectId: session.subjectId,
      isActive: session.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (session: any, dayOfWeek: number) => {
    setSelectedSession({ ...session, dayOfWeek });
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="الجدول الدراسي" showBack={true} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">📅 الجدول الدراسي</h2>
          <p className="text-muted-foreground mb-6">
            إدارة ومتابعة جداول الحلقات والمحاضرات اليومية والأسبوعية
          </p>

          <div className="flex justify-end mb-6">
            <Dialog
              open={isAddSessionDialogOpen}
              onOpenChange={setIsAddSessionDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground">
                  إضافة جلسة جديدة
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>إضافة جلسة جديدة</DialogTitle>
                  <DialogDescription>
                    أدخل بيانات الجلسة الجديدة
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="session-title" className="text-right">
                      العنوان
                    </Label>
                    <Input
                      id="session-title"
                      value={newSession.title}
                      onChange={(e) =>
                        setNewSession({ ...newSession, title: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="session-day" className="text-right">
                      اليوم
                    </Label>
                    <Select
                      value={newSession.dayOfWeek.toString()}
                      onValueChange={(value) =>
                        setNewSession({
                          ...newSession,
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
                    <Label htmlFor="session-startTime" className="text-right">
                      وقت البدء
                    </Label>
                    <Input
                      id="session-startTime"
                      type="time"
                      value={newSession.startTime}
                      onChange={(e) =>
                        setNewSession({
                          ...newSession,
                          startTime: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="session-endTime" className="text-right">
                      وقت الانتهاء
                    </Label>
                    <Input
                      id="session-endTime"
                      type="time"
                      value={newSession.endTime}
                      onChange={(e) =>
                        setNewSession({
                          ...newSession,
                          endTime: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="session-teacher" className="text-right">
                      المعلم
                    </Label>
                    <Select
                      value={newSession.teacherId}
                      onValueChange={(value) =>
                        setNewSession({ ...newSession, teacherId: value })
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="session-location" className="text-right">
                      المكان
                    </Label>
                    <Input
                      id="session-location"
                      value={newSession.location}
                      onChange={(e) =>
                        setNewSession({
                          ...newSession,
                          location: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="session-type" className="text-right">
                      النوع
                    </Label>
                    <Select
                      value={newSession.type}
                      onValueChange={(value) =>
                        setNewSession({ ...newSession, type: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="حلقة قرآن">حلقة قرآن</SelectItem>
                        <SelectItem value="تجويد">تجويد</SelectItem>
                        <SelectItem value="مادة شرعية">مادة شرعية</SelectItem>
                        <SelectItem value="مراجعة">مراجعة</SelectItem>
                        <SelectItem value="محاضرة">محاضرة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddSessionDialogOpen(false)}
                  >
                    إلغاء
                  </Button>
                  <Button onClick={handleAddSession}>إضافة جلسة</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>الجدول الأسبوعي</CardTitle>
                <CardDescription>
                  جميع الحلقات والمحاضرات الأسبوعية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklySchedule.map((day) => (
                    <div key={day.id} className="border rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-3">{day.day}</h3>
                      {day.sessions.length > 0 ? (
                        <div className="space-y-2">
                          {day.sessions.map((session) => (
                            <div
                              key={session.id}
                              className="flex items-center justify-between p-3 bg-muted rounded-lg"
                            >
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 space-x-reverse">
                                  <h4 className="font-medium">
                                    {session.title}
                                  </h4>
                                  <Badge
                                    className={getSessionTypeColor(
                                      session.type
                                    )}
                                  >
                                    {session.type}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {session.startTime} - {session.endTime} •{" "}
                                  {
                                    teachers[
                                      session.teacherId as keyof typeof teachers
                                    ]
                                  }{" "}
                                  • {session.location}
                                </div>
                              </div>
                              <div className="flex space-x-2 space-x-reverse">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    openEditDialog(session, day.dayOfWeek)
                                  }
                                >
                                  تعديل
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    openDeleteDialog(session, day.dayOfWeek)
                                  }
                                >
                                  حذف
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          لا توجد جلسات في هذا اليوم
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>الحلقات القادمة</CardTitle>
                <CardDescription>
                  الحلقات والمحاضرات القادمة خلال 24 ساعة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="p-3 border rounded-lg">
                      <h4 className="font-medium mb-2">{session.title}</h4>
                      <div className="text-sm text-muted-foreground">
                        {session.date} • {session.time}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {teachers[session.teacherId as keyof typeof teachers]}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل الجلسة</DialogTitle>
            <DialogDescription>قم بتعديل بيانات الجلسة</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                العنوان
              </Label>
              <Input
                id="edit-title"
                value={newSession.title}
                onChange={(e) =>
                  setNewSession({ ...newSession, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-startTime" className="text-right">
                وقت البدء
              </Label>
              <Input
                id="edit-startTime"
                type="time"
                value={newSession.startTime}
                onChange={(e) =>
                  setNewSession({ ...newSession, startTime: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-endTime" className="text-right">
                وقت الانتهاء
              </Label>
              <Input
                id="edit-endTime"
                type="time"
                value={newSession.endTime}
                onChange={(e) =>
                  setNewSession({ ...newSession, endTime: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-location" className="text-right">
                المكان
              </Label>
              <Input
                id="edit-location"
                value={newSession.location}
                onChange={(e) =>
                  setNewSession({ ...newSession, location: e.target.value })
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
            <Button onClick={handleEditSession}>حفظ التعديلات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف الجلسة "{selectedSession?.title}"؟ لا يمكن
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
            <Button variant="destructive" onClick={handleDeleteSession}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;
