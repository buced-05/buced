import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { useThemeStore } from "../../stores/theme";

import { cn } from "../../utils/cn";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  const { theme } = useThemeStore();

  return (
    <div className="group relative inline-flex w-full">
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none rounded-lg border px-4 py-3 pr-10 text-sm font-bold shadow-lg transition-all duration-300 focus:outline-none",
          theme === "dark"
            ? "border-neon-cyan/20 bg-[#1A1A2E] text-white focus:border-neon-cyan/60 hover:border-neon-cyan/30"
            : "border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:shadow-sm hover:border-gray-400",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <span className={`pointer-events-none absolute inset-y-0 right-4 flex items-center transition-colors duration-300 font-bold ${
        theme === "dark"
          ? "text-neon-cyan group-focus-within:text-neon-purple"
          : "text-gray-500 group-focus-within:text-blue-600"
      }`}>
        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M4 7l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
});

Select.displayName = "Select";
