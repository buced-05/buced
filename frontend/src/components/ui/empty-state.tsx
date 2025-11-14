import type { ReactNode } from "react";

import { cn } from "../../utils/cn";
import { Button } from "./button";

export type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export const EmptyState = ({ icon, title, description, actionLabel, onAction, className }: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-neon-cyan/30 bg-[#1A1A2E] px-6 py-10 text-center text-gray-400 shadow-inner",
      className
    )}
  >
    {icon ? <div className="text-3xl text-neon-cyan">{icon}</div> : null}
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    {description ? <p className="text-sm max-w-md text-gray-400">{description}</p> : null}
    {actionLabel ? (
      <Button variant="primary" size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    ) : null}
  </div>
);

