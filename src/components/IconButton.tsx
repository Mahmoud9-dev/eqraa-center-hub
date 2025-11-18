import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconButtonProps {
  to?: string;
  href?: string;
  icon: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  "aria-label"?: string;
}

const IconButton = ({
  to,
  href,
  icon,
  label,
  onClick,
  disabled = false,
  loading = false,
  className,
  "aria-label": ariaLabel,
}: IconButtonProps) => {
  const baseClasses =
    "group relative flex flex-col items-center justify-center p-8 bg-card rounded-2xl border-2 border-border hover:border-primary transition-all duration-300 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] hover:scale-105";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  const loadingClasses = loading ? "opacity-75 cursor-wait" : "";

  const content = (
    <div
      className={cn(baseClasses, disabledClasses, loadingClasses, className)}
    >
      <div className="text-7xl mb-4 transition-transform duration-300 group-hover:scale-110">
        {loading ? "⏳" : icon}
      </div>
      <h2 className="text-xl font-semibold text-foreground text-center">
        {label}
      </h2>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );

  // If it's a link (either to or href is provided)
  if (to || href) {
    const linkProps = {
      to: to || href,
      "aria-label": ariaLabel || label,
      ...(disabled && { "aria-disabled": true, tabIndex: -1 }),
      ...(loading && { "aria-busy": true }),
    };

    return <Link {...linkProps}>{content}</Link>;
  }

  // If it's a button
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel || label}
      aria-busy={loading}
      aria-disabled={disabled}
      className={cn(
        "border-none bg-transparent cursor-pointer",
        disabled && "cursor-not-allowed"
      )}
    >
      {content}
    </button>
  );
};

export default IconButton;
