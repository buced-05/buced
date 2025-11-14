import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

import { cn } from "../../utils/cn";

type BadgeVariant = "default" | "success" | "warning" | "neutral" | "outline" | "primary" | "secondary";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[#2A2A3E] text-neon-cyan border border-neon-cyan/30",
  primary: "bg-gradient-to-r from-neon-cyan to-neon-purple text-[#0A0A0F] font-bold",
  secondary: "bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold",
  success: "bg-neon-green/20 text-neon-green border border-neon-green/30",
  warning: "bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/30",
  neutral: "bg-[#2A2A3E] text-gray-400 border border-gray-700",
  outline: "border border-neon-cyan text-neon-cyan bg-transparent",
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all duration-300",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
);

Badge.displayName = "Badge";

