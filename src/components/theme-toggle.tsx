import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    if (theme === "dark") {
      return <Moon className="h-[1.2rem] w-[1.2rem]" />;
    } else {
      return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  const getLabel = () => {
    if (theme === "dark") return "الوضع الداكن";
    if (theme === "light") return "الوضع الفاتح";
    return "وضع النظام";
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative touch-target"
      onClick={toggleTheme}
      aria-label={getLabel()}
      title={getLabel()}
    >
      <div className="relative h-[1.2rem] w-[1.2rem] transition-all duration-300">
        <Sun
          className={`absolute inset-0 h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
            theme === "dark"
              ? "opacity-0 rotate-90 scale-0"
              : "opacity-100 rotate-0 scale-100"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
            theme === "dark"
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-90 scale-0"
          }`}
        />
      </div>
      <span className="sr-only">تبديل الوضع</span>
    </Button>
  );
}
