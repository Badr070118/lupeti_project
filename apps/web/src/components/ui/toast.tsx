'use client';

import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Toast } from '@/hooks/use-toast';

interface ToastViewportProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function iconByVariant(variant?: Toast['variant']) {
  switch (variant) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    case 'error':
      return <AlertTriangle className="h-4 w-4 text-rose-500" />;
    default:
      return <Info className="h-4 w-4 text-sky-500" />;
  }
}

export const ToastViewport = ({ toasts, onDismiss }: ToastViewportProps) => {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-3 px-4 sm:items-end sm:px-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto w-full max-w-sm rounded-xl border bg-white/95 p-4 shadow-2xl backdrop-blur',
            toast.variant === 'error' && 'border-rose-100',
            toast.variant === 'success' && 'border-emerald-100',
          )}
        >
          <div className="flex items-start gap-3">
            <span className="pt-0.5">{iconByVariant(toast.variant)}</span>
            <div className="flex-1 space-y-1 text-sm">
              <p className="font-semibold text-slate-900">
                {toast.title}
              </p>
              {toast.description ? (
                <p className="text-slate-600">
                  {toast.description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              aria-label="Bildirimi kapat"
              onClick={() => onDismiss(toast.id)}
              className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
