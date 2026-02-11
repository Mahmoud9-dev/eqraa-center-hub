import { db } from '../database';
import type { DbSuggestion } from '../types';
import { suggestionSchema } from '@/lib/validations';

/**
 * Get all suggestions, ordered by createdAt descending.
 * Used by the Suggestions view to display all recorded suggestions.
 */
export async function getAll(): Promise<DbSuggestion[]> {
  const results = await db.suggestions.toArray();
  results.sort((a, b) => {
    const dateA = a.createdAt || '';
    const dateB = b.createdAt || '';
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return 0;
  });
  return results;
}

/**
 * Add a new suggestion. Generates an ID and createdAt timestamp.
 */
export async function add(
  suggestion: Omit<DbSuggestion, 'id' | 'createdAt'>
): Promise<DbSuggestion> {
  suggestionSchema.parse({
    title: suggestion.title,
    description: suggestion.description,
    suggestedBy: suggestion.suggestedBy || undefined,
    priority: suggestion.priority || '',
  });

  const newSuggestion: DbSuggestion = {
    ...suggestion,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await db.suggestions.add(newSuggestion);
  return newSuggestion;
}

/**
 * Update an existing suggestion by ID. Validates changed fields with Zod.
 */
export async function update(
  id: string,
  changes: Partial<Omit<DbSuggestion, 'id' | 'createdAt'>>
): Promise<void> {
  const validatable: Record<string, unknown> = {};
  if (changes.title !== undefined) validatable.title = changes.title;
  if (changes.description !== undefined) validatable.description = changes.description;
  if (changes.suggestedBy !== undefined) validatable.suggestedBy = changes.suggestedBy || undefined;
  if (changes.priority !== undefined) validatable.priority = changes.priority || '';

  if (Object.keys(validatable).length > 0) {
    suggestionSchema.partial().parse(validatable);
  }

  await db.suggestions.update(id, changes);
}

/**
 * Update only the status field of a suggestion.
 * Used by the Suggestions view status toggle buttons.
 */
export async function updateStatus(id: string, status: string): Promise<void> {
  const validStatuses = ['تم', 'لم يتم'];
  if (!validStatuses.includes(status)) {
    throw new Error('حالة المقترح غير صحيحة');
  }
  await db.suggestions.update(id, { status });
}

/**
 * Remove a suggestion by ID.
 */
export async function remove(id: string): Promise<void> {
  await db.suggestions.delete(id);
}
