'use client';

import { useState, useEffect } from 'react';
import { HardDriveDownload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  shouldShowBackupReminder,
  dismissBackupReminder,
  exportDatabase,
} from '@/lib/db/import-export';
import { toast } from 'sonner';

export function BackupReminder() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(shouldShowBackupReminder());
  }, []);

  if (!visible) return null;

  const handleBackup = async () => {
    try {
      await exportDatabase();
      toast.success('تم تصدير النسخة الاحتياطية بنجاح');
      setVisible(false);
    } catch {
      toast.error('حدث خطأ أثناء تصدير النسخة الاحتياطية');
    }
  };

  const handleDismiss = () => {
    dismissBackupReminder();
    setVisible(false);
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between gap-3 text-sm text-amber-900 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-200">
      <div className="flex items-center gap-2">
        <HardDriveDownload className="h-4 w-4 shrink-0" />
        <span>
          بياناتك محفوظة في المتصفح فقط. ننصحك بأخذ نسخة احتياطية بشكل دوري.
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900"
          onClick={handleBackup}
        >
          نسخ احتياطي الآن
        </Button>
        <button
          onClick={handleDismiss}
          className="p-1 rounded-md hover:bg-amber-200/60 dark:hover:bg-amber-800/60"
          aria-label="إغلاق التنبيه"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
