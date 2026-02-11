import { db } from '../database';
import type { DbTajweedLesson } from '../types';
import { tajweedLessonSchema } from '@/lib/validations';

/**
 * Get all tajweed lessons, ordered by lessonDate descending.
 * Used by the Tajweed view to display recorded lessons.
 */
export async function getAll(): Promise<DbTajweedLesson[]> {
  const results = await db.tajweedLessons.toArray();
  results.sort((a, b) => {
    const dateA = a.lessonDate || '';
    const dateB = b.lessonDate || '';
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return 0;
  });
  return results;
}

/**
 * Add a new tajweed lesson. Generates an ID, createdAt timestamp,
 * and defaults lessonDate to the current date if not provided.
 */
export async function add(
  lesson: Omit<DbTajweedLesson, 'id' | 'createdAt'>
): Promise<DbTajweedLesson> {
  tajweedLessonSchema.parse({
    topic: lesson.topic,
    description: lesson.description,
  });

  const newLesson: DbTajweedLesson = {
    ...lesson,
    id: crypto.randomUUID(),
    lessonDate: lesson.lessonDate || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };
  await db.tajweedLessons.add(newLesson);
  return newLesson;
}

/**
 * Update an existing tajweed lesson by ID. Validates changed fields with Zod.
 */
export async function update(
  id: string,
  changes: Partial<Omit<DbTajweedLesson, 'id' | 'createdAt'>>
): Promise<void> {
  const validatable: Record<string, unknown> = {};
  if (changes.topic !== undefined) validatable.topic = changes.topic;
  if (changes.description !== undefined) validatable.description = changes.description;

  if (Object.keys(validatable).length > 0) {
    tajweedLessonSchema.partial().parse(validatable);
  }

  await db.tajweedLessons.update(id, changes);
}

/**
 * Remove a tajweed lesson by ID.
 */
export async function remove(id: string): Promise<void> {
  await db.tajweedLessons.delete(id);
}
