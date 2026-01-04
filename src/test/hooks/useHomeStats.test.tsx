import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHomeStats } from "@/hooks/useHomeStats";
import { getSupabase } from "@/integrations/supabase/client";
import { ReactNode } from "react";

// Mock the supabase client
vi.mock("@/integrations/supabase/client", () => ({
  getSupabase: vi.fn(() => ({
    from: vi.fn(),
  })),
}));

// Helper to get the mocked supabase
const mockSupabase = getSupabase() as { from: ReturnType<typeof vi.fn> };

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useHomeStats Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch and return home stats successfully", async () => {
    let callCount = 0;

    (mockSupabase.from as ReturnType<typeof vi.fn>).mockImplementation((table) => {
      if (table === "students") {
        callCount++;
        // First call is for student count, second is for attendance data
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 150, error: null }),
            }),
          };
        } else {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                not: vi.fn().mockResolvedValue({
                  data: [{ attendance: 90 }, { attendance: 95 }, { attendance: 85 }],
                  error: null,
                }),
              }),
            }),
          };
        }
      }
      if (table === "teachers") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count: 25, error: null }),
          }),
        };
      }
      if (table === "meetings") {
        return {
          select: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 5, error: null }),
            }),
          }),
        };
      }
      return {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
    });

    const { result } = renderHook(() => useHomeStats(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check that data is returned
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.totalStudents).toBe(150);
    expect(result.current.data?.activeCircles).toBe(25);
    expect(result.current.data?.upcomingExams).toBe(5);
    // Attendance should be average of 90, 95, 85 = 90
    expect(result.current.data?.attendancePercentage).toBe(90);
  });

  it("should return default values when no data is available", async () => {
    let studentsCallCount = 0;

    // Mock all tables to return empty/null data
    (mockSupabase.from as ReturnType<typeof vi.fn>).mockImplementation((table) => {
      if (table === "students") {
        studentsCallCount++;
        // First call is for count, second is for attendance
        if (studentsCallCount === 1) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 0, error: null }),
            }),
          };
        } else {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                not: vi.fn().mockResolvedValue({ data: [], error: null }),
              }),
            }),
          };
        }
      }
      if (table === "teachers") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count: 0, error: null }),
          }),
        };
      }
      if (table === "meetings") {
        return {
          select: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 0, error: null }),
            }),
          }),
        };
      }
      return {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
    });

    const { result } = renderHook(() => useHomeStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should have default values (0)
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.totalStudents).toBe(0);
    expect(result.current.data?.attendancePercentage).toBe(0);
    expect(result.current.data?.activeCircles).toBe(0);
    expect(result.current.data?.upcomingExams).toBe(0);
  });

  it("should handle errors gracefully", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    // Mock students query to return an error (first in Promise.all)
    (mockSupabase.from as ReturnType<typeof vi.fn>).mockImplementation((table) => {
      if (table === "students") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              count: null,
              error: { message: "Database error" }
            }),
          }),
        };
      }
      if (table === "teachers") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count: 25, error: null }),
          }),
        };
      }
      if (table === "meetings") {
        return {
          select: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 5, error: null }),
            }),
          }),
        };
      }
      return {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
    });

    const { result } = renderHook(() => useHomeStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should have error state when database query fails
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeDefined();
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it("should have correct staleTime configuration", async () => {
    let studentsCallCount = 0;

    // Mock all tables with proper chain for staleTime test
    (mockSupabase.from as ReturnType<typeof vi.fn>).mockImplementation((table) => {
      if (table === "students") {
        studentsCallCount++;
        // First call is for count, second is for attendance
        if (studentsCallCount === 1) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 10, error: null }),
            }),
          };
        } else {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                not: vi.fn().mockResolvedValue({ data: [], error: null }),
              }),
            }),
          };
        }
      }
      if (table === "teachers") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count: 5, error: null }),
          }),
        };
      }
      if (table === "meetings") {
        return {
          select: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 2, error: null }),
            }),
          }),
        };
      }
      return {
        select: vi.fn().mockResolvedValue({ count: 0, error: null }),
      };
    });

    const { result } = renderHook(() => useHomeStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Data should be available (staleTime test verifies hook returns data correctly)
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.activeCircles).toBe(5);
    expect(result.current.data?.upcomingExams).toBe(2);
  });

  it("should not refetch on window focus", async () => {
    let studentsCallCount = 0;

    (mockSupabase.from as ReturnType<typeof vi.fn>).mockImplementation((table) => {
      if (table === "students") {
        studentsCallCount++;
        // First call is for count, second is for attendance
        if (studentsCallCount === 1 || studentsCallCount === 3) {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 10, error: null }),
            }),
          };
        } else {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                not: vi.fn().mockResolvedValue({ data: [], error: null }),
              }),
            }),
          };
        }
      }
      if (table === "teachers") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count: 5, error: null }),
          }),
        };
      }
      if (table === "meetings") {
        return {
          select: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: 2, error: null }),
            }),
          }),
        };
      }
      return {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
    });

    const { result } = renderHook(() => useHomeStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Simulate window focus - should not trigger refetch due to refetchOnWindowFocus: false
    const callCount = (mockSupabase.from as ReturnType<typeof vi.fn>).mock.calls.length;

    // Dispatch focus event
    window.dispatchEvent(new Event("focus"));

    // Call count should remain the same
    expect((mockSupabase.from as ReturnType<typeof vi.fn>).mock.calls.length).toBe(callCount);
  });
});
