import { vi } from "vitest";

/**
 * Supabase Mock Utilities
 * Helper functions to reduce duplication in Supabase integration tests
 */

/**
 * Creates a complete Supabase query chain mock
 * @param finalResult - The final data to be returned by the query
 * @returns Object containing all mock functions
 */
export function createSupabaseMock<T>(finalResult: { data: T; error: null | Error }) {
  const mockSingle = vi.fn().mockResolvedValue(finalResult);
  const mockOrder = vi.fn().mockResolvedValue(finalResult);
  const mockRange = vi.fn().mockReturnValue({ order: mockOrder });
  const mockLte = vi.fn().mockReturnValue({ gte: vi.fn().mockReturnValue({ order: mockOrder }) });
  const mockGte = vi.fn().mockReturnValue({ order: mockOrder });
  const mockEq = vi.fn().mockReturnValue({
    order: mockOrder,
    single: mockSingle,
    gte: mockGte,
    lte: mockLte,
  });
  const mockIs = vi.fn().mockReturnValue({ order: mockOrder });
  const mockIlike = vi.fn().mockReturnValue({ order: mockOrder });
  const mockSelect = vi.fn().mockReturnValue({
    eq: mockEq,
    order: mockOrder,
    range: mockRange,
    single: mockSingle,
    is: mockIs,
    ilike: mockIlike,
    gte: mockGte,
    lte: mockLte,
  });
  const mockInsert = vi.fn().mockReturnValue({
    select: mockSelect,
    single: mockSingle,
  });
  const mockUpdate = vi.fn().mockReturnValue({
    eq: mockEq,
    single: mockSingle,
  });
  const mockDelete = vi.fn().mockReturnValue({
    eq: mockEq,
  });
  const mockFrom = vi.fn().mockReturnValue({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  });

  return {
    mockFrom,
    mockSelect,
    mockInsert,
    mockUpdate,
    mockDelete,
    mockEq,
    mockIs,
    mockIlike,
    mockOrder,
    mockSingle,
    mockRange,
    mockGte,
    mockLte,
  };
}

/**
 * Creates a simple query chain for basic SELECT operations
 */
export function createSelectMock<T>(data: T, error: null | Error = null) {
  const result = { data, error };
  const mockOrder = vi.fn().mockResolvedValue(result);
  const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
  const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

  return { mockFrom, mockSelect, mockOrder, result };
}

/**
 * Creates a query chain for SELECT with WHERE clause
 */
export function createSelectWithWhereMock<T>(data: T, error: null | Error = null) {
  const result = { data, error };
  const mockOrder = vi.fn().mockResolvedValue(result);
  const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
  const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
  const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

  return { mockFrom, mockSelect, mockEq, mockOrder, result };
}

/**
 * Creates a query chain for INSERT operations
 */
export function createInsertMock<T>(data: T, error: null | Error = null) {
  const result = { data, error };
  const mockSingle = vi.fn().mockResolvedValue(result);
  const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
  const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
  const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });

  return { mockFrom, mockInsert, mockSelect, mockSingle, result };
}

/**
 * Creates a query chain for UPDATE operations
 */
export function createUpdateMock<T>(data: T, error: null | Error = null) {
  const result = { data, error };
  const mockSingle = vi.fn().mockResolvedValue(result);
  const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
  const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
  const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate });

  return { mockFrom, mockUpdate, mockEq, mockSingle, result };
}

/**
 * Creates a query chain for DELETE operations
 */
export function createDeleteMock(error: null | Error = null) {
  const result = { data: null, error };
  const mockEq = vi.fn().mockResolvedValue(result);
  const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
  const mockFrom = vi.fn().mockReturnValue({ delete: mockDelete });

  return { mockFrom, mockDelete, mockEq, result };
}

/**
 * Creates a query chain for date range queries
 */
export function createDateRangeMock<T>(data: T, error: null | Error = null) {
  const result = { data, error };
  const mockOrder = vi.fn().mockResolvedValue(result);
  const mockGte = vi.fn().mockReturnValue({ order: mockOrder });
  const mockLte = vi.fn().mockReturnValue({ gte: mockGte });
  const mockSelect = vi.fn().mockReturnValue({ lte: mockLte });
  const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

  return { mockFrom, mockSelect, mockLte, mockGte, mockOrder, result };
}

/**
 * Creates a query chain for filtering null values
 */
export function createNullFilterMock<T>(data: T, error: null | Error = null) {
  const result = { data, error };
  const mockOrder = vi.fn().mockResolvedValue(result);
  const mockIs = vi.fn().mockReturnValue({ order: mockOrder });
  const mockSelect = vi.fn().mockReturnValue({ is: mockIs });
  const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

  return { mockFrom, mockSelect, mockIs, mockOrder, result };
}

/**
 * Mock data generators for common test scenarios
 */
export const mockDataGenerators = {
  studentNote: (overrides = {}) => ({
    id: "note-1",
    student_id: "student-1",
    type: "إيجابي" as const,
    content: "مشاركة ممتازة",
    note_date: "2025-11-05",
    teacher_name: "الشيخ خالد",
    created_at: "2025-11-05T08:00:00Z",
    ...overrides,
  }),

  attendanceRecord: (overrides = {}) => ({
    id: "record-1",
    student_id: "student-1",
    teacher_id: "teacher-1",
    record_date: "2025-11-05",
    status: "حاضر" as const,
    notes: "حضور ممتاز",
    created_at: "2025-11-05T08:00:00Z",
    ...overrides,
  }),

  student: (overrides = {}) => ({
    id: "student-1",
    name: "أحمد محمد",
    age: 12,
    grade: "السادس ابتدائي",
    teacher_id: "teacher-1",
    department: "quran",
    parts_memorized: 5,
    current_progress: "سورة آل عمران",
    previous_progress: "سورة البقرة",
    is_active: true,
    parent_name: "محمد علي",
    parent_phone: "01234567890",
    attendance: 85,
    images: {},
    created_at: "2025-01-01T00:00:00Z",
    ...overrides,
  }),

  teacher: (overrides = {}) => ({
    id: "teacher-1",
    name: "الشيخ خالد",
    specialization: "حفظ القرآن",
    department: "quran",
    is_active: true,
    email: "khalid@eqraa.com",
    phone: "01234567890",
    created_at: "2025-01-01T00:00:00Z",
    ...overrides,
  }),
};
