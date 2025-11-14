import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { useThemeStore } from "../../stores/theme";

import { cn } from "../../utils/cn";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  const { theme } = useThemeStore();
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-200",
        theme === "dark"
          ? "border border-neon-cyan/20 bg-[#1A1A2E] hover:border-neon-cyan/30"
          : "border border-gray-200 bg-white hover:border-blue-300 hover:shadow-md",
        className
      )}
      {...props}
    >
      <div className="relative z-10">{props.children}</div>
    </div>
  );
});

Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-4 flex flex-col gap-1", className)} {...props} />
  )
);

CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    const { theme } = useThemeStore();
    return (
      <h3
        ref={ref}
        className={cn(
          "text-xl font-bold",
          theme === "dark" ? "text-white" : "text-gray-900",
          className
        )}
        {...props}
      />
    );
  }
);

CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { theme } = useThemeStore();
    return (
      <p
        ref={ref}
        className={cn(
          "text-sm",
          theme === "dark" ? "text-gray-400" : "text-gray-600",
          className
        )}
        {...props}
      />
    );
  }
);

CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />
);

CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-4 flex items-center gap-3", className)} {...props} />
  )
);

CardFooter.displayName = "CardFooter";
