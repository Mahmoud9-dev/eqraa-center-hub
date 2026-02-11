'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSession, signOut as authSignOut } from './auth-service';
import { SESSION_KEY } from './auth-service';
import type { AuthSession, AppRole } from '@/lib/db/types';

/**
 * React hook for local authentication - replaces useUserRole.
 *
 * - Loads the session from localStorage on mount.
 * - Listens to the 'storage' event for multi-tab session sync.
 * - Exposes authentication state and role helpers.
 */
export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(() => {
    const current = getSession();
    setSession(current);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Load session on mount
    loadSession();

    // Listen to storage events for multi-tab support
    const handleStorage = (event: StorageEvent) => {
      if (event.key === SESSION_KEY) {
        loadSession();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [loadSession]);

  const isAuthenticated = session !== null;
  const roles = session?.roles ?? [];
  const userName = session?.name ?? null;

  const hasRole = useCallback(
    (role: AppRole): boolean => {
      return roles.includes(role);
    },
    [roles],
  );

  const isAdmin = roles.includes('admin');
  const isTeacher = roles.includes('teacher');

  const handleSignOut = useCallback(() => {
    authSignOut();
    setSession(null);
  }, []);

  return {
    session,
    loading,
    isAuthenticated,
    roles,
    isAdmin,
    isTeacher,
    hasRole,
    signOut: handleSignOut,
    userName,
  };
}
