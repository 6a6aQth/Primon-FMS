import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "brass" | "danger";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-primon-800 text-white hover:bg-primon-900 shadow-card disabled:bg-primon-300",
  secondary:
    "bg-white text-primon-800 border border-border hover:border-primon-300 hover:bg-primon-50",
  ghost: "text-primon-700 hover:bg-primon-50",
  brass:
    "bg-brass-500 text-white hover:bg-brass-600 shadow-card disabled:bg-brass-200",
  danger:
    "bg-status-critical text-white hover:bg-status-critical/90 disabled:bg-status-critical/40",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-[15px] rounded-lg gap-2",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-150 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
