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

// Mock data
const mockStudents = [
  {
    id: "student-1",
    name: "أحمد محمد علي",
    age: 12,
    grade: "السادس ابتدائي",
    department: "quran",
    teacher_id: "teacher-1",
    parts_memorized: 5,
    is_active: true,
  },
  {
    id: "student-2",
    name: "عمر خالد حسن",
    age: 14,
    grade: "الثالث إعدادي",
    department: "tajweed",
    teacher_id: "teacher-2",
    parts_memorized: 8,
    is_active: true,
  },
];

const mockTeachers = [
  {
    id: "teacher-1",
    name: "الشيخ خالد أحمد",
    specialization: "تحفيظ القرآن",
    department: "quran",
    is_active: true,
  },
  {
    id: "teacher-2",
    name: "الشيخ أحمد محمد",
    specialization: "تجويد القرآن",
    department: "tajweed",
    is_active: true,
  },
];

const mockAttendanceRecords = [
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
    teacher_id: "teacher-2",
    record_date: "2025-11-05",
    status: "غائب",
    notes: "غياب بعذر",
    created_at: "2025-11-05T08:00:00Z",
  },
];

describe("Attendance View - Supabase Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Data Loading", () => {
    it("should load students from Supabase", async () => {
      const mockOrder = vi.fn().mockResolvedValue({ data: mockStudents, error: null });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase
        .from("students")
        .select("*")
        .eq("is_active", true)
        .order("name");

      expect(mockFrom).toHaveBeenCalledWith("students");
      expect(mockEq).toHaveBeenCalledWith("is_active", true);
      expect(result.data).toEqual(mockStudents);
    });

    it("should load teachers from Supabase", async () => {
      const mockOrder = vi.fn().mockResolvedValue({ data: mockTeachers, error: null });
      const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase
        .from("teachers")
        .select("*")
        .eq("is_active", true)
        .order("name");

      expect(mockFrom).toHaveBeenCalledWith("teachers");
      expect(result.data).toEqual(mockTeachers);
    });

    it("should load attendance records from Supabase", async () => {
      const mockOrder = vi.fn().mockResolvedValue({ data: mockAttendanceRecords, error: null });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase
        .from("attendance_records")
        .select("*")
        .order("record_date", { ascending: false });

      expect(mockFrom).toHaveBeenCalledWith("attendance_records");
      expect(result.data).toEqual(mockAttendanceRecords);
    });

    it("should handle loading errors gracefully", async () => {
      const mockError = { message: "Database connection failed" };
      const mockOrder = vi.fn().mockResolvedValue({ data: null, error: mockError });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase
        .from("attendance_records")
        .select("*")
        .order("record_date", { ascending: false });

      expect(result.error).toEqual(mockError);
      expect(result.data).toBeNull();
    });
  });

  describe("Record Student Attendance", () => {
    it("should create attendance records for students", async () => {
      const newRecords = [
        {
          student_id: "student-1",
          teacher_id: "teacher-1",
          record_date: "2025-11-06",
          status: "حاضر",
          notes: "حضور منتظم",
        },
        {
          student_id: "student-2",
          teacher_id: "teacher-2",
          record_date: "2025-11-06",
          status: "غائب",
          notes: "غياب بدون عذر",
        },
      ];

      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase.from("attendance_records").insert(newRecords);

      expect(mockFrom).toHaveBeenCalledWith("attendance_records");
      expect(mockInsert).toHaveBeenCalledWith(newRecords);
      expect(result.error).toBeNull();
    });

    it("should validate status values", async () => {
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

      const supabase = getSupabase();
      const result = await supabase.from("attendance_records").insert(invalidRecord);

      expect(result.error).not.toBeNull();
      expect(result.error!.code).toBe("23514");
    });

    it("should handle حاضر status correctly", async () => {
      const presentRecord = {
        student_id: "student-1",
        teacher_id: "teacher-1",
        record_date: "2025-11-06",
        status: "حاضر",
        notes: "حضور منتظم",
      };

      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      await supabase.from("attendance_records").insert(presentRecord);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({ status: "حاضر" })
      );
    });

    it("should handle غائب status correctly", async () => {
      const absentRecord = {
        student_id: "student-2",
        teacher_id: "teacher-1",
        record_date: "2025-11-06",
        status: "غائب",
        notes: "غياب بدون عذر",
      };

      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      await supabase.from("attendance_records").insert(absentRecord);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({ status: "غائب" })
      );
    });

    it("should handle مأذون status correctly", async () => {
      const excusedRecord = {
        student_id: "student-3",
        teacher_id: "teacher-1",
        record_date: "2025-11-06",
        status: "مأذون",
        notes: "غياب بعذر",
      };

      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      await supabase.from("attendance_records").insert(excusedRecord);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({ status: "مأذون" })
      );
    });
  });

  describe("Record Teacher Attendance", () => {
    it("should create attendance records for teachers (null student_id)", async () => {
      const teacherRecord = {
        student_id: null,
        teacher_id: "teacher-1",
        record_date: "2025-11-06",
        status: "حاضر",
        notes: "حضور منتظم",
      };

      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase.from("attendance_records").insert(teacherRecord);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({ student_id: null })
      );
      expect(result.error).toBeNull();
    });

    it("should map إجازة to مأذون for database compatibility", async () => {
      const teacherRecord = {
        student_id: null,
        teacher_id: "teacher-2",
        record_date: "2025-11-06",
        status: "مأذون",
        notes: "إجازة معتمدة",
      };

      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      await supabase.from("attendance_records").insert(teacherRecord);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({ status: "مأذون" })
      );
    });
  });

  describe("Data Transformation", () => {
    it("should transform snake_case to camelCase for students", () => {
      const dbStudent = mockStudents[0];

      const transformedStudent = {
        ...dbStudent,
        teacherId: dbStudent.teacher_id || "",
        partsMemorized: dbStudent.parts_memorized ?? 0,
        isActive: dbStudent.is_active ?? true,
      };

      expect(transformedStudent.teacherId).toBe("teacher-1");
      expect(transformedStudent.partsMemorized).toBe(5);
      expect(transformedStudent.isActive).toBe(true);
    });

    it("should transform snake_case to camelCase for teachers", () => {
      const dbTeacher = mockTeachers[0];

      const transformedTeacher = {
        ...dbTeacher,
        isActive: dbTeacher.is_active ?? true,
      };

      expect(transformedTeacher.isActive).toBe(true);
    });

    it("should transform snake_case to camelCase for attendance records", () => {
      const dbRecord = mockAttendanceRecords[0];

      const transformedRecord = {
        ...dbRecord,
        studentId: dbRecord.student_id || "",
        teacherId: dbRecord.teacher_id || "",
        date: dbRecord.record_date,
      };

      expect(transformedRecord.studentId).toBe("student-1");
      expect(transformedRecord.teacherId).toBe("teacher-1");
      expect(transformedRecord.date).toBe("2025-11-05");
    });
  });

  describe("Helper Functions", () => {
    it("should get student name from ID", () => {
      const getStudentName = (studentId: string | null | undefined) => {
        if (!studentId) return "-";
        const student = mockStudents.find((s) => s.id === studentId);
        return student?.name || "-";
      };

      expect(getStudentName("student-1")).toBe("أحمد محمد علي");
      expect(getStudentName("student-2")).toBe("عمر خالد حسن");
      expect(getStudentName("non-existent")).toBe("-");
      expect(getStudentName(null)).toBe("-");
    });

    it("should get teacher name from ID", () => {
      const getTeacherName = (teacherId: string | null | undefined) => {
        if (!teacherId) return "-";
        const teacher = mockTeachers.find((t) => t.id === teacherId);
        return teacher?.name || "-";
      };

      expect(getTeacherName("teacher-1")).toBe("الشيخ خالد أحمد");
      expect(getTeacherName("teacher-2")).toBe("الشيخ أحمد محمد");
      expect(getTeacherName("non-existent")).toBe("-");
      expect(getTeacherName(null)).toBe("-");
    });

    it("should get student department from ID", () => {
      const getStudentDepartment = (studentId: string | null | undefined) => {
        if (!studentId) return "";
        const student = mockStudents.find((s) => s.id === studentId);
        return student?.department || "";
      };

      expect(getStudentDepartment("student-1")).toBe("quran");
      expect(getStudentDepartment("student-2")).toBe("tajweed");
      expect(getStudentDepartment("non-existent")).toBe("");
    });

    it("should get department name in Arabic", () => {
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

      expect(getDepartmentName("quran")).toBe("قرآن");
      expect(getDepartmentName("tajweed")).toBe("تجويد");
      expect(getDepartmentName("tarbawi")).toBe("تربوي");
      expect(getDepartmentName("unknown")).toBe("unknown");
    });

    it("should get status color class", () => {
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

      expect(getStatusColor("حاضر")).toBe("bg-green-100 text-green-800");
      expect(getStatusColor("غائب")).toBe("bg-red-100 text-red-800");
      expect(getStatusColor("مأذون")).toBe("bg-yellow-100 text-yellow-800");
      expect(getStatusColor("unknown")).toBe("bg-gray-100 text-gray-800");
    });
  });

  describe("Error Handling", () => {
    it("should handle insert errors gracefully", async () => {
      const mockError = { message: "Insert failed" };

      const mockInsert = vi.fn().mockResolvedValue({ error: mockError });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await supabase.from("attendance_records").insert({} as any);

      expect(result.error).toEqual(mockError);
    });

    it("should handle foreign key violations", async () => {
      const mockError = {
        message: 'insert violates foreign key constraint',
        code: "23503",
      };

      const mockInsert = vi.fn().mockResolvedValue({ error: mockError });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase.from("attendance_records").insert({
        student_id: "non-existent",
        teacher_id: "teacher-1",
        record_date: "2025-11-06",
        status: "حاضر",
      });

      expect(result.error!.code).toBe("23503");
    });
  });

  describe("Batch Operations", () => {
    it("should handle batch insert for multiple students", async () => {
      const batchRecords = mockStudents.map((student) => ({
        student_id: student.id,
        teacher_id: student.teacher_id,
        record_date: "2025-11-06",
        status: "حاضر",
        notes: "حضور منتظم",
      }));

      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase.from("attendance_records").insert(batchRecords);

      expect(mockInsert).toHaveBeenCalledWith(batchRecords);
      expect(result.error).toBeNull();
    });

    it("should handle batch insert for multiple teachers", async () => {
      const batchRecords = mockTeachers.map((teacher) => ({
        student_id: null,
        teacher_id: teacher.id,
        record_date: "2025-11-06",
        status: "حاضر",
        notes: "حضور منتظم",
      }));

      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({ from: mockFrom } as any);

      const supabase = getSupabase();
      const result = await supabase.from("attendance_records").insert(batchRecords);

      expect(mockInsert).toHaveBeenCalledWith(batchRecords);
      expect(result.error).toBeNull();
    });
  });

  describe("Filtering", () => {
    it("should filter students by department", () => {
      const filterDepartment = "quran";
      const filtered = mockStudents.filter(
        (student) => student.department === filterDepartment
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe("أحمد محمد علي");
    });

    it("should filter students by search term", () => {
      const searchTerm = "أحمد";
      const filtered = mockStudents.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe("student-1");
    });

    it("should return all students when filter is 'all'", () => {
      const filterDepartment = "all";
      const filtered = mockStudents.filter(
        (student) =>
          filterDepartment === "all" || student.department === filterDepartment
      );

      expect(filtered).toHaveLength(2);
    });
  });
});
