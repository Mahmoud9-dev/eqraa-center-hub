'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showIcon?: boolean;
}

export function PasswordInput({ className, showIcon = true, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

  return (
    // The password input always uses dir="ltr" so text flows LTR regardless of page direction.
    // Physical positioning (end-3 / start-1) is relative to the LTR input container.
    <div className="relative">
      {showIcon && (
        <Lock className="absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      )}
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn(showIcon && 'pe-10 ps-10', className)}
        dir="ltr"
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute start-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? t.auth.signup.hidePassword : t.auth.signup.showPassword}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}
