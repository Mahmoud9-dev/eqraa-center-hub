'use client';

import { useState, useEffect } from 'react';
import { isDatabaseEmpty } from '@/lib/db/seed';

interface DbInitState {
  ready: boolean;
  needsSetup: boolean;
  error: Error | null;
}

/**
 * Hook that checks the database state on mount.
 * - Returns `ready: true` once the check completes.
 * - Returns `needsSetup: true` if the users table is empty,
 *   meaning the first-run setup wizard should be shown.
 * - Returns `error` if the database cannot be accessed.
 */
export function useDbInit(): DbInitState {
  const [state, setState] = useState<DbInitState>({
    ready: false,
    needsSetup: false,
    error: null,
  });

  useEffect(() => {
    isDatabaseEmpty()
      .then((empty) => {
        setState({ ready: true, needsSetup: empty, error: null });
      })
      .catch((error) => {
        console.error('Database initialization check failed:', error);
        setState({ ready: true, needsSetup: false, error: error instanceof Error ? error : new Error(String(error)) });
      });
  }, []);

  return state;
}
