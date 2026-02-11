import { db } from '../database';
import type { DbStudentNote } from '../types';
import { studentNoteSchema } from '@/lib/validations';

/**
 * Get all student notes, ordered by noteDate descending.
 * Used by Students view to load all notes and group them by student.
 */
export async function getAll(): Promise<DbStudentNote[]> {
  const results = await db.studentNotes.toArray();
  results.sort((a, b) => {
    // Sort by noteDate descending
    if (a.noteDate > b.noteDate) return -1;
    if (a.noteDate < b.noteDate) return 1;
    return 0;
  });
  return results;
}

/**
 * Get all notes for a specific student, ordered by noteDate descending.
 */
export async function getByStudentId(studentId: string): Promise<DbStudentNote[]> {
  const results = await db.studentNotes
    .where('studentId')
    .equals(studentId)
    .toArray();
  results.sort((a, b) => {
    if (a.noteDate > b.noteDate) return -1;
    if (a.noteDate < b.noteDate) return 1;
    return 0;
  });
  return results;
}

/**
 * Add a new student note. Generates an ID and createdAt timestamp.
 */
export async function add(
  note: Omit<DbStudentNote, 'id' | 'createdAt'>
): Promise<DbStudentNote> {
  studentNoteSchema.parse({
    studentId: note.studentId,
    type: note.type,
    content: note.content,
    noteDate: note.noteDate,
    teacherName: note.teacherName,
  });

  const newNote: DbStudentNote = {
    ...note,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await db.studentNotes.add(newNote);
  return newNote;
}

/**
 * Update an existing student note by ID. Validates changed fields with Zod.
 */
export async function update(
  id: string,
  changes: Partial<Omit<DbStudentNote, 'id' | 'createdAt'>>
): Promise<void> {
  const validatable: Record<string, unknown> = {};
  if (changes.type !== undefined) validatable.type = changes.type;
  if (changes.content !== undefined) validatable.content = changes.content;
  if (changes.noteDate !== undefined) validatable.noteDate = changes.noteDate;
  if (changes.teacherName !== undefined) validatable.teacherName = changes.teacherName;

  if (Object.keys(validatable).length > 0) {
    studentNoteSchema.partial().parse(validatable);
  }

  await db.studentNotes.update(id, changes);
}

/**
 * Remove a student note by ID.
 */
export async function remove(id: string): Promise<void> {
  await db.studentNotes.delete(id);
}
