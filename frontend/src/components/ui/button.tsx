import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { useThemeStore } from "../../stores/theme";

import { cn } from "../../utils/cn";
import { Spinner } from "./spinner";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "neon" | "dark";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

const getVariantClasses = (variant: ButtonVariant, theme: "dark" | "light"): string => {
  if (theme === "light") {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-md transition-all duration-200";
      case "secondary":
        return "bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-md transition-all duration-200";
      case "outline":
        return "border-2 border-blue-600 text-blue-600 bg-transparent font-bold hover:bg-blue-50 hover:text-blue-700 transition-all duration-200";
      case "ghost":
        return "text-blue-600 bg-transparent font-semibold hover:bg-blue-50 hover:text-blue-700 transition-all duration-200";
      case "dark":
        return "bg-gray-800 border-2 border-gray-700 text-white font-bold shadow-md hover:border-blue-500 hover:text-blue-400 transition-all duration-200";
      default:
        return "";
    }
  }

  // Dark theme (default)
  switch (variant) {
    case "primary":
      return "bg-gradient-to-r from-neon-cyan to-neon-purple text-[#0A0A0F] font-bold shadow-neon transition-all duration-200";
    case "secondary":
      return "bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold shadow-neon-purple transition-all duration-200";
    case "outline":
      return "border-2 border-neon-cyan text-neon-cyan bg-transparent font-bold hover:bg-neon-cyan/10 hover:text-neon-cyan transition-all duration-200";
    case "ghost":
      return "text-neon-cyan bg-transparent font-semibold hover:bg-neon-cyan/10 hover:text-neon-cyan transition-all duration-200";
    case "neon":
      return "bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-[#0A0A0F] font-black shadow-neon transition-all duration-200";
    case "dark":
      return "bg-[#0A0A0F] border-2 border-[#1A1A2E] text-white font-bold shadow-lg hover:border-neon-cyan/30 hover:text-neon-cyan transition-all duration-200 relative overflow-hidden group";
    default:
      return "";
  }
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "h-8 px-3 text-xs",
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const { theme } = useThemeStore();

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
          theme === "dark" ? "focus-visible:ring-neon-cyan" : "focus-visible:ring-blue-500",
          getVariantClasses(variant, theme),
          sizeClasses[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {variant === "dark" && theme === "dark" && (
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/10 to-neon-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
        {loading ? (
          <>
            <Spinner size="sm" />
            <span className="opacity-70">Chargement...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
