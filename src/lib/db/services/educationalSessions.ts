import { db } from '../database';
import type { DbEducationalSession } from '../types';
import { educationalSessionSchema } from '@/lib/validations';

/**
 * Extended type that includes resolved student and teacher names.
 * Used by the Educational view to display sessions with names.
 */
export interface EducationalSessionWithNames extends DbEducationalSession {
  studentName: string;
  teacherName: string;
}

/**
 * Get all educational sessions, ordered by sessionDate descending.
 */
export async function getAll(): Promise<DbEducationalSession[]> {
  const results = await db.educationalSessions.toArray();
  results.sort((a, b) => {
    const dateA = a.sessionDate || '';
    const dateB = b.sessionDate || '';
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return 0;
  });
  return results;
}

/**
 * Get all educational sessions with student and teacher names resolved via manual join.
 * Loads all students and teachers, builds lookup maps, and enriches each session.
 * Used by the Educational view which expects `students.name` and `teachers.name`.
 */
export async function getAllWithNames(): Promise<EducationalSessionWithNames[]> {
  const [sessions, students, teachers] = await Promise.all([
    db.educationalSessions.toArray(),
    db.students.toArray(),
    db.teachers.toArray(),
  ]);

  const studentMap = new Map(students.map((s) => [s.id, s.name]));
  const teacherMap = new Map(teachers.map((t) => [t.id, t.name]));

  const enriched: EducationalSessionWithNames[] = sessions.map((session) => ({
    ...session,
    studentName: session.studentId ? (studentMap.get(session.studentId) || '-') : '-',
    teacherName: session.teacherId ? (teacherMap.get(session.teacherId) || '-') : '-',
  }));

  // Sort by sessionDate descending
  enriched.sort((a, b) => {
    const dateA = a.sessionDate || '';
    const dateB = b.sessionDate || '';
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return 0;
  });

  return enriched;
}

/**
 * Add a new educational session. Generates an ID and createdAt timestamp.
 * sessionDate defaults to current ISO date if not provided.
 */
export async function add(
  session: Omit<DbEducationalSession, 'id' | 'createdAt'>
): Promise<DbEducationalSession> {
  educationalSessionSchema.parse({
    topic: session.topic,
    description: session.description,
    performanceRating: session.performanceRating ?? undefined,
    notes: session.notes ?? undefined,
  });

  const newSession: DbEducationalSession = {
    ...session,
    id: crypto.randomUUID(),
    sessionDate: session.sessionDate || new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  await db.educationalSessions.add(newSession);
  return newSession;
}

/**
 * Update an existing educational session by ID. Validates changed fields with Zod.
 */
export async function update(
  id: string,
  changes: Partial<Omit<DbEducationalSession, 'id' | 'createdAt'>>
): Promise<void> {
  const validatable: Record<string, unknown> = {};
  if (changes.topic !== undefined) validatable.topic = changes.topic;
  if (changes.description !== undefined) validatable.description = changes.description;
  if (changes.performanceRating !== undefined) validatable.performanceRating = changes.performanceRating ?? undefined;
  if (changes.notes !== undefined) validatable.notes = changes.notes ?? undefined;

  if (Object.keys(validatable).length > 0) {
    educationalSessionSchema.partial().parse(validatable);
  }

  await db.educationalSessions.update(id, changes);
}

/**
 * Remove an educational session by ID.
 */
export async function remove(id: string): Promise<void> {
  await db.educationalSessions.delete(id);
}
