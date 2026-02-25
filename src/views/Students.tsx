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
import { useLanguage } from "@/contexts/LanguageContext";
import PageHeader from "@/components/PageHeader";
import { Department, StudentGrade } from "@/types";
import { getSupabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

// Supabase types
type DbStudent = Tables<"students">;
type DbStudentNote = Tables<"student_notes">;

// Local Student interface that extends Supabase data with camelCase aliases
interface Student extends Omit<DbStudent, 'images'> {
  images?: {
    new?: string;
    recent1?: string;
    recent2?: string;
    recent3?: string;
    distant1?: string;
    distant2?: string;
    distant3?: string;
  };
  // camelCase aliases for compatibility
  teacherId?: string;
  partsMemorized?: number;
  currentProgress?: string;
  previousProgress?: string;
  parentName?: string;
  parentPhone?: string;
  isActive?: boolean;
  createdAt?: Date;
}

interface StudentNote {
  id: string;
  student_id: string;
  type: "إيجابي" | "سلبي";
  content: string;
  note_date: string;
  teacher_name: string;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<Department | "all">(
    "all"
  );
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);

  // Load students from Supabase on mount
  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getSupabase()
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading students:", error);
        return;
      }

      if (data) {
        // Transform Supabase data to local Student format
        const transformedStudents: Student[] = data.map((s) => ({
          ...s,
          // Parse images from JSON if it's a string
          images: typeof s.images === 'string' ? JSON.parse(s.images) : s.images as Student['images'],
          // Map snake_case to camelCase for compatibility
          teacherId: s.teacher_id || "",
          partsMemorized: s.parts_memorized ?? 0,
          currentProgress: s.current_progress || "",
          previousProgress: s.previous_progress || "",
          parentName: s.parent_name || "",
          parentPhone: s.parent_phone || "",
          isActive: s.is_active ?? true,
          createdAt: s.created_at ? new Date(s.created_at) : new Date(),
        }));
        setStudents(transformedStudents);
      }
    } catch (error) {
      console.error("Error loading students:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Mock teacher data for display
  const teachers = {
    teacher1: "الشيخ خالد أحمد",
    teacher2: "الشيخ أحمد محمد",
    teacher3: "الشيخ محمد حسن",
  };

  // Mock grades and notes data
  const studentsGrades: { [key: string]: StudentGrade[] } = {
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

  const [studentsNotes, setStudentsNotes] = useState<{ [key: string]: StudentNote[] }>({});

  // Load student notes from Supabase
  const loadStudentNotes = useCallback(async () => {
    try {
      const { data, error } = await getSupabase()
        .from("student_notes")
        .select("*")
        .order("note_date", { ascending: false });

      if (error) {
        console.error("Error loading student notes:", error);
        return;
      }

      if (data) {
        // Group notes by student_id
        const notesMap: { [key: string]: StudentNote[] } = {};
        data.forEach((note) => {
          const studentId = note.student_id;
          if (!notesMap[studentId]) {
            notesMap[studentId] = [];
          }
          notesMap[studentId].push({
            id: note.id,
            student_id: note.student_id,
            type: note.type as "إيجابي" | "سلبي",
            content: note.content,
            note_date: note.note_date,
            teacher_name: note.teacher_name,
          });
        });
        setStudentsNotes(notesMap);
      }
    } catch (error) {
      console.error("Error loading student notes:", error);
    }
  }, []);

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
  const { toast } = useToast();
  const { t } = useLanguage();

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

  const getDepartmentName = (dept: Department | string) => {
    switch (dept) {
      case "quran":
        return t.students.departments.quran;
      case "tajweed":
        return t.students.departments.tajweed;
      case "tarbawi":
        return t.students.departments.tarbawi;
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
  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.grade || !newStudent.teacherId) {
      toast({
        title: t.students.toast.error,
        description: t.students.toast.fillRequired,
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await getSupabase()
        .from("students")
        .insert({
          name: newStudent.name || "",
          age: newStudent.age || 0,
          grade: newStudent.grade || "",
          department: newStudent.department || "quran",
          teacher_id: newStudent.teacherId || null,
          parts_memorized: newStudent.partsMemorized || 0,
          current_progress: newStudent.currentProgress || "",
          previous_progress: newStudent.previousProgress || "",
          attendance: newStudent.attendance || 0,
          parent_name: newStudent.parentName || null,
          parent_phone: newStudent.parentPhone || null,
          is_active: newStudent.isActive ?? true,
          images: newStudent.images || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding student:", error);
        toast({
          title: t.students.toast.error,
          description: t.students.toast.addError,
          variant: "destructive",
        });
        return;
      }

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
        title: t.students.toast.addSuccess,
        description: t.students.toast.addSuccessDesc,
      });
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: t.students.toast.error,
        description: t.students.toast.addError,
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
        title: t.students.toast.error,
        description: t.students.toast.fillRequired,
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await getSupabase()
        .from("students")
        .update({
          name: newStudent.name,
          age: newStudent.age,
          grade: newStudent.grade,
          department: newStudent.department,
          teacher_id: newStudent.teacherId || null,
          parts_memorized: newStudent.partsMemorized,
          current_progress: newStudent.currentProgress,
          previous_progress: newStudent.previousProgress,
          attendance: newStudent.attendance,
          parent_name: newStudent.parentName || null,
          parent_phone: newStudent.parentPhone || null,
          is_active: newStudent.isActive,
          images: newStudent.images || null,
        })
        .eq("id", selectedStudent.id);

      if (error) {
        console.error("Error updating student:", error);
        toast({
          title: t.students.toast.error,
          description: t.students.toast.editError,
          variant: "destructive",
        });
        return;
      }

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
        title: t.students.toast.editSuccess,
        description: t.students.toast.editSuccessDesc,
      });
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        title: t.students.toast.error,
        description: t.students.toast.editError,
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;

    try {
      const { error } = await getSupabase()
        .from("students")
        .delete()
        .eq("id", selectedStudent.id);

      if (error) {
        console.error("Error deleting student:", error);
        toast({
          title: t.students.toast.error,
          description: t.students.toast.deleteError,
          variant: "destructive",
        });
        return;
      }

      // Reload students to get the updated list
      await loadStudents();

      setIsDeleteDialogOpen(false);
      setSelectedStudent(null);
      toast({
        title: t.students.toast.deleteSuccess,
        description: t.students.toast.deleteSuccessDesc,
      });
    } catch (error) {
      console.error("Error deleting student:", error);
      toast({
        title: t.students.toast.error,
        description: t.students.toast.deleteError,
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
      teacherId: student.teacherId || student.teacher_id || "",
      partsMemorized: student.partsMemorized ?? student.parts_memorized ?? 0,
      currentProgress: student.currentProgress || student.current_progress || "",
      previousProgress: student.previousProgress || student.previous_progress || "",
      attendance: student.attendance ?? 0,
      parentName: student.parentName || student.parent_name || "",
      parentPhone: student.parentPhone || student.parent_phone || "",
      isActive: student.isActive ?? student.is_active ?? true,
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
      const { error } = await getSupabase()
        .from("students")
        .update({
          images: newStudent.images || null,
        })
        .eq("id", selectedStudent.id);

      if (error) {
        console.error("Error updating images:", error);
        toast({
          title: t.students.toast.error,
          description: t.students.toast.imageEditError,
          variant: "destructive",
        });
        return;
      }

      // Reload students to get the updated list
      await loadStudents();

      setIsEditImagesDialogOpen(false);
      setSelectedStudent(null);
      toast({
        title: t.students.toast.imageEditSuccess,
        description: t.students.toast.imageEditSuccessDesc,
      });
    } catch (error) {
      console.error("Error updating images:", error);
      toast({
        title: t.students.toast.error,
        description: t.students.toast.imageEditError,
        variant: "destructive",
      });
    }
  };

  // Functions for notes operations
  const _handleAddNote = async () => {
    if (!selectedStudent || !newNote.content.trim()) {
      toast({
        title: t.students.toast.error,
        description: t.students.toast.noteContentRequired,
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await getSupabase()
        .from("student_notes")
        .insert({
          student_id: selectedStudent.id,
          type: newNote.type,
          content: newNote.content,
          note_date: newNote.date,
          teacher_name: newNote.teacher,
        });

      if (error) {
        console.error("Error adding note:", error);
        toast({
          title: t.students.toast.error,
          description: t.students.toast.noteAddError,
          variant: "destructive",
        });
        return;
      }

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
        title: t.students.toast.noteAddSuccess,
        description: t.students.toast.noteAddSuccessDesc,
      });
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: t.students.toast.error,
        description: t.students.toast.noteAddError,
        variant: "destructive",
      });
    }
  };

  const _handleEditNote = async () => {
    if (!selectedStudent || !selectedNote || !newNote.content.trim()) {
      toast({
        title: t.students.toast.error,
        description: t.students.toast.noteContentRequired,
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await getSupabase()
        .from("student_notes")
        .update({
          type: newNote.type,
          content: newNote.content,
          note_date: newNote.date,
          teacher_name: newNote.teacher,
        })
        .eq("id", selectedNote.id);

      if (error) {
        console.error("Error updating note:", error);
        toast({
          title: t.students.toast.error,
          description: t.students.toast.noteEditError,
          variant: "destructive",
        });
        return;
      }

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
        title: t.students.toast.noteEditSuccess,
        description: t.students.toast.noteEditSuccessDesc,
      });
    } catch (error) {
      console.error("Error updating note:", error);
      toast({
        title: t.students.toast.error,
        description: t.students.toast.noteEditError,
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (studentId: string, noteId: string) => {
    try {
      const { error } = await getSupabase()
        .from("student_notes")
        .delete()
        .eq("id", noteId);

      if (error) {
        console.error("Error deleting note:", error);
        toast({
          title: t.students.toast.error,
          description: t.students.toast.noteDeleteError,
          variant: "destructive",
        });
        return;
      }

      // Reload notes to get the updated list
      await loadStudentNotes();

      toast({
        title: t.students.toast.noteDeleteSuccess,
        description: t.students.toast.noteDeleteSuccessDesc,
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: t.students.toast.error,
        description: t.students.toast.noteDeleteError,
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
      date: note.note_date,
      teacher: note.teacher_name,
    });
    setIsEditNoteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title={t.students.pageTitle} showBack={true} />
        <main className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t.common.loading}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t.students.pageHeaderTitle} showBack={true} />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            👥 {t.students.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
            {t.students.sectionDescription}
          </p>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-4 space-x-0 sm:space-x-4 space-x-reverse">
              <Input
                placeholder={t.students.searchPlaceholder}
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
                  <SelectValue placeholder={t.students.departments.all} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.students.departments.all}</SelectItem>
                  <SelectItem value="quran">{t.students.departments.quran}</SelectItem>
                  <SelectItem value="tajweed">{t.students.departments.tajweed}</SelectItem>
                  <SelectItem value="tarbawi">{t.students.departments.tarbawi}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground w-full sm:w-auto text-sm">
                  {t.students.actions.addNewStudent}
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-base">
                    {t.students.dialog.addTitle}
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-xs">
                    {t.students.dialog.addDescription}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <Label htmlFor="name" className="text-right sm:text-sm">
                      {t.students.form.name}
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
                      {t.students.form.age}
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
                      {t.students.form.grade}
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
                      {t.students.form.department}
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
                        <SelectValue placeholder={t.students.form.selectDepartment} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quran">{t.students.departments.quran}</SelectItem>
                        <SelectItem value="tajweed">{t.students.departments.tajweed}</SelectItem>
                        <SelectItem value="tarbawi">{t.students.departments.tarbawi}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <Label
                      htmlFor="teacherId"
                      className="text-right sm:text-sm"
                    >
                      {t.students.form.teacher}
                    </Label>
                    <Select
                      value={newStudent.teacherId}
                      onValueChange={(value) =>
                        setNewStudent({ ...newStudent, teacherId: value })
                      }
                    >
                      <SelectTrigger className="col-span-1 sm:col-span-3 text-base sm:text-sm">
                        <SelectValue placeholder={t.students.form.selectTeacher} />
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
                      {t.students.form.parentName}
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
                      {t.students.form.parentPhone}
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
                      {t.students.images.newSurah}
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Input
                        placeholder={t.students.images.newSurahPlaceholder}
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
                      {t.students.images.recentPast}
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Input
                        placeholder={t.students.images.recentPastPlaceholder}
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
                        placeholder={t.students.images.recentPastPlaceholder}
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
                        placeholder={t.students.images.recentPastPlaceholder}
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
                      {t.students.images.distantPast}
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Input
                        placeholder={t.students.images.distantPastPlaceholder}
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
                        placeholder={t.students.images.distantPastPlaceholder}
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
                        placeholder={t.students.images.distantPastPlaceholder}
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
                    {t.students.actions.cancel}
                  </Button>
                  <Button onClick={handleAddStudent} className="text-sm">
                    {t.students.actions.addStudent}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 text-xs sm:text-sm">
            <TabsTrigger value="all">{t.students.tabs.allStudents}</TabsTrigger>
            <TabsTrigger value="attendance">{t.students.tabs.attendance}</TabsTrigger>
            <TabsTrigger value="grades">{t.students.tabs.grades}</TabsTrigger>
            <TabsTrigger value="images">{t.students.tabs.images}</TabsTrigger>
            <TabsTrigger value="notes">{t.students.tabs.notes}</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.students.card.studentListTitle}</CardTitle>
                <CardDescription>
                  {t.students.card.studentListDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">
                          {t.students.table.student}
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">
                          {t.students.table.age}
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm">
                          {t.students.table.department}
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">
                          {t.students.table.teacher}
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">
                          {t.students.table.parts}
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm hidden xl:table-cell">
                          {t.students.table.attendance}
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm">
                          {t.students.table.status}
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm">
                          {t.students.table.actions}
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
                              {student.isActive ? t.students.status.active : t.students.status.inactive}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex space-x-1 space-x-reverse">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: t.students.toast.viewDetails,
                                    description: t.students.toast.viewDetailsDesc.replace('{{name}}', student.name),
                                  });
                                  setActiveTab("images");
                                }}
                                className="text-xs px-2 py-1 h-7 sm:h-8 sm:px-3"
                              >
                                {t.students.actions.view}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(student)}
                                className="text-xs px-2 py-1 h-7 sm:h-8 sm:px-3"
                              >
                                {t.students.actions.edit}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openDeleteDialog(student)}
                                className="text-xs px-2 py-1 h-7 sm:h-8 sm:px-3"
                              >
                                {t.students.actions.delete}
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
                <CardTitle>{t.students.attendanceTab.title}</CardTitle>
                <CardDescription>
                  {t.students.attendanceTab.description}
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
                        {teachers[student.teacherId as keyof typeof teachers]} •{" "}
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
                <CardTitle>{t.students.gradesTab.title}</CardTitle>
                <CardDescription>
                  {t.students.gradesTab.description}
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
                <CardTitle>{t.students.images.title}</CardTitle>
                <CardDescription>
                  {t.students.images.description}
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
                                📖 {t.students.images.newSurah}
                              </h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  openEditImagesDialog(student, "new")
                                }
                                className="text-xs px-2 py-1 h-6"
                              >
                                {t.students.actions.edit}
                              </Button>
                            </div>
                            <div className="p-3 bg-green-100 rounded border border-green-300 min-h-[60px]">
                              <p className="text-sm text-green-800">
                                {student.images.new ||
                                  t.students.images.noNewImage}
                              </p>
                            </div>
                          </div>

                          {/* الماضي القريب */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
                                📚 {t.students.images.recentPast}
                              </h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  openEditImagesDialog(student, "recent")
                                }
                                className="text-xs px-2 py-1 h-6"
                              >
                                {t.students.actions.edit}
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <div className="p-2 bg-blue-100 rounded border border-blue-300">
                                <p className="text-xs text-blue-600">1:</p>
                                <p className="text-sm text-blue-800">
                                  {student.images.recent1 || t.students.images.noData}
                                </p>
                              </div>
                              <div className="p-2 bg-blue-100 rounded border border-blue-300">
                                <p className="text-xs text-blue-600">2:</p>
                                <p className="text-sm text-blue-800">
                                  {student.images.recent2 || t.students.images.noData}
                                </p>
                              </div>
                              <div className="p-2 bg-blue-100 rounded border border-blue-300">
                                <p className="text-xs text-blue-600">3:</p>
                                <p className="text-sm text-blue-800">
                                  {student.images.recent3 || t.students.images.noData}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* الماضي البعيد */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">
                                📜 {t.students.images.distantPast}
                              </h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  openEditImagesDialog(student, "distant")
                                }
                                className="text-xs px-2 py-1 h-6"
                              >
                                {t.students.actions.edit}
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <div className="p-2 bg-orange-100 rounded border border-orange-300">
                                <p className="text-xs text-orange-600">1:</p>
                                <p className="text-sm text-orange-800">
                                  {student.images.distant1 || t.students.images.noData}
                                </p>
                              </div>
                              <div className="p-2 bg-orange-100 rounded border border-orange-300">
                                <p className="text-xs text-orange-600">2:</p>
                                <p className="text-sm text-orange-800">
                                  {student.images.distant2 || t.students.images.noData}
                                </p>
                              </div>
                              <div className="p-2 bg-orange-100 rounded border border-orange-300">
                                <p className="text-xs text-orange-600">3:</p>
                                <p className="text-sm text-orange-800">
                                  {student.images.distant3 || t.students.images.noData}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {!student.images && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>{t.students.images.noImagesForStudent}</p>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <span>
                            {t.students.images.totalPartsMemorized}: {student.partsMemorized}
                          </span>
                          <span>{t.students.images.currentProgressLabel}: {student.currentProgress}</span>
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
                <CardTitle>{t.students.notes.supervisorNotes}</CardTitle>
                <CardDescription>{t.students.notes.supervisorNotesDesc}</CardDescription>
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
                                    {note.type === "إيجابي" ? t.students.notes.positive : t.students.notes.negative}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {note.note_date} • {note.teacher_name}
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
                                  {t.students.actions.edit}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteNote(student.id, note.id)
                                  }
                                >
                                  {t.students.actions.delete}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          {t.students.notes.noNotesForStudent}
                        </p>
                      )}
                      <Button
                        variant="outline"
                        className="mt-3"
                        onClick={() => openAddNoteDialog(student)}
                      >
                        {t.students.actions.addNewNote}
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
            <DialogTitle>{t.students.dialog.editTitle}</DialogTitle>
            <DialogDescription>{t.students.dialog.editDescription}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                {t.students.form.name}
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
                {t.students.form.age}
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
                {t.students.form.grade}
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
                {t.students.form.department}
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
                  <SelectValue placeholder={t.students.form.selectDepartment} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quran">{t.students.departments.quran}</SelectItem>
                  <SelectItem value="tajweed">{t.students.departments.tajweed}</SelectItem>
                  <SelectItem value="tarbawi">{t.students.departments.tarbawi}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-teacherId" className="text-right">
                {t.students.form.teacher}
              </Label>
              <Select
                value={newStudent.teacherId}
                onValueChange={(value) =>
                  setNewStudent({ ...newStudent, teacherId: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t.students.form.selectTeacher} />
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
                {t.students.form.parentName}
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
                {t.students.form.parentPhone}
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
              <Label className="text-right font-medium">{t.students.form.partsMemorized}</Label>
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
              <Label className="text-right font-medium">{t.students.form.currentProgress}</Label>
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
              <Label className="text-right font-medium">{t.students.form.previousProgress}</Label>
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
              <Label className="text-right font-medium">{t.students.form.attendanceRate}</Label>
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
              <Label className="text-right font-medium">{t.students.images.newSurah}</Label>
              <div className="col-span-3 space-y-2">
                <Input
                  placeholder={t.students.images.newSurahPlaceholder}
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
              <Label className="text-right font-medium">{t.students.images.recentPast}</Label>
              <div className="col-span-3 space-y-2">
                <Input
                  placeholder={t.students.images.recentPastPlaceholder}
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
                  placeholder={t.students.images.recentPastPlaceholder}
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
                  placeholder={t.students.images.recentPastPlaceholder}
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
              <Label className="text-right font-medium">{t.students.images.distantPast}</Label>
              <div className="col-span-3 space-y-2">
                <Input
                  placeholder={t.students.images.distantPastPlaceholder}
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
                  placeholder={t.students.images.distantPastPlaceholder}
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
                  placeholder={t.students.images.distantPastPlaceholder}
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
              {t.students.actions.cancel}
            </Button>
            <Button onClick={handleEditStudent}>{t.students.actions.saveChanges}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.students.confirmDelete}</DialogTitle>
            <DialogDescription>
              {t.students.deleteConfirmMessage.replace('{{name}}', selectedStudent?.name ?? '')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t.students.actions.cancel}
            </Button>
            <Button variant="destructive" onClick={handleDeleteStudent}>
              {t.students.actions.delete}
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
              {t.students.images.editTitle}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-xs">
              {t.students.images.editDescription.replace('{{name}}', selectedStudent?.name ?? '')}{" - "}
              {editingImageType === "new"
                ? t.students.images.newSurah
                : editingImageType === "recent"
                ? t.students.images.recentPast
                : t.students.images.distantPast}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {editingImageType === "new" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-new" className="text-right">
                  {t.students.images.newSurah}
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
                    {t.students.images.recentPast} 1
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
                    {t.students.images.recentPast} 2
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
                    {t.students.images.recentPast} 3
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
                    {t.students.images.distantPast} 1
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
                    {t.students.images.distantPast} 2
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
                    {t.students.images.distantPast} 3
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
              {t.students.actions.cancel}
            </Button>
            <Button onClick={handleEditImages} className="text-sm">
              {t.students.actions.saveChanges}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
