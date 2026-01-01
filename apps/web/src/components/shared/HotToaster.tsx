'use client';

import { Toaster } from 'react-hot-toast';

export function HotToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: '16px',
          padding: '12px 16px',
          background: 'var(--surface)',
          color: 'var(--text-primary)',
          boxShadow: 'var(--shadow-md)',
        },
      }}
    />
  );
}
