'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Building2 } from 'lucide-react';
import { getSupabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

import { LoginLeftPanel } from '@/components/auth/LoginLeftPanel';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { LanguageToggle } from '@/components/language-toggle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await getSupabase().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(`${t.auth.login.error}: ${error.message}`);
    } else {
      toast.success(t.auth.login.success);
      router.push('/');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-row-reverse">
      {/* Form panel - visually on the left in RTL */}
      <div className="flex-1 lg:w-1/2 flex flex-col bg-background">
        {/* Language toggle - top end corner */}
        <div className="flex justify-end p-4">
          <LanguageToggle />
        </div>

        {/* Mobile logo - visible only on small screens */}
        <div className="lg:hidden flex items-center justify-center gap-3 py-8">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {t.home.pageTitle}
            </h1>
          </div>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                {t.auth.login.welcome}
              </h2>
              <p className="text-muted-foreground">{t.auth.login.subtitle}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email">{t.auth.login.emailLabel}</Label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.auth.login.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    dir="ltr"
                    className="ps-10 text-start"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <Label htmlFor="password">{t.auth.login.passwordLabel}</Label>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal cursor-pointer"
                  >
                    {t.auth.login.rememberMe}
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-sm text-primary"
                >
                  {t.auth.login.forgotPassword}
                </Button>
              </div>

              {/* Sign in button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? t.auth.login.submitting : t.auth.login.submitButton}
              </Button>
            </form>

            {/* Create account link */}
            <div className="text-center text-sm text-muted-foreground">
              {t.auth.login.noAccount}{' '}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => router.push('/signup')}
              >
                {t.auth.login.signupLink}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative panel - visually on the right in RTL */}
      <LoginLeftPanel />
    </div>
  );
}
