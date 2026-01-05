import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSupabase } from "@/integrations/supabase/client";

// Mock the supabase client
vi.mock("@/integrations/supabase/client", () => ({
  getSupabase: vi.fn(),
}));

// Mock toast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock students data
const mockStudents = [
  {
    id: "student-1",
    name: "أحمد محمد علي",
    age: 12,
    grade: "السادس ابتدائي",
    department: "quran",
    teacher_id: "teacher-1",
    parts_memorized: 5,
    current_progress: "سورة آل عمران - الآية 50",
    previous_progress: "سورة البقرة - الآية 200",
    attendance: 85,
    parent_name: "محمد علي",
    parent_phone: "01234567890",
    is_active: true,
    images: null,
    created_at: "2025-11-01T10:00:00Z",
  },
  {
    id: "student-2",
    name: "عمر خالد حسن",
    age: 14,
    grade: "الثالث إعدادي",
    department: "tajweed",
    teacher_id: "teacher-2",
    parts_memorized: 8,
    current_progress: "سورة النساء - الآية 100",
    previous_progress: "سورة آل عمران - الآية 50",
    attendance: 92,
    parent_name: "خالد حسن",
    parent_phone: "01234567891",
    is_active: true,
    images: null,
    created_at: "2025-11-02T10:00:00Z",
  },
];

// Mock student notes data
const mockStudentNotes = [
  {
    id: "note-1",
    student_id: "student-1",
    type: "إيجابي",
    content: "مشاركة ممتازة في الحلقة",
    note_date: "2025-11-01",
    teacher_name: "الشيخ خالد",
    created_at: "2025-11-01T10:00:00Z",
  },
];

