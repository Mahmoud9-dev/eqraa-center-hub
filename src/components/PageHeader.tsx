import { ArrowRight, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

const PageHeader = ({ title, showBack = true }: PageHeaderProps) => {
  const navigate = useNavigate();
  const { roles, isAdmin } = useUserRole();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.name || user.email?.split('@')[0] || 'مستخدم');
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("خطأ في تسجيل الخروج");
    } else {
      toast.success("تم تسجيل الخروج بنجاح");
      navigate("/login");
    }
  };

  const getRoleLabel = () => {
    if (isAdmin) return "مدير";
    if (roles.includes('teacher')) return "معلم";
    if (roles.includes('student')) return "طالب";
    if (roles.includes('parent')) return "ولي أمر";
    return "مستخدم";
  };

  return (
    <header className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-8 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
          <div className="flex items-center gap-3">
            {userName && (
              <div className="hidden md:flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-lg">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs opacity-75">({getRoleLabel()})</span>
              </div>
            )}
            {showBack && (
              <Link to="/">
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
              <span className="hidden md:inline">خروج</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
