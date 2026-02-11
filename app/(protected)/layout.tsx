'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, SESSION_KEY } from '@/lib/auth/auth-service';
import { BackupReminder } from '@/components/BackupReminder';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = getSession();

    if (!session) {
      router.replace('/login');
      return;
    }

    setIsAuthenticated(true);
    setIsLoading(false);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === SESSION_KEY) {
        const current = getSession();
        if (!current) {
          router.replace('/login');
        }
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ErrorBoundary>
      <BackupReminder />
      {children}
    </ErrorBoundary>
  );
}
