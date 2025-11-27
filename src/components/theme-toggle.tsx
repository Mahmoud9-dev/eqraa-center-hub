import * as React from "react";
import { Moon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const getIcon = () => {
    if (theme === "dark") {
      return <Moon className="h-[1.2rem] w-[1.2rem]" />;
    } else {
      return <img src="/sun.svg" alt="" className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  const getLabel = () => {
    return theme === "dark" ? "الوضع الداكن" : "الوضع الفاتح";
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
      <div className="relative flex items-center justify-center h-[1.2rem] w-[1.2rem]">
        <img
          src="/sun.svg"
          alt=""
          className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
            theme === "dark"
              ? "opacity-0 rotate-90 scale-0"
              : "opacity-100 rotate-0 scale-100"
          }`}
        />
        <Moon
          className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
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
