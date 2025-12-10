'use client';

import { useState, useEffect } from 'react';
import PremiumToast from './PremiumToast';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export default function PremiumToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'> & { id?: string }) => {
    const newToast: Toast = {
      id: toast.id || Math.random().toString(36).substr(2, 9),
      message: toast.message,
      type: toast.type,
      duration: toast.duration
    };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expose addToast globally for easy access
  useEffect(() => {
    (window as any).addPremiumToast = addToast;
    
    return () => {
      delete (window as any).addPremiumToast;
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <PremiumToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}