"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "destructive";

export type ToastOptions = {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastMessage = ToastOptions & { id: string };

type ToastContextValue = {
  toasts: ToastMessage[];
  toast: (options: ToastOptions) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = options.id ?? `${Date.now()}-${Math.random()}`;
      const duration = options.duration ?? 4000;

      setToasts((previous) => [...previous, { ...options, id }]);

      setTimeout(() => {
        dismiss(id);
      }, duration);
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      toasts,
      toast,
      dismiss,
    }),
    [dismiss, toast, toasts],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
}

function useToastContext() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}

export function useToast() {
  const { toast, dismiss } = useToastContext();
  return { toast, dismiss };
}

export function ToastViewport() {
  const { toasts, dismiss } = useToastContext();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-3 px-4 sm:items-end sm:px-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-xl",
            toast.variant === "destructive"
              ? "border-red-200 bg-red-50 text-red-700"
              : "text-slate-800",
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-1">
              {toast.title ? (
                <p className="text-sm font-semibold">{toast.title}</p>
              ) : null}
              {toast.description ? (
                <p className="text-sm text-slate-600">{toast.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Dismiss notification"
            >
              <span className="sr-only">Dismiss</span>
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
