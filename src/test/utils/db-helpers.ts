import { db } from "@/lib/db/database";
import type {
  DbStudent,
  DbTeacher,
  DbStudentNote,
  DbAttendanceRecord,
  DbQuranSession,
  DbEducationalSession,
  DbTajweedLesson,
  DbMeeting,
  DbSuggestion,
} from "@/lib/db/types";

export async function seedStudent(
  overrides: Partial<DbStudent> = {}
): Promise<DbStudent> {
  const student: DbStudent = {
    id: crypto.randomUUID(),
    name: "أحمد محمد",
    age: 12,
    grade: "السادس ابتدائي",
    department: "quran",
    teacherId: null,
    partsMemorized: 5,
    currentProgress: "سورة آل عمران",
    previousProgress: "سورة البقرة",
    isActive: true,
    parentName: "محمد علي",
    parentPhone: "01234567890",
    attendance: 85,
    images: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
  await db.students.add(student);
  return student;
}

export async function seedTeacher(
  overrides: Partial<DbTeacher> = {}
): Promise<DbTeacher> {
  const teacher: DbTeacher = {
    id: crypto.randomUUID(),
    name: "الشيخ خالد",
    department: "quran",
    specialization: "حفظ القرآن",
    isActive: true,
    email: "khalid@eqraa.com",
    phone: "01234567890",
    experience: 10,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
  await db.teachers.add(teacher);
  return teacher;
}

export async function seedStudentNote(
  overrides: Partial<DbStudentNote> = {}
): Promise<DbStudentNote> {
  const note: DbStudentNote = {
    id: crypto.randomUUID(),
    studentId: "student-1",
    type: "إيجابي",
    content: "مشاركة ممتازة",
    noteDate: "2025-11-05",
    teacherName: "الشيخ خالد",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
  await db.studentNotes.add(note);
  return note;
}

export async function seedAttendanceRecord(
  overrides: Partial<DbAttendanceRecord> = {}
): Promise<DbAttendanceRecord> {
  const record: DbAttendanceRecord = {
    id: crypto.randomUUID(),
    studentId: "student-1",
    teacherId: "teacher-1",
    recordDate: "2025-11-05",
    status: "حاضر",
    notes: "حضور ممتاز",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
  await db.attendanceRecords.add(record);
  return record;
}

export async function seedMeeting(
  overrides: Partial<DbMeeting> = {}
): Promise<DbMeeting> {
  const meeting: DbMeeting = {
    id: crypto.randomUUID(),
    title: "اجتماع تجريبي",
    description: "وصف الاجتماع",
    meetingDate: new Date().toISOString(),
    attendees: null,
    agenda: null,
    notes: null,
    status: "مجدولة",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
  await db.meetings.add(meeting);
  return meeting;
}

export async function seedSuggestion(
  overrides: Partial<DbSuggestion> = {}
): Promise<DbSuggestion> {
  const suggestion: DbSuggestion = {
    id: crypto.randomUUID(),
    title: "اقتراح تجريبي",
    description: "وصف الاقتراح",
    status: "لم يتم",
    priority: "متوسط",
    suggestedBy: "teacher-1",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
  await db.suggestions.add(suggestion);
  return suggestion;
}
