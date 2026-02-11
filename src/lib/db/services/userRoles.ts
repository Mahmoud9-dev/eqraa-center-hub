import { db } from '../database';
import type { DbUserRole, AppRole } from '../types';

/**
 * Get all roles for a specific user by userId.
 * Used by the Admin view to check and manage user permissions.
 */
export async function getByUserId(userId: string): Promise<DbUserRole[]> {
  return db.userRoles
    .where('userId')
    .equals(userId)
    .toArray();
}

/**
 * Add a new user role. Generates an ID and createdAt timestamp.
 */
export async function add(
  userRole: Omit<DbUserRole, 'id' | 'createdAt'>
): Promise<DbUserRole> {
  const newRole: DbUserRole = {
    ...userRole,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await db.userRoles.add(newRole);
  return newRole;
}

/**
 * Remove a user role by ID.
 */
export async function remove(id: string): Promise<void> {
  await db.userRoles.delete(id);
}
