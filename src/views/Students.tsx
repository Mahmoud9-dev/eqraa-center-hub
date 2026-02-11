'use client';

import { useState, useEffect, useCallback } from "react";
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
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import { Department } from "@/types";
import * as studentsService from "@/lib/db/services/students";
import * as studentNotesService from "@/lib/db/services/studentNotes";
import * as teachersService from "@/lib/db/services/teachers";
import type { DbStudent, DbTeacher } from "@/lib/db/types";

// Local Student interface - now directly uses DbStudent fields (camelCase)
interface Student extends DbStudent {
  // No need for snake_case aliases since Dexie types are already camelCase
}

interface StudentNote {
  id: string;
  studentId: string;
  type: "إيجابي" | "سلبي";
  content: string;
  noteDate: string;
  teacherName: string;
}

// Form state interface (uses camelCase for form inputs)
interface StudentFormData {
  name: string;
  age: number;
  grade: string;
  department: Department | string;
  teacherId: string;
  partsMemorized: number;
  currentProgress: string;
  previousProgress: string;
  attendance: number;
  parentName: string;
  parentPhone: string;
  isActive: boolean;
  images?: {
    new?: string;
    recent1?: string;
    recent2?: string;
    recent3?: string;
    distant1?: string;
    distant2?: string;
    distant3?: string;
  };
}

