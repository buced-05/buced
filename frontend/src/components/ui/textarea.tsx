import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { useThemeStore } from "../../stores/theme";

import { cn } from "../../utils/cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rows = 4, ...props }, ref) => {
    const { theme } = useThemeStore();

    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "w-full rounded-lg border px-4 py-3 text-sm font-medium placeholder:text-gray-500 shadow-lg transition focus:outline-none",
          theme === "dark"
            ? "border-neon-cyan/20 bg-[#1A1A2E] text-white focus:border-neon-cyan/60 hover:border-neon-cyan/30"
            : "border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:shadow-sm hover:border-gray-400",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
