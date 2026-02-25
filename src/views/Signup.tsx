'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/language-toggle";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(t.auth.signup.passwordMismatch);
      return;
    }

    if (password.length < 6) {
      toast.error(t.auth.signup.passwordTooShort);
      return;
    }

    setLoading(true);

    const { data, error } = await getSupabase().auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      toast.error(`${t.auth.signup.error}: ${error.message}`);
    } else {
      toast.success(t.auth.signup.success);
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      {/* Language toggle - top end corner */}
      <div className="fixed top-4 end-4">
        <LanguageToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t.auth.signup.title}</CardTitle>
          <CardDescription>{t.home.pageTitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.auth.signup.nameLabel}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t.auth.signup.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.signup.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.auth.signup.passwordLabel}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.auth.signup.confirmPasswordLabel}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                dir="ltr"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t.auth.signup.submitting : t.auth.signup.submitButton}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              {t.auth.signup.hasAccount}{" "}
              <Button
                type="button"
                variant="link"
                className="p-0"
                onClick={() => router.push("/login")}
              >
                {t.auth.signup.loginLink}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
