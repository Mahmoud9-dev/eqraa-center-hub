'use client';

import { ArrowRight, ArrowLeft, LogOut, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { getSupabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/LanguageContext";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

const PageHeader = ({ title, showBack = true }: PageHeaderProps) => {
  const router = useRouter();
  const { roles, isAdmin } = useUserRole();
  const { t, isRTL } = useLanguage();
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const [userName, setUserName] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await getSupabase().auth.getUser();
      if (user) {
        setUserName(
          user.user_metadata?.name || user.email?.split("@")[0] || null
        );
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await getSupabase().auth.signOut();
    if (error) {
      toast.error(t.header.logoutError);
    } else {
      toast.success(t.header.logoutSuccess);
      router.push("/login");
    }
  };

  const getRoleLabel = () => {
    if (isAdmin) return t.header.roles.admin;
    if (roles.includes("teacher")) return t.header.roles.teacher;
    if (roles.includes("student")) return t.header.roles.student;
    if (roles.includes("parent")) return t.header.roles.parent;
    return t.header.roles.default;
  };

  return (
    <header className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-3 xs:py-4 sm:py-6 md:py-8 shadow-lg relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            {title}
          </h1>
          <div className="flex items-center gap-1 xs:gap-2 md:gap-3">
            <LanguageToggle />
            <ThemeToggle />
            {userName && (
              <div className="hidden md:flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-lg">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs opacity-75">({getRoleLabel()})</span>
              </div>
            )}
            {/* Mobile menu */}
            <div className="md:hidden">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 xs:p-2.5 touch-target"
                aria-label={t.header.openMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
            {/* Desktop buttons */}
            <div className="hidden md:flex items-center gap-2">
              {showBack && (
                <Link href="/">
                  <Button variant="secondary" size="lg" className="gap-2">
                    <BackArrow className="w-5 h-5" />
                    {t.header.home}
                  </Button>
                </Link>
              )}
              <Button
                variant="secondary"
                size="lg"
                className="gap-2"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>{t.header.logout}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile sidebar menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-primary-foreground/20 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1 xs:space-y-2">
              {userName && (
                <div className="flex items-center gap-2 bg-primary-foreground/10 px-3 py-2 xs:py-2.5 rounded-lg">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{userName}</span>
                  <span className="text-xs opacity-75">({getRoleLabel()})</span>
                </div>
              )}
              {showBack && (
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-start gap-2 py-2.5 xs:py-3 touch-target"
                  >
                    <BackArrow className="w-4 h-4" />
                    {t.header.home}
                  </Button>
                </Link>
              )}
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start gap-2 py-2.5 xs:py-3 touch-target"
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut className="w-4 h-4" />
                {t.header.logout}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
