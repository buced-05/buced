import { forwardRef } from "react";
import type { LabelHTMLAttributes } from "react";
import { useThemeStore } from "../../stores/theme";

import { cn } from "../../utils/cn";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    const { theme } = useThemeStore();

    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-semibold mb-2 block",
          theme === "dark" ? "text-white" : "text-gray-900",
          className
        )}
        {...props}
      />
    );
  }
);

Label.displayName = "Label";
