import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface IconButtonProps {
  to: string;
  icon: string;
  label: string;
}

const IconButton = ({ to, icon, label }: IconButtonProps) => {
  return (
    <Link to={to}>
      <div className="group relative flex flex-col items-center justify-center p-8 bg-card rounded-2xl border-2 border-border hover:border-primary transition-all duration-300 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] hover:scale-105">
        <div className="text-7xl mb-4 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-foreground text-center">
          {label}
        </h2>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </Link>
  );
};

export default IconButton;
