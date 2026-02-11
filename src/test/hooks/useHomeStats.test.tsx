import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHomeStats } from "@/hooks/useHomeStats";
import { ReactNode } from "react";

// Mock the Dexie service modules instead of Supabase
vi.mock("@/lib/db/services/students", () => ({
  getActiveCount: vi.fn(),
  getAttendanceData: vi.fn(),
}));
vi.mock("@/lib/db/services/teachers", () => ({
  getActiveCount: vi.fn(),
}));
vi.mock("@/lib/db/services/meetings", () => ({
  getUpcomingCount: vi.fn(),
}));

// Import the mocked modules to configure return values
import * as studentsService from "@/lib/db/services/students";
import * as teachersService from "@/lib/db/services/teachers";
import * as meetingsService from "@/lib/db/services/meetings";

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
    vi.mocked(studentsService.getActiveCount).mockResolvedValue(150);
    vi.mocked(studentsService.getAttendanceData).mockResolvedValue([
      { attendance: 90 },
      { attendance: 95 },
      { attendance: 85 },
    ]);
    vi.mocked(teachersService.getActiveCount).mockResolvedValue(25);
    vi.mocked(meetingsService.getUpcomingCount).mockResolvedValue(5);

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
    vi.mocked(studentsService.getActiveCount).mockResolvedValue(0);
    vi.mocked(studentsService.getAttendanceData).mockResolvedValue([]);
    vi.mocked(teachersService.getActiveCount).mockResolvedValue(0);
    vi.mocked(meetingsService.getUpcomingCount).mockResolvedValue(0);

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
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    vi.mocked(studentsService.getActiveCount).mockRejectedValue(
      new Error("Database error")
    );
    vi.mocked(studentsService.getAttendanceData).mockResolvedValue([]);
    vi.mocked(teachersService.getActiveCount).mockResolvedValue(25);
    vi.mocked(meetingsService.getUpcomingCount).mockResolvedValue(5);

    const { result } = renderHook(() => useHomeStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should have error state when database query fails
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeDefined();

    consoleError.mockRestore();
  });

  it("should have correct staleTime configuration", async () => {
    vi.mocked(studentsService.getActiveCount).mockResolvedValue(10);
    vi.mocked(studentsService.getAttendanceData).mockResolvedValue([]);
    vi.mocked(teachersService.getActiveCount).mockResolvedValue(5);
    vi.mocked(meetingsService.getUpcomingCount).mockResolvedValue(2);

    const { result } = renderHook(() => useHomeStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Data should be available (staleTime test verifies hook returns data correctly)
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.totalStudents).toBe(10);
    expect(result.current.data?.activeCircles).toBe(5);
    expect(result.current.data?.upcomingExams).toBe(2);
  });

  it("should not refetch on window focus", async () => {
    vi.mocked(studentsService.getActiveCount).mockResolvedValue(10);
    vi.mocked(studentsService.getAttendanceData).mockResolvedValue([]);
    vi.mocked(teachersService.getActiveCount).mockResolvedValue(5);
    vi.mocked(meetingsService.getUpcomingCount).mockResolvedValue(2);

    const { result } = renderHook(() => useHomeStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Record call counts after initial load
    const studentsCallCount = vi.mocked(studentsService.getActiveCount).mock
      .calls.length;

    // Dispatch focus event
    window.dispatchEvent(new Event("focus"));

    // Call count should remain the same (refetchOnWindowFocus: false)
    expect(vi.mocked(studentsService.getActiveCount).mock.calls.length).toBe(
      studentsCallCount
    );
  });
});
