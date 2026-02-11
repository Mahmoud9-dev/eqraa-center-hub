'use client';

import { ArrowRight, LogOut, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth/useAuth";
import { toast } from "sonner";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

const PageHeader = ({ title, showBack = true }: PageHeaderProps) => {
  const router = useRouter();
  const { roles, isAdmin, userName, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    toast.success("تم تسجيل الخروج بنجاح");
    router.push("/login");
  };

  const getRoleLabel = () => {
    if (isAdmin) return "مدير";
    if (roles.includes("teacher")) return "معلم";
    if (roles.includes("student")) return "طالب";
    if (roles.includes("parent")) return "ولي أمر";
    return "مستخدم";
  };

  return (
    <header className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-3 xs:py-4 sm:py-6 md:py-8 shadow-lg relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            {title}
          </h1>
          <div className="flex items-center gap-1 xs:gap-2 md:gap-3">
            <ThemeToggle />
            {userName && (
              <div className="hidden md:flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-lg">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs opacity-75">({getRoleLabel()})</span>
              </div>
            )}
            {/* قائمة متنقلة للهواتف */}
            <div className="md:hidden">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 xs:p-2.5 touch-target"
                aria-label="فتح القائمة"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
            {/* أزرار سطح المكتب */}
            <div className="hidden md:flex items-center gap-2">
              {showBack && (
                <Link href="/">
                  <Button variant="secondary" size="lg" className="gap-2">
                    <ArrowRight className="w-5 h-5" />
                    الرئيسية
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
                <span>خروج</span>
              </Button>
            </div>
          </div>
        </div>

        {/* قائمة جانبية للهواتف */}
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
                    <ArrowRight className="w-4 h-4" />
                    الرئيسية
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
                خروج
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
