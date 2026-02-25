'use client';

import { Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function LoginLeftPanel() {
  const { t } = useLanguage();

  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      {/* Background with Islamic pattern */}
      <div className="absolute inset-0 islamic-pattern-bg" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 auth-gradient-overlay" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between p-10 xl:p-12 text-white w-full">
        {/* Logo and branding */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-lg font-bold">{t.auth.branding.appName}</h1>
          </div>
        </div>

        {/* Marketing copy */}
        <div className="max-w-lg">
          <p className="text-2xl xl:text-3xl font-light leading-relaxed">
            {t.auth.branding.tagline}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-1 text-sm text-white/60">
          <span>{t.auth.branding.copyright.replace('{year}', String(new Date().getFullYear()))}</span>
          <span>{t.auth.branding.allRightsReserved}</span>
        </div>
      </div>
    </div>
  );
}
