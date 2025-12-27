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
  const [students, setStudents] = useState<Student[]>(() => {
    // محاولة استرجاع البيانات من localStorage عند تحميل الصفحة
    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
      try {
        return JSON.parse(savedStudents);
      } catch (error) {
        console.error("Error loading students from localStorage:", error);
      }
    }

    // البيانات الافتراضية إذا لم توجد بيانات محفوظة
    return [
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
    ];
  });

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

  const [studentsNotes, setStudentsNotes] = useState<{ [key: string]: any[] }>(
    () => {
      // محاولة استرجاع بيانات الملاحظات من localStorage
      const savedNotes = localStorage.getItem("studentsNotes");
      if (savedNotes) {
        try {
          return JSON.parse(savedNotes);
        } catch (error) {
          console.error("Error loading notes from localStorage:", error);
        }
      }

      // البيانات الافتراضية إذا لم توجد بيانات محفوظة
      return {
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
    }
  );

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditImagesDialogOpen, setIsEditImagesDialogOpen] = useState(false);
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false);
  const [isEditNoteDialogOpen, setIsEditNoteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [editingImageType, setEditingImageType] = useState<
    "new" | "recent" | "distant"
  >("new");
  const [newNote, setNewNote] = useState({
    type: "إيجابي" as "إيجابي" | "سلبي",
    content: "",
    date: new Date().toISOString().split("T")[0],
    teacher: "المعلم الحالي",
  });
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

    const updatedStudents = [...students, student];
    setStudents(updatedStudents);

    // حفظ البيانات في localStorage للبقاء بعد الخروج من الصفحة
    localStorage.setItem("students", JSON.stringify(updatedStudents));

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
      description: "تم إضافة الطالب بنجاح وحفظ البيانات",
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

    const updatedStudents = students.map((student) =>
      student.id === selectedStudent.id
        ? {
            ...student,
            name: newStudent.name || student.name,
            age: newStudent.age || student.age,
            grade: newStudent.grade || student.grade,
            department:
              (newStudent.department as Department) || student.department,
            teacherId: newStudent.teacherId || student.teacherId,
            partsMemorized: newStudent.partsMemorized || student.partsMemorized,
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
    );

    setStudents(updatedStudents);

    // حفظ البيانات في localStorage للبقاء بعد الخروج من الصفحة
    localStorage.setItem("students", JSON.stringify(updatedStudents));

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
      description: "تم تعديل بيانات الطالب بنجاح وحفظ البيانات",
    });
  };

  const handleDeleteStudent = () => {
    if (!selectedStudent) return;

    const updatedStudents = students.filter(
      (student) => student.id !== selectedStudent.id
    );
    setStudents(updatedStudents);

    // حفظ البيانات في localStorage للبقاء بعد الخروج من الصفحة
    localStorage.setItem("students", JSON.stringify(updatedStudents));

    setIsDeleteDialogOpen(false);
    setSelectedStudent(null);
    toast({
      title: "تم الحذف",
      description: "تم حذف الطالب بنجاح وحفظ البيانات",
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

  const openEditImagesDialog = (
    student: Student,
    imageType: "new" | "recent" | "distant"
  ) => {
    setSelectedStudent(student);
    setEditingImageType(imageType);
    setIsEditImagesDialogOpen(true);
  };

  const handleEditImages = () => {
    if (!selectedStudent) return;

    const updatedStudents = students.map((student) =>
      student.id === selectedStudent.id
        ? { ...student, images: newStudent.images || student.images }
        : student
    );

    setStudents(updatedStudents);

    // Save to localStorage
    localStorage.setItem("students", JSON.stringify(updatedStudents));

    setIsEditImagesDialogOpen(false);
    setSelectedStudent(null);
    toast({
      title: "تم التعديل",
      description: "تم تعديل السور المحفوظة بنجاح وحفظ البيانات",
    });
  };

  // Functions for notes operations
  const handleAddNote = () => {
    if (!selectedStudent || !newNote.content.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال محتوى الملاحظة",
        variant: "destructive",
      });
      return;
    }

    const note = {
      id: Date.now().toString(),
      type: newNote.type,
      content: newNote.content,
      date: newNote.date,
      teacher: newNote.teacher,
    };

    const updatedNotes = {
      ...studentsNotes,
      [selectedStudent.id]: [
        ...(studentsNotes[selectedStudent.id] || []),
        note,
      ],
    };

    setStudentsNotes(updatedNotes);
    localStorage.setItem("studentsNotes", JSON.stringify(updatedNotes));

    setNewNote({
      type: "إيجابي",
      content: "",
      date: new Date().toISOString().split("T")[0],
      teacher: "المعلم الحالي",
    });

    setIsAddNoteDialogOpen(false);
    toast({
      title: "تم الإضافة",
      description: "تم إضافة الملاحظة بنجاح وحفظ البيانات",
    });
  };

  const handleEditNote = () => {
    if (!selectedStudent || !selectedNote || !newNote.content.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال محتوى الملاحظة",
        variant: "destructive",
      });
      return;
    }

    const updatedNotes = {
      ...studentsNotes,
      [selectedStudent.id]: studentsNotes[selectedStudent.id].map((note) =>
        note.id === selectedNote.id
          ? {
              ...note,
              type: newNote.type,
              content: newNote.content,
              date: newNote.date,
              teacher: newNote.teacher,
            }
          : note
      ),
    };

    setStudentsNotes(updatedNotes);
    localStorage.setItem("studentsNotes", JSON.stringify(updatedNotes));

    setNewNote({
      type: "إيجابي",
      content: "",
      date: new Date().toISOString().split("T")[0],
      teacher: "المعلم الحالي",
    });

    setIsEditNoteDialogOpen(false);
    setSelectedNote(null);
    toast({
      title: "تم التعديل",
      description: "تم تعديل الملاحظة بنجاح وحفظ البيانات",
    });
  };

  const handleDeleteNote = (studentId: string, noteId: string) => {
    const updatedNotes = {
      ...studentsNotes,
      [studentId]: studentsNotes[studentId].filter(
        (note) => note.id !== noteId
      ),
    };

    setStudentsNotes(updatedNotes);
    localStorage.setItem("studentsNotes", JSON.stringify(updatedNotes));

    toast({
      title: "تم الحذف",
      description: "تم حذف الملاحظة بنجاح وحفظ البيانات",
    });
  };

  const openAddNoteDialog = (student: Student) => {
    setSelectedStudent(student);
    setNewNote({
      type: "إيجابي",
      content: "",
      date: new Date().toISOString().split("T")[0],
      teacher: "المعلم الحالي",
    });
    setIsAddNoteDialogOpen(true);
  };

  const openEditNoteDialog = (student: Student, note: any) => {
    setSelectedStudent(student);
    setSelectedNote(note);
    setNewNote({
      type: note.type,
      content: note.content,
      date: note.date,
      teacher: note.teacher,
    });
    setIsEditNoteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="إدارة الطلاب" showBack={true} />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            👥 الطلاب
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
            إدارة بيانات الطلاب ومتابعة أدائهم وحضورهم
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-4 space-x-0 sm:space-x-4 space-x-reverse">
              <Input
                placeholder="البحث عن طالب..."
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
                  إضافة طالب جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-base">
                    إضافة طالب جديد
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-xs">
                    أدخل بيانات الطالب الجديد
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <Label htmlFor="name" className="text-right sm:text-sm">
                      الاسم
                    </Label>
                    <Input
                      id="name"
                      value={newStudent.name}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, name: e.target.value })
                      }
                      className="col-span-1 sm:col-span-3 text-base sm:text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <Label htmlFor="age" className="text-right sm:text-sm">
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
                      className="col-span-1 sm:col-span-3 text-base sm:text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <Label htmlFor="grade" className="text-right sm:text-sm">
                      المرحلة الدراسية
                    </Label>
                    <Input
                      id="grade"
                      value={newStudent.grade}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, grade: e.target.value })
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
                      value={newStudent.department}
                      onValueChange={(value) =>
                        setNewStudent({
                          ...newStudent,
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
                    <Label
                      htmlFor="teacherId"
                      className="text-right sm:text-sm"
                    >
                      المعلم
                    </Label>
                    <Select
                      value={newStudent.teacherId}
                      onValueChange={(value) =>
                        setNewStudent({ ...newStudent, teacherId: value })
                      }
                    >
                      <SelectTrigger className="col-span-1 sm:col-span-3 text-base sm:text-sm">
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
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <Label
                      htmlFor="parentName"
                      className="text-right sm:text-sm"
                    >
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
                      className="col-span-1 sm:col-span-3 text-base sm:text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <Label
                      htmlFor="parentPhone"
                      className="text-right sm:text-sm"
                    >
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
                      className="col-span-1 sm:col-span-3 text-base sm:text-sm"
                    />
                  </div>

                  {/* إضافة خانات الصور المتعددة */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium">
                      السور الجديدة
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Input
                        placeholder="سورة الجديدة"
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
                    className="text-sm"
                  >
                    إلغاء
                  </Button>
                  <Button onClick={handleAddStudent} className="text-sm">
                    إضافة طالب
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 text-xs sm:text-sm">
            <TabsTrigger value="all">جميع الطلاب</TabsTrigger>
            <TabsTrigger value="attendance">الحضور</TabsTrigger>
            <TabsTrigger value="grades">الدرجات</TabsTrigger>
            <TabsTrigger value="images">الصور</TabsTrigger>
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">
                          الطالب
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">
                          العمر
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm">
                          القسم
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">
                          المعلم
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">
                          الأجزاء
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm hidden xl:table-cell">
                          الحضور
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
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse">
                              <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                                <AvatarImage src="" />
                                <AvatarFallback className="text-xs sm:text-sm">
                                  {student.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-xs sm:text-sm">
                                  {student.name}
                                </div>
                                <div className="text-xs text-muted-foreground hidden sm:block">
                                  {student.grade}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                            {student.age}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <Badge variant="outline" className="text-xs">
                              {getDepartmentName(student.department)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                            {
                              teachers[
                                student.teacherId as keyof typeof teachers
                              ]
                            }
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            {student.partsMemorized}
                          </TableCell>
                          <TableCell
                            className={`text-xs sm:text-sm hidden xl:table-cell ${getAttendanceColor(
                              student.attendance
                            )}`}
                          >
                            {student.attendance}%
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <Badge
                              className={
                                student.isActive
                                  ? "bg-green-100 text-green-800 text-xs"
                                  : "bg-red-100 text-red-800 text-xs"
                              }
                            >
                              {student.isActive ? "نشط" : "غير نشط"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex space-x-1 space-x-reverse">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "عرض تفاصيل الطالب",
                                    description: `جاري عرض تفاصيل الطالب ${student.name}...`,
                                  });
                                  setActiveTab("images");
                                }}
                                className="text-xs px-2 py-1 h-7 sm:h-8 sm:px-3"
                              >
                                عرض
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(student)}
                                className="text-xs px-2 py-1 h-7 sm:h-8 sm:px-3"
                              >
                                تعديل
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openDeleteDialog(student)}
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
                          {/* السورة الجديدة */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-green-700 bg-green-50 p-2 rounded border border-green-200">
                                📖 السورة الجديدة
                              </h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  openEditImagesDialog(student, "new")
                                }
                                className="text-xs px-2 py-1 h-6"
                              >
                                تعديل
                              </Button>
                            </div>
                            <div className="p-3 bg-green-100 rounded border border-green-300 min-h-[60px]">
                              <p className="text-sm text-green-800">
                                {student.images.new ||
                                  "لم يتم تسجيل صورة جديدة"}
                              </p>
                            </div>
                          </div>

                          {/* الماضي القريب */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
                                📚 الماضي القريب
                              </h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  openEditImagesDialog(student, "recent")
                                }
                                className="text-xs px-2 py-1 h-6"
                              >
                                تعديل
                              </Button>
                            </div>
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
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">
                                📜 الماضي البعيد
                              </h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  openEditImagesDialog(student, "distant")
                                }
                                className="text-xs px-2 py-1 h-6"
                              >
                                تعديل
                              </Button>
                            </div>
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
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    openEditNoteDialog(student, note)
                                  }
                                >
                                  تعديل
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteNote(student.id, note.id)
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
                          لا توجد ملاحظات لهذا الطالب
                        </p>
                      )}
                      <Button
                        variant="outline"
                        className="mt-3"
                        onClick={() => openAddNoteDialog(student)}
                      >
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
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
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

            {/* إضافة حقول الصور في نافذة التعديل */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">الأجزاء المحفوظة</Label>
              <Input
                type="number"
                value={newStudent.partsMemorized}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    partsMemorized: parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">التقدم الحالي</Label>
              <Input
                value={newStudent.currentProgress}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    currentProgress: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">التقدم السابق</Label>
              <Input
                value={newStudent.previousProgress}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    previousProgress: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">نسبة الحضور</Label>
              <Input
                type="number"
                value={newStudent.attendance}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    attendance: parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>

            {/* إضافة خانات الصور المتعددة */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-medium">السورة الجديدة</Label>
              <div className="col-span-3 space-y-2">
                <Input
                  placeholder="سورة الجديدة"
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
              <Label className="text-right font-medium">الماضي القريب</Label>
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
              <Label className="text-right font-medium">الماضي البعيد</Label>
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

      {/* Edit Images Dialog */}
      <Dialog
        open={isEditImagesDialogOpen}
        onOpenChange={setIsEditImagesDialogOpen}
      >
        <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-base">
              تعديل السور المحفوظة
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-xs">
              تعديل سور {selectedStudent?.name} -{" "}
              {editingImageType === "new"
                ? "السورة الجديدة"
                : editingImageType === "recent"
                ? "الماضي القريب"
                : "الماضي البعيد"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {editingImageType === "new" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-new" className="text-right">
                  السورة الجديدة
                </Label>
                <Input
                  id="edit-new"
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
                  className="col-span-3"
                />
              </div>
            )}

            {editingImageType === "recent" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-recent1" className="text-right">
                    الماضي القريب 1
                  </Label>
                  <Input
                    id="edit-recent1"
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
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-recent2" className="text-right">
                    الماضي القريب 2
                  </Label>
                  <Input
                    id="edit-recent2"
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
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-recent3" className="text-right">
                    الماضي القريب 3
                  </Label>
                  <Input
                    id="edit-recent3"
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
                    className="col-span-3"
                  />
                </div>
              </>
            )}

            {editingImageType === "distant" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-distant1" className="text-right">
                    الماضي البعيد 1
                  </Label>
                  <Input
                    id="edit-distant1"
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
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-distant2" className="text-right">
                    الماضي البعيد 2
                  </Label>
                  <Input
                    id="edit-distant2"
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
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-distant3" className="text-right">
                    الماضي البعيد 3
                  </Label>
                  <Input
                    id="edit-distant3"
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
                    className="col-span-3"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditImagesDialogOpen(false)}
              className="text-sm"
            >
              إلغاء
            </Button>
            <Button onClick={handleEditImages} className="text-sm">
              حفظ التعديلات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
