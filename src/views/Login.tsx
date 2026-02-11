'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Building2 } from 'lucide-react';
import { signIn } from '@/lib/auth/auth-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { LoginLeftPanel } from '@/components/auth/LoginLeftPanel';
import { PasswordInput } from '@/components/auth/PasswordInput';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success('تم تسجيل الدخول بنجاح');
      router.push('/');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      toast.error('خطأ في تسجيل الدخول: ' + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-row-reverse">
      {/* Form panel - visually on the left in RTL */}
      <div className="flex-1 lg:w-1/2 flex flex-col bg-background">
        {/* Mobile logo - visible only on small screens */}
        <div className="lg:hidden flex items-center justify-center gap-3 py-8">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              معهد فاطمة الزهراء
            </h1>
          </div>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                مرحباً بعودتك
              </h2>
              <p className="text-muted-foreground">أدخل بياناتك للوصول إلى حسابك</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    dir="ltr"
                    className="pl-10 text-left"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Sign in button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>

            {/* Create account link */}
            <div className="text-center text-sm text-muted-foreground">
              ليس لديك حساب؟{' '}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => router.push('/signup')}
              >
                إنشاء حساب جديد
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
