"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [container] = useState<HTMLDivElement | null>(() =>
    typeof document === "undefined" ? null : document.createElement("div"),
  );

  useEffect(() => {
    if (!container || typeof document === "undefined") {
      return undefined;
    }

    document.body.appendChild(container);

    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.focus();
    }
  }, [open]);

  if (!open || !container) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div
        className="absolute inset-0 bg-slate-900/50"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
        tabIndex={-1}
        className={cn(
          "relative z-10 w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-6 shadow-xl focus:outline-none",
          className,
        )}
      >
        {(title || description) && (
          <div className="space-y-2 pb-4">
            {title ? (
              <h2
                id="modal-title"
                className="text-xl font-semibold text-slate-900"
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p
                id="modal-description"
                className="text-sm text-slate-500"
              >
                {description}
              </p>
            ) : null}
          </div>
        )}
        <div className="space-y-4">{children}</div>
        {footer ? <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">{footer}</div> : null}
      </div>
    </div>,
    container,
  );
}
