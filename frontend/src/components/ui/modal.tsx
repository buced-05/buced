import { Fragment, useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useThemeStore } from "../../stores/theme";

import { cn } from "../../utils/cn";
import { Button } from "./button";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  size?: "sm" | "md" | "lg";
};

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

export const Modal = ({ open, onClose, title, description, children, actions, size = "md" }: ModalProps) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (typeof document === "undefined" || !open) {
    return null;
  }

  return createPortal(
    <Fragment>
      <div
        className={`fixed inset-0 z-40 transition-opacity animate-fade-in ${
          theme === "dark" ? "bg-[#0A0A0F]/80" : "bg-black/50"
        }`}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4 sm:py-10 animate-fade-in pointer-events-none overflow-y-auto">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "relative w-full rounded-xl sm:rounded-2xl border p-4 sm:p-8 shadow-lg animate-scale-in overflow-hidden pointer-events-auto my-auto",
            theme === "dark"
              ? "border-neon-cyan/30 bg-[#1A1A2E]"
              : "border-gray-300 bg-white shadow-xl",
            sizeClasses[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`absolute top-0 left-0 h-1 w-full ${
            theme === "dark"
              ? "bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink"
              : "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
          }`} />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                {title ? (
                  <h2 className={cn(
                    "text-xl sm:text-2xl lg:text-3xl font-black truncate",
                    theme === "dark" ? "gradient-text" : "text-gray-900"
                  )}>{title}</h2>
                ) : null}
                {description ? (
                  <p className={cn(
                    "text-sm sm:text-base font-medium leading-relaxed",
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  )}>{description}</p>
                ) : null}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Fermer"
                className={cn(
                  "rounded-full h-8 w-8 sm:h-10 sm:w-10 p-0 flex-shrink-0",
                  theme === "dark"
                    ? "hover:bg-neon-cyan/20 hover:text-neon-cyan"
                    : "hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
            <div className="mt-4 sm:mt-6">{children}</div>
            {actions ? <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">{actions}</div> : null}
          </div>
        </div>
      </div>
    </Fragment>,
    document.body
  );
};
