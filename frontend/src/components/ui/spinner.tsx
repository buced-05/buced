import { cn } from "../../utils/cn";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-3",
};

export const Spinner = ({ size = "md", className }: SpinnerProps) => (
  <div
    className={cn(
      "animate-spin rounded-full border-solid border-neon-cyan border-t-transparent",
      sizeClasses[size],
      className
    )}
    role="status"
    aria-label="Chargement"
  >
    <span className="sr-only">Chargement...</span>
  </div>
);

