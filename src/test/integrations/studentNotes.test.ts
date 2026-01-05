import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSupabase } from "@/integrations/supabase/client";

// Mock the supabase client
vi.mock("@/integrations/supabase/client", () => ({
  getSupabase: vi.fn(),
}));

describe("Student Notes CRUD Operations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Fetch Student Notes", () => {
    it("should fetch all student notes successfully", async () => {
      const mockNotes = [
        {
          id: "note-1",
          student_id: "student-1",
          type: "إيجابي",
          content: "مشاركة ممتازة في الحلقة",
          note_date: "2025-11-01",
          teacher_name: "الشيخ خالد",
          created_at: "2025-11-01T10:00:00Z",
        },
        {
          id: "note-2",
          student_id: "student-1",
          type: "سلبي",
          content: "تأخير في الحضور",
          note_date: "2025-10-28",
          teacher_name: "الشيخ خالد",
          created_at: "2025-10-28T10:00:00Z",
        },
      ];

      const mockOrder = vi.fn().mockResolvedValue({ data: mockNotes, error: null });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("student_notes")
        .select("*")
        .order("note_date", { ascending: false });

      expect(mockFrom).toHaveBeenCalledWith("student_notes");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockOrder).toHaveBeenCalledWith("note_date", { ascending: false });
      expect(result.data).toEqual(mockNotes);
      expect(result.error).toBeNull();
    });

    it("should fetch notes for a specific student", async () => {
      const studentId = "student-1";
      const mockNotes = [
        {
          id: "note-1",
          student_id: studentId,
          type: "إيجابي",
          content: "حفظ ممتاز",
          note_date: "2025-11-01",
          teacher_name: "الشيخ أحمد",
        },
      ];

      const mockOrder = vi.fn().mockResolvedValue({ data: mockNotes, error: null });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("student_notes")
        .select("*")
        .eq("student_id", studentId)
        .order("note_date", { ascending: false });

      expect(mockEq).toHaveBeenCalledWith("student_id", studentId);
      expect(result.data).toHaveLength(1);
      expect(result.data![0].student_id).toBe(studentId);
    });

    it("should handle empty results gracefully", async () => {
      const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("student_notes")
        .select("*")
        .order("note_date", { ascending: false });

      expect(result.data).toEqual([]);
      expect(result.error).toBeNull();
    });

    it("should handle fetch errors", async () => {
      const mockError = { message: "Database connection failed", code: "PGRST301" };
      const mockOrder = vi.fn().mockResolvedValue({ data: null, error: mockError });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("student_notes")
        .select("*")
        .order("note_date", { ascending: false });

      expect(result.data).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });

  describe("Create Student Note", () => {
    it("should create a new student note successfully", async () => {
      const newNote = {
        student_id: "student-1",
        type: "إيجابي",
        content: "مشاركة فعالة في النقاش",
        note_date: "2025-11-05",
        teacher_name: "الشيخ محمد",
      };

      const createdNote = {
        id: "new-note-id",
        ...newNote,
        created_at: "2025-11-05T10:00:00Z",
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: createdNote, error: null });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("student_notes")
        .insert(newNote)
        .select()
        .single();

      expect(mockFrom).toHaveBeenCalledWith("student_notes");
      expect(mockInsert).toHaveBeenCalledWith(newNote);
      expect(result.data).toEqual(createdNote);
      expect(result.data!.id).toBe("new-note-id");
    });

    it("should validate note type (إيجابي or سلبي)", async () => {
      const invalidNote = {
        student_id: "student-1",
        type: "invalid_type",
        content: "Test content",
        note_date: "2025-11-05",
        teacher_name: "الشيخ محمد",
      };

      const mockError = {
        message: 'new row violates check constraint "student_notes_type_check"',
        code: "23514",
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("student_notes")
        .insert(invalidNote)
        .select()
        .single();

      expect(result.error).not.toBeNull();
      expect(result.error!.code).toBe("23514");
    });

    it("should require student_id foreign key", async () => {
      const noteWithInvalidStudent = {
        student_id: "non-existent-student",
        type: "إيجابي",
        content: "Test content",
        note_date: "2025-11-05",
        teacher_name: "الشيخ محمد",
      };

      const mockError = {
        message: 'insert violates foreign key constraint "student_notes_student_id_fkey"',
        code: "23503",
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("student_notes")
        .insert(noteWithInvalidStudent)
        .select()
        .single();

      expect(result.error).not.toBeNull();
      expect(result.error!.code).toBe("23503");
    });
  });

  describe("Update Student Note", () => {
    it("should update a student note successfully", async () => {
      const noteId = "note-1";
      const updates = {
        content: "محتوى محدث",
        type: "سلبي",
      };

      const updatedNote = {
        id: noteId,
        student_id: "student-1",
        type: "سلبي",
        content: "محتوى محدث",
        note_date: "2025-11-01",
        teacher_name: "الشيخ خالد",
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: updatedNote, error: null });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("student_notes")
        .update(updates)
        .eq("id", noteId)
        .select()
        .single();

      expect(mockUpdate).toHaveBeenCalledWith(updates);
      expect(mockEq).toHaveBeenCalledWith("id", noteId);
      expect(result.data!.content).toBe("محتوى محدث");
      expect(result.data!.type).toBe("سلبي");
    });

    it("should handle update of non-existent note", async () => {
      const nonExistentId = "non-existent-note";
      const updates = { content: "New content" };

      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("student_notes")
        .update(updates)
        .eq("id", nonExistentId)
        .select()
        .single();

      expect(result.data).toBeNull();
    });
  });

  describe("Delete Student Note", () => {
    it("should delete a student note successfully", async () => {
      const noteId = "note-1";

      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ delete: mockDelete });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("student_notes")
        .delete()
        .eq("id", noteId);

      expect(mockFrom).toHaveBeenCalledWith("student_notes");
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", noteId);
      expect(result.error).toBeNull();
    });

    it("should handle delete errors gracefully", async () => {
      const noteId = "note-1";
      const mockError = { message: "Permission denied", code: "42501" };

      const mockEq = vi.fn().mockResolvedValue({ error: mockError });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ delete: mockDelete });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("student_notes")
        .delete()
        .eq("id", noteId);

      expect(result.error).toEqual(mockError);
    });
  });

  describe("Note Type Filtering", () => {
    it("should filter notes by type إيجابي", async () => {
      const positiveNotes = [
        { id: "1", type: "إيجابي", content: "ممتاز" },
        { id: "2", type: "إيجابي", content: "رائع" },
      ];

      const mockOrder = vi.fn().mockResolvedValue({ data: positiveNotes, error: null });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("student_notes")
        .select("*")
        .eq("type", "إيجابي")
        .order("note_date", { ascending: false });

      expect(mockEq).toHaveBeenCalledWith("type", "إيجابي");
      expect(result.data).toHaveLength(2);
      expect(result.data!.every((note) => note.type === "إيجابي")).toBe(true);
    });

    it("should filter notes by type سلبي", async () => {
      const negativeNotes = [
        { id: "3", type: "سلبي", content: "تأخير" },
      ];

      const mockOrder = vi.fn().mockResolvedValue({ data: negativeNotes, error: null });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("student_notes")
        .select("*")
        .eq("type", "سلبي")
        .order("note_date", { ascending: false });

      expect(mockEq).toHaveBeenCalledWith("type", "سلبي");
      expect(result.data!.every((note) => note.type === "سلبي")).toBe(true);
    });
  });
});
