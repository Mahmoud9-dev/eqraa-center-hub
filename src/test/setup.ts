import "fake-indexeddb/auto";
import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { db } from "@/lib/db/database";

// Clear all Dexie tables and cleanup DOM between tests
afterEach(async () => {
  await db.students.clear();
  await db.teachers.clear();
  await db.studentNotes.clear();
  await db.attendanceRecords.clear();
  await db.quranSessions.clear();
  await db.educationalSessions.clear();
  await db.tajweedLessons.clear();
  await db.meetings.clear();
  await db.suggestions.clear();
  await db.userRoles.clear();
  await db.users.clear();
  cleanup();
});

// Mock window.matchMedia for next-themes
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Global test utilities
declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends jest.Matchers<void, T> {}
  }
}
