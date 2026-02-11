'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { useState, useCallback } from 'react';
import { useDbInit } from '@/hooks/useDbInit';
import Setup from '@/views/Setup';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const { ready, needsSetup, error } = useDbInit();
  const [setupComplete, setSetupComplete] = useState(false);

  const handleSetupComplete = useCallback(() => {
    setSetupComplete(true);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">خطأ في قاعدة البيانات</h1>
          <p className="text-muted-foreground">
            تعذّر الوصول إلى قاعدة البيانات المحلية. تأكد من أن المتصفح يسمح بتخزين البيانات المحلية (IndexedDB).
          </p>
          <p className="text-sm text-muted-foreground font-mono">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  // Wrap everything in theme + toasts so the setup wizard can use them
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {needsSetup && !setupComplete ? (
            <Setup onComplete={handleSetupComplete} />
          ) : (
            children
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
