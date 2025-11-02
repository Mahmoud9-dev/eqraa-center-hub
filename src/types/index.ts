/**
 * Core data models for Eqraa Center Islamic Educational Management System
 * Following TypeScript best practices with comprehensive type safety
 */

// Department types
export type Department = "quran" | "tajweed" | "tarbawi";

// Status types
export type SuggestionStatus = "تم" | "لم يتم";
export type Priority = "عالي" | "متوسط" | "منخفض";

/**
 * Teacher interface
 * Represents instructors in various Islamic educational departments
 */
export interface Teacher {
  id: string;
  name: string;
  specialization: string;
  department: Department;
  isActive: boolean;
  createdAt: Date;
  email?: string;
  phone?: string;
  experience?: number;
}

/**
 * Student interface
 * Represents students enrolled in Quran memorization and Islamic education programs
 */
export interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  teacherId: string;
  department: Department;
  partsMemorized: number;
  currentProgress: string;
  previousProgress: string;
  isActive: boolean;
  createdAt: Date;
  parentName?: string;
  parentPhone?: string;
  attendance?: number;
}

/**
 * Suggestion interface
 * Represents suggestions and proposals from teachers or administrators
 */
export interface Suggestion {
  id: string;
  title: string;
  description: string;
  status: SuggestionStatus;
  createdAt: Date;
  suggestedBy?: string;
  priority?: Priority;
}

/**
 * Quran session interface
 * Tracks Quran memorization sessions and student progress
 */
export interface QuranSession {
  id: string;
  studentId: string;
  teacherId: string;
  date: Date;
  surahName: string;
  versesFrom: number;
  versesTo: number;
  performanceRating: number;
  notes?: string;
  attendance: boolean;
}

/**
 * Tajweed lesson interface
 * Tracks Tajweed theory lessons and rules taught
 */
export interface TajweedLesson {
  id: string;
  teacherId: string;
  date: Date;
  topic: string;
  description: string;
  attendees?: string[];
  resources?: string[];
}

/**
 * Educational content interface
 * Represents Tarbawi (educational) content including Aqeedah, Seerah, Fiqh, etc.
 */
export interface EducationalContent {
  id: string;
  teacherId: string;
  category: "عقيدة" | "سيرة" | "فقه" | "أخلاقيات" | "آداب" | "مواعظ عامة";
  title: string;
  description: string;
  date: Date;
  attendees?: string[];
  resources?: string[];
}

/**
 * Meeting interface
 * Tracks administrative and organizational meetings
 */
export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: Date;
  attendees: string[];
  agenda?: string[];
  notes?: string;
  status: "مجدولة" | "مكتملة" | "ملغاة";
}

/**
 * Behavioral note interface
 * Tracks student behavior (positive and negative)
 */
export interface BehavioralNote {
  id: string;
  studentId: string;
  teacherId: string;
  type: "إيجابي" | "سلبي";
  description: string;
  date: Date;
  resolved: boolean;
  resolution?: string;
}

// Utility types for API responses
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Form data types
export type CreateTeacherInput = Omit<Teacher, "id" | "createdAt">;
export type UpdateTeacherInput = Partial<CreateTeacherInput>;

export type CreateStudentInput = Omit<Student, "id" | "createdAt">;
export type UpdateStudentInput = Partial<CreateStudentInput>;

export type CreateSuggestionInput = Omit<Suggestion, "id" | "createdAt">;
export type UpdateSuggestionInput = Partial<CreateSuggestionInput>;
