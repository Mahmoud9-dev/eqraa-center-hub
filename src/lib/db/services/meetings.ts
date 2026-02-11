import { db } from '../database';
import type { DbMeeting } from '../types';
import { meetingSchema } from '@/lib/validations';

/**
 * Get all meetings, ordered by meetingDate descending.
 * Used by the Meetings view to display all scheduled meetings.
 */
export async function getAll(): Promise<DbMeeting[]> {
  const results = await db.meetings.toArray();
  results.sort((a, b) => {
    if (a.meetingDate > b.meetingDate) return -1;
    if (a.meetingDate < b.meetingDate) return 1;
    return 0;
  });
  return results;
}

/**
 * Add a new meeting. Generates an ID and createdAt timestamp.
 */
export async function add(
  meeting: Omit<DbMeeting, 'id' | 'createdAt'>
): Promise<DbMeeting> {
  meetingSchema.parse({
    title: meeting.title,
    description: meeting.description,
    meetingDate: meeting.meetingDate,
  });

  const newMeeting: DbMeeting = {
    ...meeting,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await db.meetings.add(newMeeting);
  return newMeeting;
}

/**
 * Update an existing meeting by ID. Validates changed fields with Zod.
 */
export async function update(
  id: string,
  changes: Partial<Omit<DbMeeting, 'id' | 'createdAt'>>
): Promise<void> {
  const validatable: Record<string, unknown> = {};
  if (changes.title !== undefined) validatable.title = changes.title;
  if (changes.description !== undefined) validatable.description = changes.description;
  if (changes.meetingDate !== undefined) validatable.meetingDate = changes.meetingDate;

  if (Object.keys(validatable).length > 0) {
    meetingSchema.partial().parse(validatable);
  }

  await db.meetings.update(id, changes);
}

/**
 * Update only the status field of a meeting.
 * Used by the Meetings view status toggle buttons.
 */
export async function updateStatus(id: string, status: string): Promise<void> {
  const validStatuses = ['مجدولة', 'مكتملة', 'ملغاة'];
  if (!validStatuses.includes(status)) {
    throw new Error('حالة الاجتماع غير صحيحة');
  }
  await db.meetings.update(id, { status });
}

/**
 * Remove a meeting by ID.
 */
export async function remove(id: string): Promise<void> {
  await db.meetings.delete(id);
}

/**
 * Get the count of upcoming meetings (meetingDate >= today with status "scheduled").
 * Used by useHomeStats for the upcoming exams/meetings stat.
 * Note: The original Supabase query filters on status='scheduled',
 * but the app uses Arabic status values. We check for both 'scheduled' and the
 * Arabic equivalent to ensure compatibility.
 */
export async function getUpcomingCount(): Promise<number> {
  const today = new Date().toISOString().split('T')[0];
  const all = await db.meetings.toArray();
  return all.filter((m) => {
    const meetingDateStr = m.meetingDate.split('T')[0];
    const isUpcoming = meetingDateStr >= today;
    const isScheduled =
      m.status === 'scheduled' || m.status === null;
    return isUpcoming && isScheduled;
  }).length;
}
