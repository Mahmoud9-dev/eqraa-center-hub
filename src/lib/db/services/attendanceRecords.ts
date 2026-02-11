import { db } from '../database';
import type { DbAttendanceRecord } from '../types';
import { attendanceRecordSchema } from '@/lib/validations';

/**
 * Get all attendance records for a specific date.
 */
export async function getByDate(recordDate: string): Promise<DbAttendanceRecord[]> {
  return db.attendanceRecords
    .where('recordDate')
    .equals(recordDate)
    .toArray();
}

/**
 * Get all attendance records for a specific student.
 */
export async function getByStudentId(studentId: string): Promise<DbAttendanceRecord[]> {
  return db.attendanceRecords
    .where('studentId')
    .equals(studentId)
    .toArray();
}

/**
 * Get all attendance records, ordered by recordDate descending.
 * Used by Attendance view to display previous attendance records.
 */
export async function getAll(): Promise<DbAttendanceRecord[]> {
  const results = await db.attendanceRecords.toArray();
  results.sort((a, b) => {
    if (a.recordDate > b.recordDate) return -1;
    if (a.recordDate < b.recordDate) return 1;
    return 0;
  });
  return results;
}

/**
 * Add a single attendance record. Generates an ID and createdAt timestamp.
 */
export async function add(
  record: Omit<DbAttendanceRecord, 'id' | 'createdAt'>
): Promise<DbAttendanceRecord> {
  attendanceRecordSchema.parse({
    recordDate: record.recordDate,
    status: record.status,
  });

  const newRecord: DbAttendanceRecord = {
    ...record,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await db.attendanceRecords.add(newRecord);
  return newRecord;
}

/**
 * Add multiple attendance records in a single batch operation.
 * Used by Attendance view when recording attendance for multiple students/teachers.
 * Generates IDs and createdAt timestamps for each record.
 */
export async function addBatch(
  records: Omit<DbAttendanceRecord, 'id' | 'createdAt'>[]
): Promise<DbAttendanceRecord[]> {
  for (const record of records) {
    attendanceRecordSchema.parse({
      recordDate: record.recordDate,
      status: record.status,
    });
  }

  const now = new Date().toISOString();
  const newRecords: DbAttendanceRecord[] = records.map((record) => ({
    ...record,
    id: crypto.randomUUID(),
    createdAt: now,
  }));
  await db.attendanceRecords.bulkAdd(newRecords);
  return newRecords;
}

/**
 * Update an existing attendance record by ID. Validates changed fields with Zod.
 */
export async function update(
  id: string,
  changes: Partial<Omit<DbAttendanceRecord, 'id' | 'createdAt'>>
): Promise<void> {
  const validatable: Record<string, unknown> = {};
  if (changes.recordDate !== undefined) validatable.recordDate = changes.recordDate;
  if (changes.status !== undefined) validatable.status = changes.status;

  if (Object.keys(validatable).length > 0) {
    attendanceRecordSchema.partial().parse(validatable);
  }

  await db.attendanceRecords.update(id, changes);
}

/**
 * Remove an attendance record by ID.
 */
export async function remove(id: string): Promise<void> {
  await db.attendanceRecords.delete(id);
}