const Students = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<Department | "all">(
    "all"
  );
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);

  // Load students from Dexie on mount
  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await studentsService.getAll();
      setStudents(data as Student[]);
    } catch (error) {
      console.error("Error loading students:", error);
      toast({ title: "خطأ", description: "فشل تحميل بيانات الطلاب", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Teachers loaded from Dexie, keyed by ID for display
  const [teachersMap, setTeachersMap] = useState<Record<string, string>>({});

  const loadTeachers = useCallback(async () => {
    try {
      const data = await teachersService.getAll();
      const map: Record<string, string> = {};
      data.forEach((t: DbTeacher) => {
        map[t.id] = t.name;
      });
      setTeachersMap(map);
    } catch (error) {
      console.error("Error loading teachers:", error);
      toast({ title: "خطأ", description: "فشل تحميل بيانات المعلمين", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  const [studentsNotes, setStudentsNotes] = useState<{ [key: string]: StudentNote[] }>({});

  // Load student notes from Dexie
  const loadStudentNotes = useCallback(async () => {
    try {
      const data = await studentNotesService.getAll();

      // Group notes by studentId
      const notesMap: { [key: string]: StudentNote[] } = {};
      data.forEach((note) => {
        const studentId = note.studentId;
        if (!notesMap[studentId]) {
          notesMap[studentId] = [];
        }
        notesMap[studentId].push({
          id: note.id,
          studentId: note.studentId,
          type: note.type as "إيجابي" | "سلبي",
          content: note.content,
          noteDate: note.noteDate,
          teacherName: note.teacherName,
        });
      });
      setStudentsNotes(notesMap);
    } catch (error) {
      console.error("Error loading student notes:", error);
      toast({ title: "خطأ", description: "فشل تحميل ملاحظات الطلاب", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    loadStudentNotes();
  }, [loadStudentNotes]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditImagesDialogOpen, setIsEditImagesDialogOpen] = useState(false);
  const [_isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false);
  const [_isEditNoteDialogOpen, setIsEditNoteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedNote, setSelectedNote] = useState<StudentNote | null>(null);
  const [editingImageType, setEditingImageType] = useState<
    "new" | "recent" | "distant"
  >("new");
  const [newNote, setNewNote] = useState({
    type: "إيجابي" as "إيجابي" | "سلبي",
    content: "",
    date: new Date().toISOString().split("T")[0],
    teacher: "المعلم الحالي",
  });
  const [newStudent, setNewStudent] = useState<StudentFormData>({
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

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teachersMap[student.teacherId || ""] || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === "all" || student.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getDepartmentName = (dept: Department | string) => {
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

  const getNoteTypeColor = (type: string) => {
    return type === "إيجابي"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  // Functions for CRUD operations
  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.grade || !newStudent.teacherId) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      await studentsService.add({
        name: newStudent.name || "",
        age: newStudent.age || 0,
        grade: newStudent.grade || "",
        department: newStudent.department || "quran",
        teacherId: newStudent.teacherId || null,
        partsMemorized: newStudent.partsMemorized || 0,
        currentProgress: newStudent.currentProgress || "",
        previousProgress: newStudent.previousProgress || "",
        attendance: newStudent.attendance || 0,
        parentName: newStudent.parentName || null,
        parentPhone: newStudent.parentPhone || null,
        isActive: newStudent.isActive ?? true,
        images: newStudent.images || null,
      });

      // Reload students to get the updated list
      await loadStudents();

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
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الطالب",
        variant: "destructive",
      });
    }
  };

  const handleEditStudent = async () => {
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

    try {
      await studentsService.update(selectedStudent.id, {
        name: newStudent.name,
        age: newStudent.age,
        grade: newStudent.grade,
        department: newStudent.department,
        teacherId: newStudent.teacherId || null,
        partsMemorized: newStudent.partsMemorized,
        currentProgress: newStudent.currentProgress,
        previousProgress: newStudent.previousProgress,
        attendance: newStudent.attendance,
        parentName: newStudent.parentName || null,
        parentPhone: newStudent.parentPhone || null,
        isActive: newStudent.isActive,
        images: newStudent.images || null,
      });

      // Reload students to get the updated list
      await loadStudents();

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
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تعديل الطالب",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;

    try {
      await studentsService.remove(selectedStudent.id);

      // Reload students to get the updated list
      await loadStudents();

      setIsDeleteDialogOpen(false);
      setSelectedStudent(null);
      toast({
        title: "تم الحذف",
        description: "تم حذف الطالب بنجاح",
      });
    } catch (error) {
      console.error("Error deleting student:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الطالب",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (student: Student) => {
    setSelectedStudent(student);
    setNewStudent({
      name: student.name,
      age: student.age,
      grade: student.grade,
      department: student.department,
      teacherId: student.teacherId || "",
      partsMemorized: student.partsMemorized ?? 0,
      currentProgress: student.currentProgress || "",
      previousProgress: student.previousProgress || "",
      attendance: student.attendance ?? 0,
      parentName: student.parentName || "",
      parentPhone: student.parentPhone || "",
      isActive: student.isActive ?? true,
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

  const handleEditImages = async () => {
    if (!selectedStudent) return;

    try {
      await studentsService.update(selectedStudent.id, {
        images: newStudent.images || null,
      });

      // Reload students to get the updated list
      await loadStudents();

      setIsEditImagesDialogOpen(false);
      setSelectedStudent(null);
      toast({
        title: "تم التعديل",
        description: "تم تعديل السور المحفوظة بنجاح",
      });
    } catch (error) {
      console.error("Error updating images:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تعديل السور المحفوظة",
        variant: "destructive",
      });
    }
  };

  // Functions for notes operations
  const _handleAddNote = async () => {
    if (!selectedStudent || !newNote.content.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال محتوى الملاحظة",
        variant: "destructive",
      });
      return;
    }

    try {
      await studentNotesService.add({
        studentId: selectedStudent.id,
        type: newNote.type,
        content: newNote.content,
        noteDate: newNote.date,
        teacherName: newNote.teacher,
      });

      // Reload notes to get the updated list
      await loadStudentNotes();

      setNewNote({
        type: "إيجابي",
        content: "",
        date: new Date().toISOString().split("T")[0],
        teacher: "المعلم الحالي",
      });

      setIsAddNoteDialogOpen(false);
      toast({
        title: "تم الإضافة",
        description: "تم إضافة الملاحظة بنجاح",
      });
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الملاحظة",
        variant: "destructive",
      });
    }
  };

  const _handleEditNote = async () => {
    if (!selectedStudent || !selectedNote || !newNote.content.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال محتوى الملاحظة",
        variant: "destructive",
      });
      return;
    }

    try {
      await studentNotesService.update(selectedNote.id, {
        type: newNote.type,
        content: newNote.content,
        noteDate: newNote.date,
        teacherName: newNote.teacher,
      });

      // Reload notes to get the updated list
      await loadStudentNotes();

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
        description: "تم تعديل الملاحظة بنجاح",
      });
    } catch (error) {
      console.error("Error updating note:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تعديل الملاحظة",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (studentId: string, noteId: string) => {
    try {
      await studentNotesService.remove(noteId);

      // Reload notes to get the updated list
      await loadStudentNotes();

      toast({
        title: "تم الحذف",
        description: "تم حذف الملاحظة بنجاح",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الملاحظة",
        variant: "destructive",
      });
    }
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

  const openEditNoteDialog = (student: Student, note: StudentNote) => {
    setSelectedStudent(student);
    setSelectedNote(note);
    setNewNote({
      type: note.type,
      content: note.content,
      date: note.noteDate,
      teacher: note.teacherName,
    });
    setIsEditNoteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="إدارة الطلاب" showBack={true} />
        <main className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">جاري تحميل بيانات الطلاب...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                        {Object.entries(teachersMap).map(([id, name]) => (
                          <SelectItem key={id} value={id}>
                            {name}
                          </SelectItem>
                        ))}
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
                            {teachersMap[student.teacherId || ""] || "-"}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            {student.partsMemorized}
                          </TableCell>
                          <TableCell
                            className={`text-xs sm:text-sm hidden xl:table-cell ${getAttendanceColor(
                              student.attendance ?? 0
                            )}`}
                          >
                            {student.attendance ?? 0}%
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
                          className={getAttendanceColor(student.attendance ?? 0)}
                        >
                          {student.attendance ?? 0}%
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {teachersMap[student.teacherId || ""] || "-"} •{" "}
                        {getDepartmentName(student.department)}
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${student.attendance ?? 0}%` }}
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
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg mb-2">قريبا</p>
                  <p className="text-sm">نظام الدرجات قيد التطوير وسيتم إضافته في تحديث قادم.</p>
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
                                    {note.noteDate} • {note.teacherName}
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
                  {Object.entries(teachersMap).map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
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
