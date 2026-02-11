'use client';

import { useState } from 'react';
import { Building2, ShieldCheck, Mail, User } from 'lucide-react';
import { signUp } from '@/lib/auth/auth-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { toast } from 'sonner';

interface SetupProps {
  onComplete: () => void;
}

export default function Setup({ onComplete }: SetupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('الاسم مطلوب');
      return;
    }

    if (!email.trim()) {
      toast.error('البريد الإلكتروني مطلوب');
      return;
    }

    if (password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('كلمة المرور غير متطابقة');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, name);
      toast.success('تم إنشاء حساب المشرف بنجاح!');
      onComplete();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      toast.error('خطأ في إنشاء الحساب: ' + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto p-4 bg-primary/10 rounded-2xl w-fit">
            <Building2 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            مرحبا بك في معهد فاطمة الزهراء
          </CardTitle>
          <CardDescription className="text-base">
            هذه أول مرة تُشغّل فيها التطبيق. أنشئ حساب المشرف الرئيسي للبدء.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="setup-name">اسم المشرف</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="setup-name"
                  type="text"
                  placeholder="مثال: أحمد محمد"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="setup-email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="setup-email"
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

            <div className="space-y-2">
              <Label htmlFor="setup-password">كلمة المرور</Label>
              <PasswordInput
                id="setup-password"
                placeholder="6 أحرف على الأقل"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="setup-confirm">تأكيد كلمة المرور</Label>
              <PasswordInput
                id="setup-confirm"
                placeholder="أعد كتابة كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
              <ShieldCheck className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
              <p>
                هذا الحساب سيحصل على صلاحية المشرف الكامل.
                بياناتك محفوظة محليا على جهازك فقط ولا تُرسل لأي خادم.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب المشرف والبدء'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
