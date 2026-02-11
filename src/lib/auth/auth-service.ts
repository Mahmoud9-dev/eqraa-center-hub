import { db } from '@/lib/db/database';
import type { AuthSession, AppRole } from '@/lib/db/types';

export const SESSION_KEY = 'eqraa_session';

const PBKDF2_ITERATIONS = 100_000;
const SALT_BYTES = 16;
const HASH_BYTES = 32;

// ── Helpers ──────────────────────────────────────────────────

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuf(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// ── Password hashing (PBKDF2) ───────────────────────────────

/**
 * Hash a password with PBKDF2 using a random 16-byte salt.
 * Returns a string of the form "pbkdf2:<iterations>:<salt_hex>:<hash_hex>".
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const hashBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt.buffer as ArrayBuffer, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    HASH_BYTES * 8,
  );
  return `pbkdf2:${PBKDF2_ITERATIONS}:${bufToHex(salt.buffer as ArrayBuffer)}:${bufToHex(hashBits)}`;
}

/**
 * Verify a password against a stored hash.
 * Supports both the new PBKDF2 format and the legacy bare SHA-256 hex format.
 */
async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  if (storedHash.startsWith('pbkdf2:')) {
    const [, iterStr, saltHex, hashHex] = storedHash.split(':');
    const iterations = parseInt(iterStr, 10);
    const salt = hexToBuf(saltHex);
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits'],
    );
    const hashBits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: salt.buffer as ArrayBuffer, iterations, hash: 'SHA-256' },
      keyMaterial,
      HASH_BYTES * 8,
    );
    return bufToHex(hashBits) === hashHex;
  }

  // Legacy: bare SHA-256 hex string
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bufToHex(hashBuffer) === storedHash;
}

// ── Session helpers ──────────────────────────────────────────

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

interface StoredSession extends AuthSession {
  expiresAt: number;
}

function saveSession(session: AuthSession): void {
  const stored: StoredSession = {
    ...session,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(stored));
}

// ── Public API ───────────────────────────────────────────────

/**
 * Register a new user.
 * - Checks if the email is already registered.
 * - Hashes the password with PBKDF2.
 * - Auto-assigns 'admin' role if this is the first user, otherwise 'viewer'.
 * - Saves session and returns it.
 */
export async function signUp(
  email: string,
  password: string,
  name: string,
): Promise<AuthSession> {
  const existing = await db.users.where('email').equals(email).first();
  if (existing) {
    throw new Error('البريد الإلكتروني مسجل بالفعل');
  }

  const passwordHash = await hashPassword(password);
  const userId = crypto.randomUUID();
  const now = new Date().toISOString();

  const userCount = await db.users.count();
  const role: AppRole = userCount === 0 ? 'admin' : 'viewer';

  await db.users.add({
    id: userId,
    email,
    name,
    passwordHash,
    createdAt: now,
  });

  await db.userRoles.add({
    id: crypto.randomUUID(),
    userId,
    role,
    createdAt: now,
  });

  const session: AuthSession = { userId, email, name, roles: [role] };
  saveSession(session);
  return session;
}

/**
 * Sign in an existing user.
 * - Verifies the password (supports both PBKDF2 and legacy SHA-256).
 * - If the stored hash is legacy SHA-256, transparently re-hashes with PBKDF2.
 * - Saves session and returns it.
 */
export async function signIn(
  email: string,
  password: string,
): Promise<AuthSession> {
  const user = await db.users.where('email').equals(email).first();
  if (!user) {
    throw new Error('بيانات الدخول غير صحيحة');
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new Error('بيانات الدخول غير صحيحة');
  }

  // Transparent migration: re-hash legacy SHA-256 passwords with PBKDF2
  if (!user.passwordHash.startsWith('pbkdf2:')) {
    const newHash = await hashPassword(password);
    await db.users.update(user.id, { passwordHash: newHash });
  }

  const roleRecords = await db.userRoles
    .where('userId')
    .equals(user.id)
    .toArray();
  const roles: AppRole[] = roleRecords.map((r) => r.role);

  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    roles,
  };
  saveSession(session);
  return session;
}

/**
 * Sign out the current user by removing the session from localStorage.
 */
export function signOut(): void {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Retrieve the current session from localStorage.
 * Returns null if no session exists, data is invalid, or the session has expired.
 */
export function getSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const stored: StoredSession = JSON.parse(raw);

    // Check session expiration
    if (stored.expiresAt && Date.now() > stored.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return {
      userId: stored.userId,
      email: stored.email,
      name: stored.name,
      roles: stored.roles,
    };
  } catch {
    return null;
  }
}

/**
 * Alias for getSession().
 */
export function getUser(): AuthSession | null {
  return getSession();
}
