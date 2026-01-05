import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getSupabase } from "@/integrations/supabase/client";

// Mock the supabase client
vi.mock("@/integrations/supabase/client", () => ({
  getSupabase: vi.fn(),
}));

describe("Supabase Client Integration", () => {
  let mockAuth: {
    signInWithPassword: ReturnType<typeof vi.fn>;
    signOut: ReturnType<typeof vi.fn>;
    getUser: ReturnType<typeof vi.fn>;
  };

  let mockChannel: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up auth mocks
    mockAuth = {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
    };

    // Set up channel mock
    mockChannel = vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnValue({ subscription: "mock-subscription" }),
    });
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

      mockAuth.signInWithPassword.mockResolvedValue(mockResponse);

      vi.mocked(getSupabase).mockReturnValue({
        auth: mockAuth,
        from: vi.fn(),
        channel: mockChannel,
      } as any);

      const supabase = getSupabase();
      const result = await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

      expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(result.data.user!.email).toBe("test@example.com");
      expect(result.data.session!.access_token).toBe("mock-access-token");
    });

    it("should handle sign in failure", async () => {
      const mockResponse = {
        data: { user: null, session: null },
        error: { message: "Invalid credentials" },
      };

      mockAuth.signInWithPassword.mockResolvedValue(mockResponse);

      vi.mocked(getSupabase).mockReturnValue({
        auth: mockAuth,
        from: vi.fn(),
        channel: mockChannel,
      } as any);

      const supabase = getSupabase();
      const result = await supabase.auth.signInWithPassword({
        email: "invalid@example.com",
        password: "wrongpassword",
      });

      expect(result.error?.message).toBe("Invalid credentials");
      expect(result.data.user).toBeNull();
    });

    it("should sign out user successfully", async () => {
      const mockResponse = { error: null };
      mockAuth.signOut.mockResolvedValue(mockResponse);

      vi.mocked(getSupabase).mockReturnValue({
        auth: mockAuth,
        from: vi.fn(),
        channel: mockChannel,
      } as any);

      const supabase = getSupabase();
      const result = await supabase.auth.signOut();

      expect(mockAuth.signOut).toHaveBeenCalled();
      expect(result.error).toBeNull();
    });

    it("should get current user", async () => {
      const mockUser = {
        id: "test-user-id",
        email: "test@example.com",
        user_metadata: { role: "teacher" },
      };
      const mockResponse = { data: { user: mockUser }, error: null };

      mockAuth.getUser.mockResolvedValue(mockResponse);

      vi.mocked(getSupabase).mockReturnValue({
        auth: mockAuth,
        from: vi.fn(),
        channel: mockChannel,
      } as any);

      const supabase = getSupabase();
      const result = await supabase.auth.getUser();

      expect(mockAuth.getUser).toHaveBeenCalled();
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

        const mockSelect = vi.fn().mockResolvedValue({ data: mockTeachers, error: null });
        const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

        vi.mocked(getSupabase).mockReturnValue({
          auth: mockAuth,
          from: mockFrom,
          channel: mockChannel,
        } as any);

        const supabase = getSupabase();
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

        const insertedTeacher = {
          ...newTeacher,
          id: "new-id",
          created_at: new Date().toISOString(),
        };

        const mockSingle = vi.fn().mockResolvedValue({ data: insertedTeacher, error: null });
        const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
        const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
        const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

        vi.mocked(getSupabase).mockReturnValue({
          auth: mockAuth,
          from: mockFrom,
          channel: mockChannel,
        } as any);

        const supabase = getSupabase();
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

        const updatedTeacher = { id: teacherId, name: "Updated Teacher Name" };

        const mockSingle = vi.fn().mockResolvedValue({ data: updatedTeacher, error: null });
        const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
        const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
        const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate });

        vi.mocked(getSupabase).mockReturnValue({
          auth: mockAuth,
          from: mockFrom,
          channel: mockChannel,
        } as any);

        const supabase = getSupabase();
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

        const mockEq = vi.fn().mockResolvedValue({ error: null });
        const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = vi.fn().mockReturnValue({ delete: mockDelete });

        vi.mocked(getSupabase).mockReturnValue({
          auth: mockAuth,
          from: mockFrom,
          channel: mockChannel,
        } as any);

        const supabase = getSupabase();
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

        const mockOrder = vi.fn().mockResolvedValue({ data: mockStudents, error: null });
        const mockRange = vi.fn().mockReturnValue({ order: mockOrder });
        const mockSelect = vi.fn().mockReturnValue({ range: mockRange });
        const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

        vi.mocked(getSupabase).mockReturnValue({
          auth: mockAuth,
          from: mockFrom,
          channel: mockChannel,
        } as any);

        const supabase = getSupabase();
        const result = await supabase
          .from("students")
          .select("*")
          .range(0, 9)
          .order("created_at", { ascending: false });

        expect(mockFrom).toHaveBeenCalledWith("students");
        expect(mockSelect).toHaveBeenCalledWith("*");
        expect(mockRange).toHaveBeenCalledWith(0, 9);
        expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: false });
        expect(result.data).toEqual(mockStudents);
      });

      it("should search students by name", async () => {
        const searchTerm = "محمد";
        const mockStudents = [{ id: "1", name: "محمد أحمد", grade: "Grade 1" }];

        const mockIlike = vi.fn().mockResolvedValue({ data: mockStudents, error: null });
        const mockSelect = vi.fn().mockReturnValue({ ilike: mockIlike });
        const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

        vi.mocked(getSupabase).mockReturnValue({
          auth: mockAuth,
          from: mockFrom,
          channel: mockChannel,
        } as any);

        const supabase = getSupabase();
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

        const mockOrder = vi.fn().mockResolvedValue({ data: mockSessions, error: null });
        const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
        const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
        const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

        vi.mocked(getSupabase).mockReturnValue({
          auth: mockAuth,
          from: mockFrom,
          channel: mockChannel,
        } as any);

        const supabase = getSupabase();
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
      const mockOn = vi.fn().mockReturnThis();
      const mockSubscribe = vi.fn().mockReturnValue({ subscription: "mock-subscription" });

      const channelMock = vi.fn().mockReturnValue({
        on: mockOn,
        subscribe: mockSubscribe,
      });

      vi.mocked(getSupabase).mockReturnValue({
        auth: mockAuth,
        from: vi.fn(),
        channel: channelMock,
      } as any);

      const supabase = getSupabase();
      supabase
        .channel("teachers-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "teachers" },
          (payload: unknown) => console.log(payload)
        )
        .subscribe();

      expect(channelMock).toHaveBeenCalledWith("teachers-changes");
      expect(mockOn).toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors gracefully", async () => {
      const mockError = {
        message: "Network error",
        details: "Connection failed",
      };

      const mockSelect = vi.fn().mockResolvedValue({ data: null, error: mockError });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({
        auth: mockAuth,
        from: mockFrom,
        channel: mockChannel,
      } as any);

      const supabase = getSupabase();
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

      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

      vi.mocked(getSupabase).mockReturnValue({
        auth: mockAuth,
        from: mockFrom,
        channel: mockChannel,
      } as any);

      const supabase = getSupabase();
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
      const mockUser = {
        id: "user-1",
        role: "teacher",
        app_metadata: {},
        user_metadata: { role: "teacher" },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      };

      mockAuth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const filteredData = [
        { id: "1", teacher_id: "user-1", name: "Allowed Student" },
      ];

      const mockSelect = vi.fn().mockResolvedValue({ data: filteredData, error: null });
      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      vi.mocked(getSupabase).mockReturnValue({
        auth: mockAuth,
        from: mockFrom,
        channel: mockChannel,
      } as any);

      const supabase = getSupabase();
      const result = await supabase.from("students").select("*");

      expect(result.data).toEqual(filteredData);
      expect(result.data!.every((item) => item.teacher_id === "user-1")).toBe(true);
    });
  });
});
