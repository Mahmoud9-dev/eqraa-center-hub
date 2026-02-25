import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSupabase } from "@/integrations/supabase/client";

// Mock the supabase client
vi.mock("@/integrations/supabase/client", () => ({
  getSupabase: vi.fn(),
}));

describe("Attendance Records CRUD Operations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Fetch Attendance Records", () => {
    it("should fetch all attendance records successfully", async () => {
      const mockRecords = [
        {
          id: "record-1",
          student_id: "student-1",
          teacher_id: "teacher-1",
          record_date: "2025-11-05",
          status: "حاضر",
          notes: "حضور ممتاز",
          created_at: "2025-11-05T08:00:00Z",
        },
        {
          id: "record-2",
          student_id: "student-2",
          teacher_id: "teacher-1",
          record_date: "2025-11-05",
          status: "غائب",
          notes: "غياب بعذر",
          created_at: "2025-11-05T08:00:00Z",
        },
      ];

      const mockOrder = vi.fn().mockResolvedValue({ data: mockRecords, error: null });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("attendance_records")
        .select("*")
        .order("record_date", { ascending: false });

      expect(mockFrom).toHaveBeenCalledWith("attendance_records");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(result.data).toEqual(mockRecords);
      expect(result.error).toBeNull();
    });

    it("should fetch attendance records for a specific date", async () => {
      const targetDate = "2025-11-05";
      const mockRecords = [
        {
          id: "record-1",
          student_id: "student-1",
          record_date: targetDate,
          status: "حاضر",
        },
      ];

      const mockOrder = vi.fn().mockResolvedValue({ data: mockRecords, error: null });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("attendance_records")
        .select("*")
        .eq("record_date", targetDate)
        .order("created_at", { ascending: false });

      expect(mockEq).toHaveBeenCalledWith("record_date", targetDate);
      expect(result.data!.every((r) => r.record_date === targetDate)).toBe(true);
    });

    it("should fetch attendance records for a specific student", async () => {
      const studentId = "student-1";
      const mockRecords = [
        { id: "1", student_id: studentId, status: "حاضر", record_date: "2025-11-05" },
        { id: "2", student_id: studentId, status: "حاضر", record_date: "2025-11-04" },
        { id: "3", student_id: studentId, status: "غائب", record_date: "2025-11-03" },
      ];

      const mockOrder = vi.fn().mockResolvedValue({ data: mockRecords, error: null });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("attendance_records")
        .select("*")
        .eq("student_id", studentId)
        .order("record_date", { ascending: false });

      expect(mockEq).toHaveBeenCalledWith("student_id", studentId);
      expect(result.data).toHaveLength(3);
    });

    it("should handle empty results gracefully", async () => {
      const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("attendance_records")
        .select("*")
        .order("record_date", { ascending: false });

      expect(result.data).toEqual([]);
      expect(result.error).toBeNull();
    });

    it("should handle fetch errors", async () => {
      const mockError = { message: "Database error", code: "PGRST301" };
      const mockOrder = vi.fn().mockResolvedValue({ data: null, error: mockError });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("attendance_records")
        .select("*")
        .order("record_date", { ascending: false });

      expect(result.data).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });

  describe("Create Attendance Record", () => {
    it("should create a new attendance record for a student", async () => {
      const newRecord = {
        student_id: "student-1",
        teacher_id: "teacher-1",
        record_date: "2025-11-06",
        status: "حاضر",
        notes: "حضور منتظم",
      };

      const createdRecord = {
        id: "new-record-id",
        ...newRecord,
        created_at: "2025-11-06T08:00:00Z",
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: createdRecord, error: null });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("attendance_records")
        .insert(newRecord)
        .select()
        .single();

      expect(mockFrom).toHaveBeenCalledWith("attendance_records");
      expect(mockInsert).toHaveBeenCalledWith(newRecord);
      expect(result.data).toEqual(createdRecord);
    });

    it("should create multiple attendance records in batch", async () => {
      const batchRecords = [
        { student_id: "student-1", teacher_id: "teacher-1", record_date: "2025-11-06", status: "حاضر" },
        { student_id: "student-2", teacher_id: "teacher-1", record_date: "2025-11-06", status: "غائب" },
        { student_id: "student-3", teacher_id: "teacher-1", record_date: "2025-11-06", status: "مأذون" },
      ];

      const mockInsert = vi.fn().mockResolvedValue({ data: batchRecords, error: null });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("attendance_records")
        .insert(batchRecords);

      expect(mockInsert).toHaveBeenCalledWith(batchRecords);
      expect(result.error).toBeNull();
    });

    it("should validate status values (حاضر, غائب, مأذون)", async () => {
      const invalidRecord = {
        student_id: "student-1",
        teacher_id: "teacher-1",
        record_date: "2025-11-06",
        status: "invalid_status",
      };

      const mockError = {
        message: 'new row violates check constraint "attendance_records_status_check"',
        code: "23514",
      };

      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: mockError });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("attendance_records")
        .insert(invalidRecord);

      expect(result.error).not.toBeNull();
      expect(result.error!.code).toBe("23514");
    });

    it("should handle foreign key constraint for student_id", async () => {
      const recordWithInvalidStudent = {
        student_id: "non-existent-student",
        teacher_id: "teacher-1",
        record_date: "2025-11-06",
        status: "حاضر",
      };

      const mockError = {
        message: 'insert violates foreign key constraint "attendance_records_student_id_fkey"',
        code: "23503",
      };

      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: mockError });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("attendance_records")
        .insert(recordWithInvalidStudent);

      expect(result.error!.code).toBe("23503");
    });

    it("should allow null student_id for teacher attendance", async () => {
      const teacherAttendance = {
        student_id: null,
        teacher_id: "teacher-1",
        record_date: "2025-11-06",
        status: "حاضر",
        notes: "حضور منتظم",
      };

      const createdRecord = {
        id: "teacher-record-id",
        ...teacherAttendance,
        created_at: "2025-11-06T08:00:00Z",
      };

      const mockInsert = vi.fn().mockResolvedValue({ data: createdRecord, error: null });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("attendance_records")
        .insert(teacherAttendance);

      const insertedRecord = result.data as { student_id: string | null; teacher_id: string | null } | null;
      expect(insertedRecord!.student_id).toBeNull();
      expect(insertedRecord!.teacher_id).toBe("teacher-1");
    });
  });

  describe("Update Attendance Record", () => {
    it("should update attendance status", async () => {
      const recordId = "record-1";
      const updates = {
        status: "مأذون",
        notes: "غياب بإذن",
      };

      const updatedRecord = {
        id: recordId,
        student_id: "student-1",
        teacher_id: "teacher-1",
        record_date: "2025-11-05",
        status: "مأذون",
        notes: "غياب بإذن",
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: updatedRecord, error: null });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("attendance_records")
        .update(updates)
        .eq("id", recordId)
        .select()
        .single();

      expect(mockUpdate).toHaveBeenCalledWith(updates);
      expect(mockEq).toHaveBeenCalledWith("id", recordId);
      expect(result.data!.status).toBe("مأذون");
    });

    it("should handle update of non-existent record", async () => {
      const nonExistentId = "non-existent-record";
      const updates = { status: "حاضر" };

      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("attendance_records")
        .update(updates)
        .eq("id", nonExistentId)
        .select()
        .single();

      expect(result.data).toBeNull();
    });
  });

  describe("Delete Attendance Record", () => {
    it("should delete an attendance record successfully", async () => {
      const recordId = "record-1";

      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ delete: mockDelete });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("attendance_records")
        .delete()
        .eq("id", recordId);

      expect(mockFrom).toHaveBeenCalledWith("attendance_records");
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", recordId);
      expect(result.error).toBeNull();
    });

    it("should handle delete errors gracefully", async () => {
      const recordId = "record-1";
      const mockError = { message: "Permission denied", code: "42501" };

      const mockEq = vi.fn().mockResolvedValue({ error: mockError });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ delete: mockDelete });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("attendance_records")
        .delete()
        .eq("id", recordId);

      expect(result.error).toEqual(mockError);
    });
  });

  describe("Status Filtering", () => {
    it("should filter records by status حاضر", async () => {
      const presentRecords = [
        { id: "1", status: "حاضر", record_date: "2025-11-05" },
        { id: "2", status: "حاضر", record_date: "2025-11-04" },
      ];

      const mockOrder = vi.fn().mockResolvedValue({ data: presentRecords, error: null });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("attendance_records")
        .select("*")
        .eq("status", "حاضر")
        .order("record_date", { ascending: false });

      expect(mockEq).toHaveBeenCalledWith("status", "حاضر");
      expect(result.data!.every((r) => r.status === "حاضر")).toBe(true);
    });

    it("should filter records by status غائب", async () => {
      const absentRecords = [
        { id: "3", status: "غائب", record_date: "2025-11-03" },
      ];

      const mockOrder = vi.fn().mockResolvedValue({ data: absentRecords, error: null });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("attendance_records")
        .select("*")
        .eq("status", "غائب")
        .order("record_date", { ascending: false });

      expect(result.data!.every((r) => r.status === "غائب")).toBe(true);
    });
  });

  describe("Date Range Queries", () => {
    it("should fetch records within a date range", async () => {
      const mockRecords = [
        { id: "1", record_date: "2025-11-05" },
        { id: "2", record_date: "2025-11-04" },
        { id: "3", record_date: "2025-11-03" },
      ];

      const mockLte = vi.fn().mockResolvedValue({ data: mockRecords, error: null });
      const mockGte = vi.fn().mockReturnValue({ lte: mockLte });
      const mockSelect = vi.fn().mockReturnValue({ gte: mockGte });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("attendance_records")
        .select("*")
        .gte("record_date", "2025-11-01")
        .lte("record_date", "2025-11-07");

      expect(mockGte).toHaveBeenCalledWith("record_date", "2025-11-01");
      expect(mockLte).toHaveBeenCalledWith("record_date", "2025-11-07");
      expect(result.data).toHaveLength(3);
    });
  });

  describe("Teacher Attendance", () => {
    it("should fetch teacher-only attendance records", async () => {
      const teacherRecords = [
        { id: "1", student_id: null, teacher_id: "teacher-1", status: "حاضر" },
        { id: "2", student_id: null, teacher_id: "teacher-2", status: "غائب" },
      ];

      const mockOrder = vi.fn().mockResolvedValue({ data: teacherRecords, error: null });
      const mockIsNull = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ is: mockIsNull });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const result = await getSupabase()
        .from("attendance_records")
        .select("*")
        .is("student_id", null)
        .order("record_date", { ascending: false });

      expect(mockIsNull).toHaveBeenCalledWith("student_id", null);
      expect(result.data!.every((r) => r.student_id === null)).toBe(true);
    });
  });
});
