import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

import { cn } from "../../utils/cn";

export type ToastVariant = "default" | "success" | "error" | "info";

export type ToastOptions = {
  title: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  duration?: number;
};

export type ToastRecord = ToastOptions & {
  id: string;
};

const variantStyles: Record<ToastVariant, string> = {
  default: "border border-neon-cyan/30 bg-[#1A1A2E] text-white",
  success: "border border-neon-green/50 bg-neon-green/10 text-neon-green",
  error: "border border-neon-pink/50 bg-neon-pink/10 text-neon-pink",
  info: "border border-neon-purple/50 bg-neon-purple/10 text-neon-purple",
};

type ToastContainerProps = {
  toasts: ToastRecord[];
  onDismiss: (id: string) => void;
};

export const ToastContainer = ({ toasts, onDismiss }: ToastContainerProps) => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.getElementById("toast-root");
    if (!root) {
      const element = document.createElement("div");
      element.id = "toast-root";
      document.body.appendChild(element);
    }
  }, []);

  if (typeof document === "undefined") {
    return null;
  }

  const container = document.getElementById("toast-root") ?? document.body;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-6 z-[1000] flex flex-col items-center gap-3 px-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>,
    container
  );
};

type ToastProps = {
  toast: ToastRecord;
  onDismiss: (id: string) => void;
};

const Toast = ({ toast, onDismiss }: ToastProps) => {
  useEffect(() => {
    if (toast.duration === 0) return;
    const timeout = window.setTimeout(() => onDismiss(toast.id), toast.duration ?? 4000);
    return () => window.clearTimeout(timeout);
  }, [toast, onDismiss]);

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto w-full max-w-md rounded-xl border px-5 py-4 shadow-neon animate-scale-in",
        variantStyles[toast.variant ?? "default"]
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold leading-none text-white">{toast.title}</p>
          {toast.description ? <p className="text-sm text-gray-400">{toast.description}</p> : null}
        </div>
        <button
          type="button"
          className="text-sm font-medium text-gray-500 hover:text-white transition-colors duration-300"
          onClick={() => onDismiss(toast.id)}
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

