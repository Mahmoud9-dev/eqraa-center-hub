/**
 * Constants for Supabase database
 * Centralized location for all hardcoded strings to prevent typos and ease refactoring
 */

/**
 * Attendance status values (Arabic)
 * Used in attendance_records table with CHECK constraint
 */
export const ATTENDANCE_STATUS = {
  PRESENT: 'حاضر',
  ABSENT: 'غائب',
  EXCUSED: 'مأذون',
} as const;

/**
 * Student note types (Arabic)
 * Used in student_notes table with CHECK constraint
 */
export const NOTE_TYPES = {
  POSITIVE: 'إيجابي',
  NEGATIVE: 'سلبي',
} as const;

/**
 * Type definitions for type safety
 */
export type AttendanceStatus = typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS];
export type NoteType = typeof NOTE_TYPES[keyof typeof NOTE_TYPES];
