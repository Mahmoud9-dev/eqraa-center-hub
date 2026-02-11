'use client';

import { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import * as studentsService from "@/lib/db/services/students";
import * as teachersService from "@/lib/db/services/teachers";
import * as attendanceRecordsService from "@/lib/db/services/attendanceRecords";
import type { DbStudent, DbTeacher, DbAttendanceRecord } from "@/lib/db/types";

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState<{
    [key: string]: "حاضر" | "غائب" | "مأذون";
  }>({});
  const [selectedTeachers, setSelectedTeachers] = useState<{
    [key: string]: "حاضر" | "غائب" | "إجازة";
  }>({});
  const { toast } = useToast();

  // State for data from Dexie
  const [students, setStudents] = useState<DbStudent[]>([]);
  const [teachers, setTeachers] = useState<DbTeacher[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<DbAttendanceRecord[]>([]);

  // Load students from Dexie (active students)
  const loadStudents = useCallback(async () => {
    try {
      const data = await studentsService.getActive();
      setStudents(data);
    } catch (error) {
      console.error("Error loading students:", error);
      toast({ title: "خطأ", description: "فشل تحميل بيانات الطلاب", variant: "destructive" });
    }
  }, [toast]);

  // Load teachers from Dexie (active teachers)
  const loadTeachers = useCallback(async () => {
    try {
      const data = await teachersService.getActive();
      setTeachers(data);
    } catch (error) {
      console.error("Error loading teachers:", error);
      toast({ title: "خطأ", description: "فشل تحميل بيانات المعلمين", variant: "destructive" });
    }
  }, [toast]);

  // Load attendance records from Dexie
  const loadAttendanceRecords = useCallback(async () => {
    try {
      const data = await attendanceRecordsService.getAll();
      setAttendanceRecords(data);
    } catch (error) {
      console.error("Error loading attendance records:", error);
      toast({ title: "خطأ", description: "فشل تحميل سجلات الحضور", variant: "destructive" });
    }
  }, [toast]);

  // Load all data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([loadStudents(), loadTeachers(), loadAttendanceRecords()]);
      setIsLoading(false);
    };
    loadData();
  }, [loadStudents, loadTeachers, loadAttendanceRecords]);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === "all" || student.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getDepartmentName = (dept: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "حاضر":
        return "bg-green-100 text-green-800";
      case "غائب":
        return "bg-red-100 text-red-800";
      case "مأذون":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleRecordAttendance = async () => {
    setIsRecording(true);

    try {
      // Create new attendance records for selected students
      const recordsToInsert = Object.entries(selectedStudents).map(
        ([studentId, status]) => {
          const student = students.find((s) => s.id === studentId);
          return {
            studentId: studentId,
            teacherId: student?.teacherId || null,
            recordDate: selectedDate.toISOString().split("T")[0],
            status,
            notes:
              status === "حاضر"
                ? "حضور منتظم"
                : status === "غائب"
                ? "غياب بدون عذر"
                : "غياب بعذر",
          };
        }
      );

      await attendanceRecordsService.addBatch(recordsToInsert);

      // Reload attendance records
      await loadAttendanceRecords();

      setIsRecording(false);
      setSelectedStudents({});
      toast({
        title: "تم تسجيل الحضور",
        description: `تم تسجيل حضور ${recordsToInsert.length} طالب بنجاح`,
      });
    } catch (error) {
      console.error("Error recording attendance:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الحضور",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  };

  const handleStudentStatusChange = (
    studentId: string,
    status: "حاضر" | "غائب" | "مأذون"
  ) => {
    setSelectedStudents((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleTeacherStatusChange = (
    teacherId: string,
    status: "حاضر" | "غائب" | "إجازة"
  ) => {
    setSelectedTeachers((prev) => ({
      ...prev,
      [teacherId]: status,
    }));
  };

  const handleRecordTeacherAttendance = async () => {
    setIsRecording(true);

    try {
      // Create new attendance records for selected teachers
      const recordsToInsert = Object.entries(selectedTeachers).map(
        ([teacherId, status]) => {
          // Map إجازة to مأذون for database compatibility
          const dbStatus = status === "إجازة" ? "مأذون" : status;
          return {
            studentId: null, // No student for teacher attendance
            teacherId: teacherId,
            recordDate: selectedDate.toISOString().split("T")[0],
            status: dbStatus as "حاضر" | "غائب" | "مأذون",
            notes:
              status === "حاضر"
                ? "حضور منتظم"
                : status === "غائب"
                ? "غياب بدون عذر"
                : "إجازة معتمدة",
          };
        }
      );

      await attendanceRecordsService.addBatch(recordsToInsert);

      // Reload attendance records
      await loadAttendanceRecords();

      setIsRecording(false);
      setSelectedTeachers({});
      toast({
        title: "تم تسجيل الحضور",
        description: `تم تسجيل حضور ${recordsToInsert.length} معلم بنجاح`,
      });
    } catch (error) {
      console.error("Error recording teacher attendance:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الحضور",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  };

  // Helper to get student name from ID
  const getStudentName = (studentId: string | undefined | null) => {
    if (!studentId) return "-";
    const student = students.find((s) => s.id === studentId);
    return student?.name || "-";
  };

  // Helper to get teacher name from ID
  const getTeacherName = (teacherId: string | undefined | null) => {
    if (!teacherId) return "-";
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher?.name || "-";
  };

  // Helper to get student department from ID
  const getStudentDepartment = (studentId: string | undefined | null) => {
    if (!studentId) return "";
    const student = students.find((s) => s.id === studentId);
    return student?.department || "";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="الحضور والانصراف" showBack={true} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">جاري تحميل البيانات...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="الحضور والانصراف" showBack={true} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">📊 الحضور والانصراف</h2>
          <p className="text-muted-foreground mb-6">
            تسجيل ومتابعة حضور الطلاب والمعلمين
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="students">حضور الطلاب</TabsTrigger>
            <TabsTrigger value="teachers">حضور المعلمين</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="mt-6">
            <div className="space-y-6">
              {/* تسجيل الحضور */}
              <Card>
                <CardHeader>
                  <CardTitle>تسجيل الحضور اليومي للطلاب</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <label className="text-sm font-medium">التاريخ:</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-48">
                              <CalendarIcon className="ml-2 h-4 w-4" />
                              {format(selectedDate, "PPP", { locale: ar })}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => date && setSelectedDate(date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="flex items-center space-x-2 space-x-reverse">
                        <label className="text-sm font-medium">القسم:</label>
                        <Select
                          value={filterDepartment}
                          onValueChange={setFilterDepartment}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="اختر القسم" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">جميع الأقسام</SelectItem>
                            <SelectItem value="quran">قرآن</SelectItem>
                            <SelectItem value="tajweed">تجويد</SelectItem>
                            <SelectItem value="tarbawi">تربوي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex-1 max-w-xs relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="البحث عن طالب..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pr-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-4">سجل الحضور لليوم:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredStudents.map((student) => (
                        <Card
                          key={student.id}
                          className="border-l-4 border-l-primary"
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h5 className="font-medium">{student.name}</h5>
                                <p className="text-sm text-muted-foreground">
                                  {student.grade} •{" "}
                                  {getDepartmentName(student.department)}
                                </p>
                              </div>
                              <Badge variant="outline">
                                {student.partsMemorized} جزء
                              </Badge>
                            </div>

                            <div className="flex space-x-2 space-x-reverse">
                              <Button
                                size="sm"
                                variant={
                                  selectedStudents[student.id] === "حاضر"
                                    ? "default"
                                    : "outline"
                                }
                                className="flex-1"
                                onClick={() =>
                                  handleStudentStatusChange(student.id, "حاضر")
                                }
                              >
                                حاضر
                              </Button>
                              <Button
                                size="sm"
                                variant={
                                  selectedStudents[student.id] === "غائب"
                                    ? "destructive"
                                    : "outline"
                                }
                                className="flex-1"
                                onClick={() =>
                                  handleStudentStatusChange(student.id, "غائب")
                                }
                              >
                                غائب
                              </Button>
                              <Button
                                size="sm"
                                variant={
                                  selectedStudents[student.id] === "مأذون"
                                    ? "secondary"
                                    : "outline"
                                }
                                className="flex-1"
                                onClick={() =>
                                  handleStudentStatusChange(student.id, "مأذون")
                                }
                              >
                                مأذون
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={handleRecordAttendance}
                        disabled={
                          isRecording ||
                          Object.keys(selectedStudents).length === 0
                        }
                        className="bg-primary text-primary-foreground"
                      >
                        {isRecording ? "جاري التسجيل..." : "تسجيل الحضور"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* سجلات الحضور السابقة */}
              <Card>
                <CardHeader>
                  <CardTitle>سجلات الحضور السابقة</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>الطالب</TableHead>
                        <TableHead>القسم</TableHead>
                        <TableHead>المعلم</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>ملاحظات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.recordDate}</TableCell>
                          <TableCell>{getStudentName(record.studentId)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getDepartmentName(
                                getStudentDepartment(record.studentId)
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>{getTeacherName(record.teacherId)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.notes || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="teachers" className="mt-6">
            <div className="space-y-6">
              {/* تسجيل حضور المعلمين */}
              <Card>
                <CardHeader>
                  <CardTitle>تسجيل الحضور اليومي للمعلمين</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <label className="text-sm font-medium">التاريخ:</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-48">
                              <CalendarIcon className="ml-2 h-4 w-4" />
                              {format(selectedDate, "PPP", { locale: ar })}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => date && setSelectedDate(date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="flex items-center space-x-2 space-x-reverse">
                        <label className="text-sm font-medium">القسم:</label>
                        <Select
                          value={filterDepartment}
                          onValueChange={setFilterDepartment}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="اختر القسم" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">جميع الأقسام</SelectItem>
                            <SelectItem value="quran">قرآن</SelectItem>
                            <SelectItem value="tajweed">تجويد</SelectItem>
                            <SelectItem value="tarbawi">تربوي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex-1 max-w-xs relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="البحث عن معلم..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pr-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-4">سجل الحضور لليوم:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teachers.map((teacher) => (
                        <Card
                          key={teacher.id}
                          className="border-l-4 border-l-secondary"
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h5 className="font-medium">{teacher.name}</h5>
                                <p className="text-sm text-muted-foreground">
                                  {teacher.specialization}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {getDepartmentName(teacher.department)}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  teacher.isActive ? "default" : "secondary"
                                }
                              >
                                {teacher.isActive ? "نشط" : "غير نشط"}
                              </Badge>
                            </div>

                            <div className="flex space-x-2 space-x-reverse">
                              <Button
                                size="sm"
                                variant={
                                  selectedTeachers[teacher.id] === "حاضر"
                                    ? "default"
                                    : "outline"
                                }
                                className="flex-1"
                                onClick={() =>
                                  handleTeacherStatusChange(teacher.id, "حاضر")
                                }
                              >
                                حاضر
                              </Button>
                              <Button
                                size="sm"
                                variant={
                                  selectedTeachers[teacher.id] === "غائب"
                                    ? "destructive"
                                    : "outline"
                                }
                                className="flex-1"
                                onClick={() =>
                                  handleTeacherStatusChange(teacher.id, "غائب")
                                }
                              >
                                غائب
                              </Button>
                              <Button
                                size="sm"
                                variant={
                                  selectedTeachers[teacher.id] === "إجازة"
                                    ? "secondary"
                                    : "outline"
                                }
                                className="flex-1"
                                onClick={() =>
                                  handleTeacherStatusChange(teacher.id, "إجازة")
                                }
                              >
                                إجازة
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={handleRecordTeacherAttendance}
                        disabled={
                          isRecording ||
                          Object.keys(selectedTeachers).length === 0
                        }
                        className="bg-primary text-primary-foreground"
                      >
                        {isRecording ? "جاري التسجيل..." : "تسجيل الحضور"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Attendance;
