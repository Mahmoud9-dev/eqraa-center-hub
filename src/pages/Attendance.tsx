import { useState } from "react";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  department: string;
  teacherId: string;
  partsMemorized: number;
  currentProgress: string;
  attendance: number;
  parentName?: string;
  parentPhone?: string;
  isActive: boolean;
}

interface Teacher {
  id: string;
  name: string;
  specialization: string;
  department: string;
  isActive: boolean;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  teacherId: string;
  date: string;
  status: "حاضر" | "غائب" | "مأذون";
  notes?: string;
  student?: Student;
  teacher?: Teacher;
}

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<{
    [key: string]: "حاضر" | "غائب" | "مأذون";
  }>({});
  const [selectedTeachers, setSelectedTeachers] = useState<{
    [key: string]: "حاضر" | "غائب" | "إجازة";
  }>({});
  const { toast } = useToast();

  // Mock data
  const [students] = useState<Student[]>([
    {
      id: "1",
      name: "أحمد محمد علي",
      age: 12,
      grade: "السادس ابتدائي",
      department: "quran",
      teacherId: "teacher1",
      partsMemorized: 5,
      currentProgress: "سورة آل عمران - الآية 50",
      attendance: 85,
      parentName: "محمد علي",
      parentPhone: "01234567890",
      isActive: true,
    },
    {
      id: "2",
      name: "عمر خالد حسن",
      age: 14,
      grade: "الثالث إعدادي",
      department: "tajweed",
      teacherId: "teacher2",
      partsMemorized: 8,
      currentProgress: "سورة النساء - الآية 100",
      attendance: 92,
      parentName: "خالد حسن",
      parentPhone: "01234567891",
      isActive: true,
    },
    {
      id: "3",
      name: "محمد سعيد أحمد",
      age: 11,
      grade: "الخامس ابتدائي",
      department: "tarbawi",
      teacherId: "teacher3",
      partsMemorized: 3,
      currentProgress: "سورة البقرة - الآية 150",
      attendance: 78,
      parentName: "سعيد أحمد",
      parentPhone: "01234567892",
      isActive: true,
    },
  ]);

  const [teachers] = useState<Teacher[]>([
    {
      id: "teacher1",
      name: "الشيخ خالد أحمد",
      specialization: "تحفيظ القرآن",
      department: "quran",
      isActive: true,
    },
    {
      id: "teacher2",
      name: "الشيخ أحمد محمد",
      specialization: "تجويد القرآن",
      department: "tajweed",
      isActive: true,
    },
    {
      id: "teacher3",
      name: "الشيخ محمد حسن",
      specialization: "تربوي",
      department: "tarbawi",
      isActive: true,
    },
  ]);

  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >(() => {
    // Try to load from localStorage first
    const savedRecords = localStorage.getItem("attendanceRecords");
    if (savedRecords) {
      try {
        return JSON.parse(savedRecords);
      } catch (error) {
        console.error(
          "Error loading attendance records from localStorage:",
          error
        );
      }
    }

    // Default records if no saved data
    return [
      {
        id: "1",
        studentId: "1",
        teacherId: "teacher1",
        date: "2025-11-05",
        status: "حاضر",
        notes: "حضور ممتاز",
        student: students[0],
        teacher: teachers[0],
      },
      {
        id: "2",
        studentId: "2",
        teacherId: "teacher2",
        date: "2025-11-05",
        status: "غائب",
        notes: "غياب بعذر",
        student: students[1],
        teacher: teachers[1],
      },
    ];
  });

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

  const handleRecordAttendance = () => {
    setIsRecording(true);

    // Create new attendance records for selected students
    const newRecords: AttendanceRecord[] = Object.entries(selectedStudents).map(
      ([studentId, status]) => {
        const student = students.find((s) => s.id === studentId);
        return {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          studentId,
          teacherId: student?.teacherId || "",
          date: selectedDate.toISOString().split("T")[0],
          status,
          notes:
            status === "حاضر"
              ? "حضور منتظم"
              : status === "غائب"
              ? "غياب بدون عذر"
              : "غياب بعذر",
          student,
          teacher: teachers.find((t) => t.id === student?.teacherId),
        };
      }
    );

    // Add new records to existing ones
    const updatedRecords = [...attendanceRecords, ...newRecords];
    setAttendanceRecords(updatedRecords);

    // Save to localStorage for persistence
    localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords));

    setTimeout(() => {
      setIsRecording(false);
      setSelectedStudents({});
      toast({
        title: "تم تسجيل الحضور",
        description: `تم تسجيل حضور ${newRecords.length} طالب بنجاح وحفظ البيانات`,
      });
    }, 1000);
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

  const handleRecordTeacherAttendance = () => {
    setIsRecording(true);

    // Create new attendance records for selected teachers
    const newRecords: AttendanceRecord[] = Object.entries(selectedTeachers).map(
      ([teacherId, status]) => {
        const teacher = teachers.find((t) => t.id === teacherId);
        return {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          studentId: "", // No student for teacher attendance
          teacherId,
          date: selectedDate.toISOString().split("T")[0],
          status: status as "حاضر" | "غائب" | "مأذون",
          notes:
            status === "حاضر"
              ? "حضور منتظم"
              : status === "غائب"
              ? "غياب بدون عذر"
              : "إجازة معتمدة",
          teacher,
        };
      }
    );

    // Add new records to existing ones
    const updatedRecords = [...attendanceRecords, ...newRecords];
    setAttendanceRecords(updatedRecords);

    // Save to localStorage for persistence
    localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords));

    setTimeout(() => {
      setIsRecording(false);
      setSelectedTeachers({});
      toast({
        title: "تم تسجيل الحضور",
        description: `تم تسجيل حضور ${newRecords.length} معلم بنجاح وحفظ البيانات`,
      });
    }, 1000);
  };

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

                      <div className="flex-1 max-w-xs">
                        <Input
                          placeholder="البحث عن طالب..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full"
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
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.student?.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getDepartmentName(
                                record.student?.department || ""
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.teacher?.name}</TableCell>
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

                      <div className="flex-1 max-w-xs">
                        <Input
                          placeholder="البحث عن معلم..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full"
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
