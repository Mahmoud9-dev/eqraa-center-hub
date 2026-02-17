'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative touch-target"
      onClick={toggleLanguage}
      aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
      title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <span className="text-xs font-bold">
        {language === 'ar' ? 'EN' : 'AR'}
      </span>
    </Button>
  );
}
