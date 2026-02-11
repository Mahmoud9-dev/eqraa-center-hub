import { db } from '../database';
import type { DbQuranSession } from '../types';
import { quranSessionSchema, quranSessionBaseSchema } from '@/lib/validations';

/**
 * Extended type that includes resolved student and teacher names.
 * Used by the Quran view to display sessions with names.
 */
export interface QuranSessionWithNames extends DbQuranSession {
  studentName: string;
  teacherName: string;
}

/**
 * Get all quran sessions, ordered by sessionDate descending.
 */
export async function getAll(): Promise<DbQuranSession[]> {
  const results = await db.quranSessions.toArray();
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
 * Get all quran sessions with student and teacher names resolved via manual join.
 * Loads all students and teachers, builds lookup maps, and enriches each session.
 * Used by the Quran view which expects `students.name` on each session.
 */
export async function getAllWithNames(): Promise<QuranSessionWithNames[]> {
  const [sessions, students, teachers] = await Promise.all([
    db.quranSessions.toArray(),
    db.students.toArray(),
    db.teachers.toArray(),
  ]);

  const studentMap = new Map(students.map((s) => [s.id, s.name]));
  const teacherMap = new Map(teachers.map((t) => [t.id, t.name]));

  const enriched: QuranSessionWithNames[] = sessions.map((session) => ({
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
 * Add a new quran session. Generates an ID and createdAt timestamp.
 * sessionDate defaults to current ISO date if not provided.
 */
export async function add(
  session: Omit<DbQuranSession, 'id' | 'createdAt'>
): Promise<DbQuranSession> {
  quranSessionSchema.parse({
    surahName: session.surahName,
    versesFrom: session.versesFrom,
    versesTo: session.versesTo,
    performanceRating: session.performanceRating ?? undefined,
    notes: session.notes ?? undefined,
  });

  const newSession: DbQuranSession = {
    ...session,
    id: crypto.randomUUID(),
    sessionDate: session.sessionDate || new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  await db.quranSessions.add(newSession);
  return newSession;
}

/**
 * Update an existing quran session by ID. Validates changed fields with Zod.
 */
export async function update(
  id: string,
  changes: Partial<Omit<DbQuranSession, 'id' | 'createdAt'>>
): Promise<void> {
  const validatable: Record<string, unknown> = {};
  if (changes.surahName !== undefined) validatable.surahName = changes.surahName;
  if (changes.versesFrom !== undefined) validatable.versesFrom = changes.versesFrom;
  if (changes.versesTo !== undefined) validatable.versesTo = changes.versesTo;
  if (changes.performanceRating !== undefined) validatable.performanceRating = changes.performanceRating ?? undefined;
  if (changes.notes !== undefined) validatable.notes = changes.notes ?? undefined;

  if (Object.keys(validatable).length > 0) {
    quranSessionBaseSchema.partial().parse(validatable);
  }

  await db.quranSessions.update(id, changes);
}

/**
 * Remove a quran session by ID.
 */
export async function remove(id: string): Promise<void> {
  await db.quranSessions.delete(id);
}
