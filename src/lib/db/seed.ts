import { db } from './database';

/**
 * Check if the database has any users.
 * Used to determine if the app should show the first-run setup wizard.
 * No default credentials are ever seeded — the user creates their own
 * admin account on first launch.
 */
export async function isDatabaseEmpty(): Promise<boolean> {
  const userCount = await db.users.count();
  return userCount === 0;
}
