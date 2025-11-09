/**
 * Core data models for Eqraa Center Islamic Educational Management System
 * Following TypeScript best practices with comprehensive type safety
 */

// Department types
export type Department = "quran" | "tajweed" | "tarbawi" | "sharia";

// Status types
export type SuggestionStatus = "تم" | "لم يتم";
export type Priority = "عالي" | "متوسط" | "منخفض";

// User role types
export type UserRole = "طالب" | "مدرس" | "مشرف" | "إدارة";

// Attendance status types
export type AttendanceStatus = "حاضر" | "غائب" | "متأخر" | "انصراف مبكر";

// Exam subject types
export type ExamSubject = "قرآن" | "تجويد" | "تربوي";

// Content category types
export type ContentCategory =
  | "عقيدة"
  | "فقه"
  | "سيرة"
  | "تفسير"
  | "حديث"
  | "تربية"
  | "لغة عربية";

// Content type types
export type ContentType = "فيديو" | "صوت" | "PDF" | "مقال" | "صورة";

// Schedule type types
export type ScheduleType =
  | "حلقة قرآن"
  | "درس تجويد"
  | "محاضرة تربوية"
  | "اجتماع"
  | "امتحان";

// Recurring type types
export type RecurringType = "يومي" | "أسبوعي" | "شهري" | "مرة واحدة";

// Session type types
export type SessionType = "ماضي بعيد" | "ماضي قريب" | "جديد";

// Question type types
export type QuestionType = "نصي" | "اختياري" | "تلاوة";

// Library item type types
export type LibraryItemType =
  | "كتاب PDF"
  | "مقطع صوتي"
  | "فيديو"
  | "مقال"
  | "رابط خارجي";

// Announcement type types
export type AnnouncementType = "عام" | "للمشايخ" | "للطلاب" | "للإدارة";

/**
 * User interface
 * Represents all users in system with role-based access
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions?: string[];
  isActive: boolean;
  lastLogin?: Date;
  emailVerified?: boolean;
  phone?: string;
  avatarUrl?: string;
  preferences?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

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
  updatedAt: Date;
  email?: string;
  phone?: string;
  experience?: number;
  bio?: string;
  userId?: string;
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
  gradeLevel?: string; // "ابتدائي أول"، "ابتدائي ثاني"، etc.
  teacherId: string;
  department: Department;
  partsMemorized: number;
  currentProgress: string;
  previousProgress: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  parentName?: string;
  parentPhone?: string;
  attendance?: number;
  userId?: string;
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
  sessionType?: SessionType;
  audioRecordingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Attendance interface
 * Tracks attendance for students and teachers
 */
export interface Attendance {
  id: string;
  userId: string;
  userType: "student" | "teacher";
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  status: AttendanceStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Exam interface
 * Represents exams for different subjects
 */
export interface Exam {
  id: string;
  title: string;
  subject: ExamSubject;
  description?: string;
  examDate: Date;
  maxScore: number;
  durationMinutes?: number;
  teacherId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Exam result interface
 * Represents student exam results
 */
export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  score: number;
  maxScore: number;
  notes?: string;
  evaluatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Exam question interface
 * Represents questions within an exam
 */
export interface ExamQuestion {
  id: string;
  examId: string;
  questionText: string;
  questionType: QuestionType;
  maxScore: number;
  orderIndex: number;
  createdAt: Date;
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
 * Represents educational content in various categories
 */
export interface EducationalContent {
  id: string;
  category: ContentCategory;
  title: string;
  description?: string;
  contentType: ContentType;
  contentUrl: string;
  thumbnailUrl?: string;
  teacherId?: string;
  durationMinutes?: number;
  fileSize?: number;
  tags?: string[];
  isActive: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Assignment interface
 * Represents assignments related to educational content
 */
export interface Assignment {
  id: string;
  contentId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  maxScore: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Assignment submission interface
 * Represents student assignment submissions
 */
export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionText?: string;
  fileUrl?: string;
  score?: number;
  notes?: string;
  submittedAt: Date;
  evaluatedAt?: Date;
  evaluatedBy?: string;
}

/**
 * Schedule interface
 * Represents schedules for various activities
 */
export interface Schedule {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  recurringType: RecurringType;
  recurringDays?: number[];
  location?: string;
  teacherId?: string;
  scheduleType: ScheduleType;
  isActive: boolean;
  notificationsEnabled: boolean;
  notificationMinutesBefore: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schedule participant interface
 * Represents participants in schedules
 */
export interface ScheduleParticipant {
  id: string;
  scheduleId: string;
  participantId: string;
  participantType: "student" | "teacher";
  isRequired: boolean;
  createdAt: Date;
}

/**
 * Library item interface
 * Represents items in digital library
 */
export interface LibraryItem {
  id: string;
  title: string;
  author?: string;
  description?: string;
  itemType: LibraryItemType;
  fileUrl?: string;
  externalUrl?: string;
  thumbnailUrl?: string;
  category: ContentCategory;
  tags?: string[];
  language?: string;
  fileSize?: number;
  durationMinutes?: number;
  pagesCount?: number;
  isActive: boolean;
  downloadCount: number;
  viewCount: number;
  addedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Announcement interface
 * Represents announcements and notifications
 */
export interface Announcement {
  id: string;
  title: string;
  content: string;
  announcementType: AnnouncementType;
  priority: Priority;
  isActive: boolean;
  showPopup: boolean;
  startDate: Date;
  endDate?: Date;
  targetAudience?: string[];
  attachments?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Activity log interface
 * Represents activity logs for auditing
 */
export interface ActivityLog {
  id: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
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
