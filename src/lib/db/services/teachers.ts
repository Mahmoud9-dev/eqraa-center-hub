import { db } from '../database';
import type { DbTeacher } from '../types';
import { teacherSchema } from '@/lib/validations';

/**
 * Get all teachers, ordered by name.
 */
export async function getAll(): Promise<DbTeacher[]> {
  const results = await db.teachers.toArray();
  results.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  return results;
}

/**
 * Get all active teachers, ordered by name.
 * Used by Attendance view for teacher attendance recording.
 */
export async function getActive(): Promise<DbTeacher[]> {
  const all = await db.teachers.toArray();
  const active = all.filter((t) => t.isActive === true || t.isActive === null);
  active.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  return active;
}

/**
 * Get a single teacher by ID.
 */
export async function getById(id: string): Promise<DbTeacher | undefined> {
  return db.teachers.get(id);
}

/**
 * Get teachers filtered by department, ordered by name.
 * Used by Quran view (department=quran) and Educational view (department=tarbawi).
 */
export async function getByDepartment(department: string): Promise<DbTeacher[]> {
  const results = await db.teachers
    .where('department')
    .equals(department)
    .toArray();
  results.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  return results;
}

/**
 * Add a new teacher. Generates an ID and createdAt timestamp.
 */
export async function add(
  teacher: Omit<DbTeacher, 'id' | 'createdAt'>
): Promise<DbTeacher> {
  teacherSchema.parse({
    name: teacher.name,
    specialization: teacher.specialization,
    department: teacher.department,
    email: teacher.email || undefined,
    phone: teacher.phone || undefined,
    experience: teacher.experience ?? undefined,
  });

  const newTeacher: DbTeacher = {
    ...teacher,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await db.teachers.add(newTeacher);
  return newTeacher;
}

/**
 * Update an existing teacher by ID. Validates changed fields with Zod.
 */
export async function update(
  id: string,
  changes: Partial<Omit<DbTeacher, 'id' | 'createdAt'>>
): Promise<void> {
  const validatable: Record<string, unknown> = {};
  if (changes.name !== undefined) validatable.name = changes.name;
  if (changes.specialization !== undefined) validatable.specialization = changes.specialization;
  if (changes.department !== undefined) validatable.department = changes.department;
  if (changes.email !== undefined) validatable.email = changes.email || undefined;
  if (changes.phone !== undefined) validatable.phone = changes.phone || undefined;
  if (changes.experience !== undefined) validatable.experience = changes.experience ?? undefined;

  if (Object.keys(validatable).length > 0) {
    teacherSchema.partial().parse(validatable);
  }

  await db.teachers.update(id, changes);
}

/**
 * Remove a teacher by ID.
 */
export async function remove(id: string): Promise<void> {
  await db.teachers.delete(id);
}

/**
 * Get the count of active teachers.
 * Used by useHomeStats as a proxy for active circles.
 */
export async function getActiveCount(): Promise<number> {
  const all = await db.teachers.toArray();
  return all.filter((t) => t.isActive === true || t.isActive === null).length;
}
