'use client';

import { PropsWithChildren, useCallback, useState } from 'react';
import {
  ToastContext,
  type Toast,
  type ToastContextValue,
} from '@/hooks/use-toast';

const generateId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
import { ToastViewport } from '@/components/ui/toast';

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback<ToastContextValue['showToast']>(
    (toast) => {
      const id = generateId();
      setToasts((current) => [...current, { ...toast, id }]);

      if (toast.duration !== 0) {
        const timeout = setTimeout(() => dismissToast(id), toast.duration ?? 4500);
        return () => clearTimeout(timeout);
      }
      return undefined;
    },
    [dismissToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}
