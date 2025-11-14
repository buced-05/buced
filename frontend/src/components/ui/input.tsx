import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { useThemeStore } from "../../stores/theme";

import { cn } from "../../utils/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, startAdornment, endAdornment, ...props }, ref) => {
    const { theme } = useThemeStore();
    
    return (
      <div
        className={cn(
          "group relative inline-flex w-full items-center overflow-hidden rounded-lg border transition-all duration-300",
          theme === "dark"
            ? "border-neon-cyan/20 bg-[#1A1A2E] focus-within:border-neon-cyan/60 hover:border-neon-cyan/30"
            : "border-gray-300 bg-white focus-within:border-blue-500 focus-within:shadow-sm hover:border-gray-400",
          className
        )}
      >
        {startAdornment ? (
          <span className={`pl-4 pr-2 transition-colors duration-300 ${
            theme === "dark" 
              ? "text-neon-cyan group-focus-within:text-neon-purple" 
              : "text-gray-500 group-focus-within:text-blue-600"
          }`}>
            {startAdornment}
          </span>
        ) : null}
        <input
          ref={ref}
          className={cn(
            "flex-1 bg-transparent px-4 py-3 text-sm font-medium placeholder:text-gray-500 focus:outline-none",
            theme === "dark" ? "text-white" : "text-gray-900",
            !startAdornment && "pl-4",
            !endAdornment && "pr-4"
          )}
          {...props}
        />
        {endAdornment ? (
          <span className={`pl-2 pr-4 transition-colors duration-300 ${
            theme === "dark" ? "text-neon-cyan" : "text-gray-500"
          }`}>
            {endAdornment}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