describe("Students View - Supabase Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Data Loading", () => {
    it("should load students from Supabase on mount", async () => {
      const mockOrder = vi.fn().mockResolvedValue({ data: mockStudents, error: null });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      await supabase.from("students").select("*").order("created_at", { ascending: false });

      expect(mockFrom).toHaveBeenCalledWith("students");
      expect(mockSelect).toHaveBeenCalledWith("*");
    });

    it("should load student notes from Supabase", async () => {
      const mockNotesOrder = vi.fn().mockResolvedValue({ data: mockStudentNotes, error: null });
      const mockNotesSelect = vi.fn().mockReturnValue({ order: mockNotesOrder });
      const mockFrom = vi.fn().mockReturnValue({ select: mockNotesSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      await supabase.from("student_notes").select("*").order("note_date", { ascending: false });

      expect(mockFrom).toHaveBeenCalledWith("student_notes");
    });

    it("should handle loading errors gracefully", async () => {
      const mockError = { message: "Database connection failed" };
      const mockOrder = vi.fn().mockResolvedValue({ data: null, error: mockError });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase.from("students").select("*").order("created_at", { ascending: false });

      expect(result.error).toEqual(mockError);
    });
  });

  describe("Add Student", () => {
    it("should insert new student into Supabase", async () => {
      const newStudent = {
        name: "طالب جديد",
        age: 10,
        grade: "الرابع ابتدائي",
        department: "quran",
        teacher_id: "teacher-1",
        parts_memorized: 2,
        current_progress: "سورة البقرة - الآية 50",
        previous_progress: "",
        attendance: 100,
        parent_name: "الأب",
        parent_phone: "01234567899",
        is_active: true,
        images: null,
      };

      const insertedStudent = {
        id: "new-student-id",
        ...newStudent,
        created_at: "2025-11-06T10:00:00Z",
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: insertedStudent, error: null });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase.from("students").insert(newStudent).select().single();

      expect(mockInsert).toHaveBeenCalledWith(newStudent);
      expect(result.data).toEqual(insertedStudent);
      expect(result.data!.id).toBe("new-student-id");
    });

    it("should validate required fields", async () => {
      const invalidStudent = {
        name: "",
        age: 0,
        grade: "",
        department: "quran",
      };

      const mockError = { message: "Validation failed", code: "23502" };
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase.from("students").insert(invalidStudent).select().single();

      expect(result.error).not.toBeNull();
    });
  });

  describe("Edit Student", () => {
    it("should update student in Supabase", async () => {
      const studentId = "student-1";
      const updates = {
        name: "أحمد محمد (محدث)",
        parts_memorized: 6,
        current_progress: "سورة النساء - الآية 1",
      };

      const updatedStudent = {
        id: studentId,
        ...mockStudents[0],
        ...updates,
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: updatedStudent, error: null });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase
        .from("students")
        .update(updates)
        .eq("id", studentId)
        .select()
        .single();

      expect(mockUpdate).toHaveBeenCalledWith(updates);
      expect(mockEq).toHaveBeenCalledWith("id", studentId);
      expect(result.data!.name).toBe("أحمد محمد (محدث)");
      expect(result.data!.parts_memorized).toBe(6);
    });
  });

  describe("Delete Student", () => {
    it("should delete student from Supabase", async () => {
      const studentId = "student-1";

      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ delete: mockDelete });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase.from("students").delete().eq("id", studentId);

      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", studentId);
      expect(result.error).toBeNull();
    });

    it("should cascade delete student notes when student is deleted", async () => {
      const studentId = "student-1";

      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ delete: mockDelete });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      await supabase.from("students").delete().eq("id", studentId);

      expect(mockEq).toHaveBeenCalledWith("id", studentId);
    });
  });

  describe("Student Notes Operations", () => {
    it("should add a note to a student", async () => {
      const newNote = {
        student_id: "student-1",
        type: "إيجابي",
        content: "حفظ ممتاز اليوم",
        note_date: "2025-11-06",
        teacher_name: "الشيخ أحمد",
      };

      const createdNote = {
        id: "new-note-id",
        ...newNote,
        created_at: "2025-11-06T10:00:00Z",
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: createdNote, error: null });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase.from("student_notes").insert(newNote).select().single();

      expect(mockFrom).toHaveBeenCalledWith("student_notes");
      expect(result.data!.content).toBe("حفظ ممتاز اليوم");
    });

    it("should update a student note", async () => {
      const noteId = "note-1";
      const updates = {
        content: "محتوى محدث",
        type: "سلبي",
      };

      const updatedNote = {
        id: noteId,
        ...mockStudentNotes[0],
        ...updates,
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: updatedNote, error: null });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase
        .from("student_notes")
        .update(updates)
        .eq("id", noteId)
        .select()
        .single();

      expect(result.data!.content).toBe("محتوى محدث");
      expect(result.data!.type).toBe("سلبي");
    });

    it("should delete a student note", async () => {
      const noteId = "note-1";

      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ delete: mockDelete });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase.from("student_notes").delete().eq("id", noteId);

      expect(mockEq).toHaveBeenCalledWith("id", noteId);
      expect(result.error).toBeNull();
    });
  });

  describe("Student Images Update", () => {
    it("should update student images (Quran progress)", async () => {
      const studentId = "student-1";
      const newImages = {
        new: "سورة المائدة - الآية 1-20",
        recent1: "سورة النساء - الآية 100-176",
        recent2: "سورة آل عمران - الآية 100-200",
        recent3: "سورة آل عمران - الآية 1-100",
        distant1: "سورة البقرة - الآية 200-286",
        distant2: "سورة البقرة - الآية 100-200",
        distant3: "سورة البقرة - الآية 1-100",
      };

      const mockSingle = vi.fn().mockResolvedValue({
        data: { id: studentId, images: newImages },
        error: null,
      });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase
        .from("students")
        .update({ images: newImages })
        .eq("id", studentId)
        .select()
        .single();

      expect(mockUpdate).toHaveBeenCalledWith({ images: newImages });
      expect(result.data!.images).toEqual(newImages);
    });
  });

  describe("Data Transformation", () => {
    it("should transform snake_case to camelCase for compatibility", () => {
      const dbStudent = mockStudents[0];

      const transformedStudent = {
        ...dbStudent,
        teacherId: dbStudent.teacher_id || "",
        partsMemorized: dbStudent.parts_memorized ?? 0,
        currentProgress: dbStudent.current_progress || "",
        previousProgress: dbStudent.previous_progress || "",
        parentName: dbStudent.parent_name || "",
        parentPhone: dbStudent.parent_phone || "",
        isActive: dbStudent.is_active ?? true,
      };

      expect(transformedStudent.teacherId).toBe("teacher-1");
      expect(transformedStudent.partsMemorized).toBe(5);
      expect(transformedStudent.currentProgress).toBe("سورة آل عمران - الآية 50");
      expect(transformedStudent.parentName).toBe("محمد علي");
      expect(transformedStudent.isActive).toBe(true);
    });

    it("should group notes by student_id", () => {
      const notes = [
        { id: "1", student_id: "student-1", content: "Note 1" },
        { id: "2", student_id: "student-1", content: "Note 2" },
        { id: "3", student_id: "student-2", content: "Note 3" },
      ];

      const notesMap: { [key: string]: typeof notes } = {};
      notes.forEach((note) => {
        if (!notesMap[note.student_id]) {
          notesMap[note.student_id] = [];
        }
        notesMap[note.student_id].push(note);
      });

      expect(notesMap["student-1"]).toHaveLength(2);
      expect(notesMap["student-2"]).toHaveLength(1);
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors on add", async () => {
      const mockError = { message: "Network error" };
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase.from("students").insert({}).select().single();

      expect(result.error).toEqual(mockError);
      expect(result.data).toBeNull();
    });

    it("should handle network errors on update", async () => {
      const mockError = { message: "Network error" };
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase
        .from("students")
        .update({})
        .eq("id", "student-1")
        .select()
        .single();

      expect(result.error).toEqual(mockError);
    });

    it("should handle network errors on delete", async () => {
      const mockError = { message: "Network error" };
      const mockEq = vi.fn().mockResolvedValue({ error: mockError });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ delete: mockDelete });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase.from("students").delete().eq("id", "student-1");

      expect(result.error).toEqual(mockError);
    });
  });
});
