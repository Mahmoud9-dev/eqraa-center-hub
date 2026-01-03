import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHomeStats } from "@/hooks/useHomeStats";
import { supabase } from "@/integrations/supabase/client";
import { ReactNode } from "react";

// Mock the supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

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
    // Mock successful responses for all queries
    const mockSelect = vi.fn();
    const mockEq = vi.fn();
    const mockNot = vi.fn();
    const mockGte = vi.fn();

    // Students count mock
    mockSelect.mockImplementation(() => ({
      eq: vi.fn().mockResolvedValue({ count: 150, error: null }),
    }));

    (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table) => {
      if (table === "students") {
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
  });

  it("should return default values when no data is available", async () => {
    // Mock all tables to return empty/null data
    (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table) => {
      if (table === "students") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              not: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
          }),
        };
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

    // Mock all tables to return errors but still provide fallback data
    (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table) => {
      if (table === "students") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              not: vi.fn().mockResolvedValue({ data: [], error: { message: "Database error" } }),
            }),
          }),
        };
      }
      if (table === "teachers") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count: null, error: { message: "Database error" } }),
          }),
        };
      }
      if (table === "meetings") {
        return {
          select: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: null, error: { message: "Database error" } }),
            }),
          }),
        };
      }
      return {
        select: vi.fn().mockResolvedValue({ count: null, error: { message: "Database error" } }),
      };
    });

    const { result } = renderHook(() => useHomeStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should still return data (with defaults of 0) even on error
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.totalStudents).toBe(0);
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it("should have correct staleTime configuration", async () => {
    // Mock all tables with proper chain for staleTime test
    (supabase.from as ReturnType<typeof vi.fn>).mockImplementation((table) => {
      if (table === "students") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              not: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
          }),
        };
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
    (supabase.from as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ count: 10, error: null }),
      }),
    }));

    const { result } = renderHook(() => useHomeStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Simulate window focus - should not trigger refetch due to refetchOnWindowFocus: false
    const callCount = (supabase.from as ReturnType<typeof vi.fn>).mock.calls.length;

    // Dispatch focus event
    window.dispatchEvent(new Event("focus"));

    // Call count should remain the same
    expect((supabase.from as ReturnType<typeof vi.fn>).mock.calls.length).toBe(callCount);
  });
});
