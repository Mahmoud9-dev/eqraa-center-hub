import Dexie, { type Table } from 'dexie';
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
  DbUserRole,
  LocalUser,
} from './types';

export class EqraaDatabase extends Dexie {
  students!: Table<DbStudent, string>;
  teachers!: Table<DbTeacher, string>;
  studentNotes!: Table<DbStudentNote, string>;
  attendanceRecords!: Table<DbAttendanceRecord, string>;
  quranSessions!: Table<DbQuranSession, string>;
  educationalSessions!: Table<DbEducationalSession, string>;
  tajweedLessons!: Table<DbTajweedLesson, string>;
  meetings!: Table<DbMeeting, string>;
  suggestions!: Table<DbSuggestion, string>;
  userRoles!: Table<DbUserRole, string>;
  users!: Table<LocalUser, string>;

  constructor() {
    super('eqraa-center-hub');

    this.version(1).stores({
      students: 'id, name, department, teacherId, isActive, createdAt',
      teachers: 'id, name, department, isActive, createdAt',
      studentNotes: 'id, studentId, type, noteDate, createdAt',
      attendanceRecords: 'id, studentId, teacherId, recordDate, status, createdAt',
      quranSessions: 'id, studentId, teacherId, sessionDate, createdAt',
      educationalSessions: 'id, studentId, teacherId, sessionDate, createdAt',
      tajweedLessons: 'id, teacherId, lessonDate, createdAt',
      meetings: 'id, meetingDate, status, createdAt',
      suggestions: 'id, status, priority, createdAt',
      userRoles: 'id, userId, role, createdAt',
      users: 'id, &email, name, createdAt',
    });
  }
}

export const db = new EqraaDatabase();
