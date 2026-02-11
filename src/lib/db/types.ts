/**
 * Database types for Dexie.js (IndexedDB) local storage
 * All fields use camelCase - no more snake_case conversion needed
 * These types mirror the Supabase schema but are optimized for local storage
 */

// ============================================================
// Enums & Type Aliases
// ============================================================

export type AppRole = 'admin' | 'teacher' | 'student' | 'parent' | 'viewer';

export type Department = 'quran' | 'tajweed' | 'tarbawi';

export type AttendanceStatus = 'حاضر' | 'غائب' | 'مأذون';

export type NoteType = 'إيجابي' | 'سلبي';

export type MeetingStatus = 'مجدولة' | 'مكتملة' | 'ملغاة';

export type SuggestionStatus = 'تم' | 'لم يتم';

export type Priority = 'عالي' | 'متوسط' | 'منخفض';

// ============================================================
// Entity Interfaces
// ============================================================

export interface DbStudent {
  id: string;
  name: string;
  age: number;
  grade: string;
  department: string;
  teacherId: string | null;
  partsMemorized: number | null;
  currentProgress: string | null;
  previousProgress: string | null;
  isActive: boolean | null;
  parentName: string | null;
  parentPhone: string | null;
  attendance: number | null;
  images: StudentImages | null;
  createdAt: string | null;
}

export interface StudentImages {
  new?: string;
  recent1?: string;
  recent2?: string;
  recent3?: string;
  distant1?: string;
  distant2?: string;
  distant3?: string;
}

export interface DbTeacher {
  id: string;
  name: string;
  department: string;
  specialization: string;
  isActive: boolean | null;
  email: string | null;
  phone: string | null;
  experience: number | null;
  createdAt: string | null;
}

export interface DbStudentNote {
  id: string;
  studentId: string;
  type: string;
  content: string;
  noteDate: string;
  teacherName: string;
  createdAt: string | null;
}

export interface DbAttendanceRecord {
  id: string;
  studentId: string | null;
  teacherId: string | null;
  recordDate: string;
  status: string;
  notes: string | null;
  createdAt: string | null;
}

export interface DbQuranSession {
  id: string;
  studentId: string | null;
  teacherId: string | null;
  sessionDate: string | null;
  surahName: string;
  versesFrom: number;
  versesTo: number;
  performanceRating: number | null;
  notes: string | null;
  attendance: boolean | null;
  createdAt: string | null;
}

export interface DbEducationalSession {
  id: string;
  studentId: string | null;
  teacherId: string | null;
  sessionDate: string | null;
  topic: string;
  description: string;
  performanceRating: number | null;
  notes: string | null;
  attendance: boolean | null;
  createdAt: string | null;
}

export interface DbTajweedLesson {
  id: string;
  teacherId: string | null;
  lessonDate: string | null;
  topic: string;
  description: string;
  attendees: string[] | null;
  resources: string[] | null;
  createdAt: string | null;
}

export interface DbMeeting {
  id: string;
  title: string;
  description: string;
  meetingDate: string;
  attendees: string[] | null;
  agenda: string[] | null;
  notes: string | null;
  status: string | null;
  createdAt: string | null;
}

export interface DbSuggestion {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string | null;
  suggestedBy: string | null;
  createdAt: string | null;
}

export interface DbUserRole {
  id: string;
  userId: string;
  role: AppRole;
  createdAt: string | null;
}

// ============================================================
// Auth Types (Local Authentication)
// ============================================================

export interface LocalUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  roles: AppRole[];
}
