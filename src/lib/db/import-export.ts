import { db } from './database';
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

/**
 * Shape of the exported backup JSON file.
 */
interface BackupData {
  version: 1;
  exportedAt: string;
  tables: {
    students: DbStudent[];
    teachers: DbTeacher[];
    studentNotes: DbStudentNote[];
    attendanceRecords: DbAttendanceRecord[];
    quranSessions: DbQuranSession[];
    educationalSessions: DbEducationalSession[];
    tajweedLessons: DbTajweedLesson[];
    meetings: DbMeeting[];
    suggestions: DbSuggestion[];
    userRoles: DbUserRole[];
    users: LocalUser[];
  };
}

/**
 * Export the entire database as a JSON file and trigger a browser download.
 * The file is named 'eqraa-backup-YYYY-MM-DD.json'.
 */
const LAST_BACKUP_KEY = 'eqraa_last_backup';
const BACKUP_REMINDER_DAYS = 7;

/**
 * Check whether a backup reminder should be shown.
 * Returns true if no backup has ever been made or the last one was > 7 days ago.
 */
export function shouldShowBackupReminder(): boolean {
  const last = localStorage.getItem(LAST_BACKUP_KEY);
  if (!last) return true;
  const elapsed = Date.now() - parseInt(last, 10);
  return elapsed > BACKUP_REMINDER_DAYS * 24 * 60 * 60 * 1000;
}

/**
 * Dismiss the backup reminder for another 7 days without actually backing up.
 */
export function dismissBackupReminder(): void {
  localStorage.setItem(LAST_BACKUP_KEY, String(Date.now()));
}

/**
 * Read all tables and build a BackupData object.
 * Strips passwordHash from user records for safety.
 */
async function buildBackupData(): Promise<BackupData> {
  const [
    students, teachers, studentNotes, attendanceRecords,
    quranSessions, educationalSessions, tajweedLessons,
    meetings, suggestions, userRoles, users,
  ] = await Promise.all([
    db.students.toArray(), db.teachers.toArray(),
    db.studentNotes.toArray(), db.attendanceRecords.toArray(),
    db.quranSessions.toArray(), db.educationalSessions.toArray(),
    db.tajweedLessons.toArray(), db.meetings.toArray(),
    db.suggestions.toArray(), db.userRoles.toArray(),
    db.users.toArray(),
  ]);

  // Strip passwordHash from exported users
  const sanitizedUsers = users.map(({ passwordHash: _, ...rest }) => rest) as LocalUser[];

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    tables: {
      students, teachers, studentNotes, attendanceRecords,
      quranSessions, educationalSessions, tajweedLessons,
      meetings, suggestions, userRoles, users: sanitizedUsers,
    },
  };
}

/**
 * Trigger a browser download for a backup object.
 */
function downloadBackup(backup: BackupData, filenamePrefix: string): void {
  const jsonString = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().split('T')[0];
  const filename = `${filenamePrefix}-${today}.json`;

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function exportDatabase(): Promise<void> {
  const backup = await buildBackupData();
  downloadBackup(backup, 'eqraa-backup');

  // Record backup timestamp so the reminder resets
  localStorage.setItem(LAST_BACKUP_KEY, String(Date.now()));
}

/**
 * Create a safety backup of the current database before a destructive operation.
 * Downloads a file named 'eqraa-safety-backup-<date>.json'.
 */
async function createSafetyBackup(): Promise<void> {
  const hasData = (await db.users.count()) > 0 || (await db.students.count()) > 0;
  if (!hasData) return;

  const backup = await buildBackupData();
  downloadBackup(backup, 'eqraa-safety-backup');
}

/**
 * Import a backup JSON file into the database.
 * - Auto-exports a safety backup of current data first.
 * - Parses the JSON file content.
 * - Validates the backup version.
 * - Clears all existing tables within a transaction.
 * - Bulk inserts all data from the backup.
 */
export async function importDatabase(file: File): Promise<void> {
  // Safety net: download current data before overwriting
  await createSafetyBackup();

  const text = await file.text();
  const backup: BackupData = JSON.parse(text);

  if (backup.version !== 1) {
    throw new Error(`Unsupported backup version: ${backup.version}`);
  }

  await db.transaction(
    'rw',
    [
      db.students,
      db.teachers,
      db.studentNotes,
      db.attendanceRecords,
      db.quranSessions,
      db.educationalSessions,
      db.tajweedLessons,
      db.meetings,
      db.suggestions,
      db.userRoles,
      db.users,
    ],
    async () => {
      // Clear all tables
      await Promise.all([
        db.students.clear(),
        db.teachers.clear(),
        db.studentNotes.clear(),
        db.attendanceRecords.clear(),
        db.quranSessions.clear(),
        db.educationalSessions.clear(),
        db.tajweedLessons.clear(),
        db.meetings.clear(),
        db.suggestions.clear(),
        db.userRoles.clear(),
        db.users.clear(),
      ]);

      // Bulk insert all data
      const tables = backup.tables;
      await Promise.all([
        tables.students.length > 0
          ? db.students.bulkAdd(tables.students)
          : Promise.resolve(),
        tables.teachers.length > 0
          ? db.teachers.bulkAdd(tables.teachers)
          : Promise.resolve(),
        tables.studentNotes.length > 0
          ? db.studentNotes.bulkAdd(tables.studentNotes)
          : Promise.resolve(),
        tables.attendanceRecords.length > 0
          ? db.attendanceRecords.bulkAdd(tables.attendanceRecords)
          : Promise.resolve(),
        tables.quranSessions.length > 0
          ? db.quranSessions.bulkAdd(tables.quranSessions)
          : Promise.resolve(),
        tables.educationalSessions.length > 0
          ? db.educationalSessions.bulkAdd(tables.educationalSessions)
          : Promise.resolve(),
        tables.tajweedLessons.length > 0
          ? db.tajweedLessons.bulkAdd(tables.tajweedLessons)
          : Promise.resolve(),
        tables.meetings.length > 0
          ? db.meetings.bulkAdd(tables.meetings)
          : Promise.resolve(),
        tables.suggestions.length > 0
          ? db.suggestions.bulkAdd(tables.suggestions)
          : Promise.resolve(),
        tables.userRoles.length > 0
          ? db.userRoles.bulkAdd(tables.userRoles)
          : Promise.resolve(),
        tables.users.length > 0
          ? db.users.bulkAdd(tables.users)
          : Promise.resolve(),
      ]);
    },
  );
}
