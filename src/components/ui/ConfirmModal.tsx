"use client";

import React, { useEffect } from "react";
import { Button } from "./button";
import { AlertTriangle, AlertCircle, Info, X, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Onayla",
  cancelText = "Vazgeç",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const isDanger = variant === "danger";
  const isWarning = variant === "warning";

  const iconBgColor = isDanger
    ? "bg-rose-50 text-rose-600 border-rose-200/80"
    : isWarning
    ? "bg-amber-50 text-amber-600 border-amber-200/80"
    : "bg-blue-50 text-blue-600 border-blue-200/80";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
      onClick={() => {
        if (!isLoading) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md bg-card rounded-2xl border border-border shadow-xl overflow-hidden p-6 sm:p-7 space-y-5 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${iconBgColor}`}
          >
            {isDanger ? (
              <AlertCircle className="w-6 h-6" />
            ) : isWarning ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <Info className="w-6 h-6" />
            )}
          </div>
          <div className="space-y-1 flex-1 min-w-0 pr-6">
            <h3
              id="confirm-modal-title"
              className="text-base sm:text-lg font-bold text-foreground leading-snug font-sans"
            >
              {title}
            </h3>
            <p
              id="confirm-modal-description"
              className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed"
            >
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Kapat"
            className="absolute top-5 right-5 text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl font-semibold"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={isDanger ? "destructive" : isWarning ? "default" : "brand"}
            size="default"
            onClick={() => {
              void onConfirm();
            }}
            disabled={isLoading}
            className="rounded-xl font-semibold shadow-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                İşlem Yapılıyor...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
