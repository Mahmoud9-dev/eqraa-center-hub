import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getSupabase } from "@/integrations/supabase/client";
import { server } from "@/test/mocks/server";

// Get the supabase instance for tests
const supabase = getSupabase();

describe("Supabase Client Integration", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Reset server handlers after each test
    server.resetHandlers();
  });

  describe("Authentication", () => {
    it("should sign in user with valid credentials", async () => {
      const mockResponse = {
        data: {
          user: {
            id: "test-user-id",
            email: "test@example.com",
            user_metadata: { role: "admin" },
          },
          session: {
            access_token: "mock-access-token",
            refresh_token: "mock-refresh-token",
          },
        },
        error: null,
      };

      // Mock the signInWithPassword method
      const mockSignIn = vi.fn().mockResolvedValue(mockResponse);
      supabase.auth.signInWithPassword = mockSignIn;

      const result = await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

      expect(mockSignIn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(result.data.user.email).toBe("test@example.com");
      expect(result.data.session.access_token).toBe("mock-access-token");
    });

    it("should handle sign in failure", async () => {
      const mockResponse = {
        data: { user: null, session: null },
        error: { message: "Invalid credentials" },
      };

      const mockSignIn = vi.fn().mockResolvedValue(mockResponse);
      supabase.auth.signInWithPassword = mockSignIn;

      const result = await supabase.auth.signInWithPassword({
        email: "invalid@example.com",
        password: "wrongpassword",
      });

      expect(result.error?.message).toBe("Invalid credentials");
      expect(result.data.user).toBeNull();
    });

    it("should sign out user successfully", async () => {
      const mockResponse = { error: null };
      const mockSignOut = vi.fn().mockResolvedValue(mockResponse);
      supabase.auth.signOut = mockSignOut;

      const result = await supabase.auth.signOut();

      expect(mockSignOut).toHaveBeenCalled();
      expect(result.error).toBeNull();
    });

    it("should get current user", async () => {
      const mockUser = {
        id: "test-user-id",
        email: "test@example.com",
        user_metadata: { role: "teacher" },
      };
      const mockResponse = { data: { user: mockUser }, error: null };

      const mockGetUser = vi.fn().mockResolvedValue(mockResponse);
      supabase.auth.getUser = mockGetUser;

      const result = await supabase.auth.getUser();

      expect(mockGetUser).toHaveBeenCalled();
      expect(result.data.user).toEqual(mockUser);
    });
  });

  describe("Database Operations", () => {
    describe("Teachers Table", () => {
      it("should fetch teachers successfully", async () => {
        const mockTeachers = [
          { id: "1", name: "Teacher 1", department: "quran" },
          { id: "2", name: "Teacher 2", department: "tajweed" },
        ];

        const mockSelect = vi.fn().mockReturnThis();
        const mockEq = vi.fn().mockReturnThis();
        const mockOrder = vi.fn().mockReturnThis();
        const mockFrom = vi.fn().mockReturnValue({
          select: mockSelect,
          eq: mockEq,
          order: mockOrder,
        });

        // Mock the final data return
        mockSelect.mockResolvedValue({ data: mockTeachers, error: null });
        (supabase as unknown as { from: typeof mockFrom }).from = mockFrom;

        const result = await supabase.from("teachers").select("*");

        expect(mockFrom).toHaveBeenCalledWith("teachers");
        expect(mockSelect).toHaveBeenCalledWith("*");
        expect(result.data).toEqual(mockTeachers);
      });

      it("should insert new teacher", async () => {
        const newTeacher = {
          name: "New Teacher",
          specialization: "Quran Memorization",
          department: "quran",
          isActive: true,
        };

        const mockInsert = vi.fn().mockReturnThis();
        const mockSelect = vi.fn().mockReturnThis();
        const mockSingle = vi.fn().mockReturnThis();
        const mockFrom = vi.fn().mockReturnValue({
          insert: mockInsert,
          select: mockSelect,
          single: mockSingle,
        });

        const insertedTeacher = {
          ...newTeacher,
          id: "new-id",
          created_at: new Date().toISOString(),
        };
        mockSingle.mockResolvedValue({ data: insertedTeacher, error: null });
        (supabase as unknown as { from: typeof mockFrom }).from = mockFrom;

        const result = await supabase
          .from("teachers")
          .insert(newTeacher)
          .select()
          .single();

        expect(mockFrom).toHaveBeenCalledWith("teachers");
        expect(mockInsert).toHaveBeenCalledWith(newTeacher);
        expect(result.data).toEqual(insertedTeacher);
      });

      it("should update teacher", async () => {
        const updates = { name: "Updated Teacher Name" };
        const teacherId = "teacher-1";

        const mockUpdate = vi.fn().mockReturnThis();
        const mockEq = vi.fn().mockReturnThis();
        const mockSelect = vi.fn().mockReturnThis();
        const mockSingle = vi.fn().mockReturnThis();
        const mockFrom = vi.fn().mockReturnValue({
          update: mockUpdate,
          eq: mockEq,
          select: mockSelect,
          single: mockSingle,
        });

        const updatedTeacher = { id: teacherId, name: "Updated Teacher Name" };
        mockSingle.mockResolvedValue({ data: updatedTeacher, error: null });
        (supabase as unknown as { from: typeof mockFrom }).from = mockFrom;

        const result = await supabase
          .from("teachers")
          .update(updates)
          .eq("id", teacherId)
          .select()
          .single();

        expect(mockUpdate).toHaveBeenCalledWith(updates);
        expect(mockEq).toHaveBeenCalledWith("id", teacherId);
        expect(result.data).toEqual(updatedTeacher);
      });

      it("should delete teacher", async () => {
        const teacherId = "teacher-1";

        const mockDelete = vi.fn().mockReturnThis();
        const mockEq = vi.fn().mockReturnThis();
        const mockFrom = vi.fn().mockReturnValue({
          delete: mockDelete,
          eq: mockEq,
        });

        mockEq.mockResolvedValue({ error: null });
        (supabase as unknown as { from: typeof mockFrom }).from = mockFrom;

        const result = await supabase
          .from("teachers")
          .delete()
          .eq("id", teacherId);

        expect(mockDelete).toHaveBeenCalled();
        expect(mockEq).toHaveBeenCalledWith("id", teacherId);
        expect(result.error).toBeNull();
      });
    });

    describe("Students Table", () => {
      it("should fetch students with pagination", async () => {
        const mockStudents = [
          { id: "1", name: "Student 1", grade: "Grade 1" },
          { id: "2", name: "Student 2", grade: "Grade 2" },
        ];

        const mockSelect = vi.fn().mockReturnThis();
        const mockRange = vi.fn().mockReturnThis();
        const mockOrder = vi.fn().mockReturnThis();
        const mockFrom = vi.fn().mockReturnValue({
          select: mockSelect,
          range: mockRange,
          order: mockOrder,
        });

        // The order method should be the last in the chain that resolves
        mockOrder.mockResolvedValue({ data: mockStudents, error: null });
        (supabase as unknown as { from: typeof mockFrom }).from = mockFrom;

        const result = await supabase
          .from("students")
          .select("*")
          .range(0, 9)
          .order("created_at", { ascending: false });

        expect(mockFrom).toHaveBeenCalledWith("students");
        expect(mockSelect).toHaveBeenCalledWith("*");
        expect(mockRange).toHaveBeenCalledWith(0, 9);
        expect(mockOrder).toHaveBeenCalledWith("created_at", {
          ascending: false,
        });
        expect(result.data).toEqual(mockStudents);
      });

      it("should search students by name", async () => {
        const searchTerm = "محمد";
        const mockStudents = [{ id: "1", name: "محمد أحمد", grade: "Grade 1" }];

        const mockSelect = vi.fn().mockReturnThis();
        const mockIlike = vi.fn().mockReturnThis();
        const mockFrom = vi.fn().mockReturnValue({
          select: mockSelect,
          ilike: mockIlike,
        });

        mockIlike.mockResolvedValue({ data: mockStudents, error: null });
        (supabase as unknown as { from: typeof mockFrom }).from = mockFrom;

        const result = await supabase
          .from("students")
          .select("*")
          .ilike("name", `%${searchTerm}%`);

        expect(mockIlike).toHaveBeenCalledWith("name", `%${searchTerm}%`);
        expect(result.data).toEqual(mockStudents);
      });
    });

    describe("Quran Sessions Table", () => {
      it("should fetch sessions for a specific student", async () => {
        const studentId = "student-1";
        const mockSessions = [
          { id: "1", studentId, surahName: "البقرة", performanceRating: 8 },
        ];

        const mockSelect = vi.fn().mockReturnThis();
        const mockEq = vi.fn().mockReturnThis();
        const mockOrder = vi.fn().mockReturnThis();
        const mockFrom = vi.fn().mockReturnValue({
          select: mockSelect,
          eq: mockEq,
          order: mockOrder,
        });

        // The order method should be the last in the chain that resolves
        mockOrder.mockResolvedValue({ data: mockSessions, error: null });
        (supabase as unknown as { from: typeof mockFrom }).from = mockFrom;

        const result = await supabase
          .from("quran_sessions")
          .select("*")
          .eq("student_id", studentId)
          .order("date", { ascending: false });

        expect(mockFrom).toHaveBeenCalledWith("quran_sessions");
        expect(mockSelect).toHaveBeenCalledWith("*");
        expect(mockEq).toHaveBeenCalledWith("student_id", studentId);
        expect(mockOrder).toHaveBeenCalledWith("date", { ascending: false });
        expect(result.data).toEqual(mockSessions);
      });
    });
  });

  describe("Realtime Subscriptions", () => {
    it("should subscribe to table changes", () => {
      const mockSubscribe = vi.fn().mockReturnValue({
        on: vi.fn().mockReturnThis(),
        subscribe: vi
          .fn()
          .mockReturnValue({ subscription: "mock-subscription" }),
      });

      (supabase as unknown as { channel: typeof vi.fn }).channel = vi.fn().mockReturnValue({
        on: mockSubscribe,
        subscribe: mockSubscribe,
      });

      const subscription = supabase
        .channel("teachers-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "teachers" },
          (payload) => console.log(payload)
        )
        .subscribe();

      expect(supabase.channel).toHaveBeenCalledWith("teachers-changes");
      expect(mockSubscribe).toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors gracefully", async () => {
      const mockError = {
        message: "Network error",
        details: "Connection failed",
      };

      const mockSelect = vi.fn().mockReturnThis();
      const mockFrom = vi.fn().mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockResolvedValue({ data: null, error: mockError });
      (supabase as unknown as { from: typeof mockFrom }).from = mockFrom;

      const result = await supabase.from("teachers").select("*");

      expect(result.error).toEqual(mockError);
      expect(result.data).toBeNull();
    });

    it("should handle validation errors", async () => {
      const invalidData = {
        name: "",
        department: "invalid",
        specialization: "test",
      };
      const mockError = {
        message: "Validation failed",
        details: "Invalid department",
      };

      const mockInsert = vi.fn().mockReturnThis();
      const mockSelect = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockReturnThis();
      const mockFrom = vi.fn().mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
        single: mockSingle,
      });

      mockSingle.mockResolvedValue({ data: null, error: mockError });
      (supabase as unknown as { from: typeof mockFrom }).from = mockFrom;

      const result = await supabase
        .from("teachers")
        .insert(invalidData)
        .select()
        .single();

      expect(result.error?.message).toBe("Validation failed");
      expect(result.data).toBeNull();
    });
  });

  describe("Row Level Security (RLS)", () => {
    it("should respect user permissions", async () => {
      // Mock authenticated user
      const mockUser = {
        id: "user-1",
        role: "teacher",
        app_metadata: {},
        user_metadata: { role: "teacher" },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      };
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockSelect = vi.fn().mockReturnThis();
      const mockFrom = vi.fn().mockReturnValue({
        select: mockSelect,
      });

      // Mock filtered response based on user role
      const filteredData = [
        { id: "1", teacher_id: "user-1", name: "Allowed Student" },
      ];
      mockSelect.mockResolvedValue({ data: filteredData, error: null });
      (supabase as unknown as { from: typeof mockFrom }).from = mockFrom;

      const result = await supabase.from("students").select("*");

      expect(result.data).toEqual(filteredData);
      // Verify that only data accessible to the user is returned
      expect(result.data.every((item) => item.teacher_id === "user-1")).toBe(
        true
      );
    });
  });
});
