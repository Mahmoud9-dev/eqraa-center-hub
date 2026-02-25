/**
 * Constants for Supabase database
 * Centralized location for all hardcoded strings to prevent typos and ease refactoring
 */

/**
 * Attendance status values (Arabic)
 * Used in attendance_records table with CHECK constraint
 * NOTE: These are canonical DB values — do NOT change them.
 *       Use ATTENDANCE_STATUS_LABELS for display.
 */
export const ATTENDANCE_STATUS = {
  PRESENT: 'حاضر',
  ABSENT: 'غائب',
  EXCUSED: 'مأذون',
} as const;

/**
 * Student note types (Arabic)
 * Used in student_notes table with CHECK constraint
 * NOTE: These are canonical DB values — do NOT change them.
 *       Use NOTE_TYPE_LABELS for display.
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

// ---------------------------------------------------------------------------
// UI display label maps (per language)
// Map canonical DB values → localized display strings at render-time only.
// ---------------------------------------------------------------------------

export const ATTENDANCE_STATUS_LABELS: Record<string, Record<AttendanceStatus, string>> = {
  ar: {
    [ATTENDANCE_STATUS.PRESENT]: 'حاضر',
    [ATTENDANCE_STATUS.ABSENT]: 'غائب',
    [ATTENDANCE_STATUS.EXCUSED]: 'مأذون',
  },
  en: {
    [ATTENDANCE_STATUS.PRESENT]: 'Present',
    [ATTENDANCE_STATUS.ABSENT]: 'Absent',
    [ATTENDANCE_STATUS.EXCUSED]: 'Excused',
  },
};

export const NOTE_TYPE_LABELS: Record<string, Record<NoteType, string>> = {
  ar: {
    [NOTE_TYPES.POSITIVE]: 'إيجابي',
    [NOTE_TYPES.NEGATIVE]: 'سلبي',
  },
  en: {
    [NOTE_TYPES.POSITIVE]: 'Positive',
    [NOTE_TYPES.NEGATIVE]: 'Negative',
  },
};
