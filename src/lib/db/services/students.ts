import { db } from '../database';
import type { DbStudent } from '../types';
import { studentSchema } from '@/lib/validations';

/**
 * Get all students, ordered by createdAt descending.
 */
export async function getAll(): Promise<DbStudent[]> {
  return db.students.orderBy('createdAt').reverse().toArray();
}

/**
 * Get a single student by ID.
 */
export async function getById(id: string): Promise<DbStudent | undefined> {
  return db.students.get(id);
}

/**
 * Get all active students, ordered by name.
 */
export async function getActive(): Promise<DbStudent[]> {
  const all = await db.students.toArray();
  const active = all.filter((s) => s.isActive === true || s.isActive === null);
  active.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  return active;
}

/**
 * Get students filtered by department, ordered by name.
 */
export async function getByDepartment(department: string): Promise<DbStudent[]> {
  const results = await db.students
    .where('department')
    .equals(department)
    .toArray();
  results.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  return results;
}

/**
 * Get active students filtered by department, ordered by name.
 * Used by Attendance view which needs active students and filters by department.
 */
export async function getActiveDepartment(department: string): Promise<DbStudent[]> {
  const all = await db.students.toArray();
  const filtered = all.filter(
    (s) => s.department === department && (s.isActive === true || s.isActive === null)
  );
  filtered.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  return filtered;
}

/**
 * Add a new student. Validates with Zod, generates an ID and createdAt timestamp.
 */
export async function add(
  student: Omit<DbStudent, 'id' | 'createdAt'>
): Promise<DbStudent> {
  studentSchema.parse({
    name: student.name,
    age: student.age,
    grade: student.grade,
    department: student.department,
    parentName: student.parentName || undefined,
    parentPhone: student.parentPhone || undefined,
  });

  const newStudent: DbStudent = {
    ...student,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await db.students.add(newStudent);
  return newStudent;
}

/**
 * Update an existing student by ID. Validates changed fields with Zod.
 */
export async function update(
  id: string,
  changes: Partial<Omit<DbStudent, 'id' | 'createdAt'>>
): Promise<void> {
  const validatable: Record<string, unknown> = {};
  if (changes.name !== undefined) validatable.name = changes.name;
  if (changes.age !== undefined) validatable.age = changes.age;
  if (changes.grade !== undefined) validatable.grade = changes.grade;
  if (changes.department !== undefined) validatable.department = changes.department;
  if (changes.parentName !== undefined) validatable.parentName = changes.parentName || undefined;
  if (changes.parentPhone !== undefined) validatable.parentPhone = changes.parentPhone || undefined;

  if (Object.keys(validatable).length > 0) {
    studentSchema.partial().parse(validatable);
  }

  await db.students.update(id, changes);
}

/**
 * Remove a student by ID.
 */
export async function remove(id: string): Promise<void> {
  await db.students.delete(id);
}

/**
 * Get the count of active students.
 * Used by useHomeStats hook.
 */
export async function getActiveCount(): Promise<number> {
  const all = await db.students.toArray();
  return all.filter((s) => s.isActive === true || s.isActive === null).length;
}

/**
 * Get attendance data for active students (students with non-null attendance).
 * Used by useHomeStats to calculate average attendance percentage.
 */
export async function getAttendanceData(): Promise<{ attendance: number }[]> {
  const all = await db.students.toArray();
  return all
    .filter(
      (s) =>
        (s.isActive === true || s.isActive === null) &&
        s.attendance !== null &&
        s.attendance !== undefined
    )
    .map((s) => ({ attendance: s.attendance as number }));
}
