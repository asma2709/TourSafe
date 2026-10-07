import { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

type ToastType = 'success' | 'error';

interface ToastState {
  message: string;
  type: ToastType;
  id: number;
}

let showToastFn: ((message: string, type?: ToastType) => void) | null = null;

export function toast(message: string, type: ToastType = 'success') {
  showToastFn?.(message, type);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  useEffect(() => {
    showToastFn = (message: string, type: ToastType = 'success') => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { message, type, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
    return () => {
      showToastFn = null;
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-slide-in backdrop-blur-sm ${
            t.type === 'success'
              ? 'bg-purple-950/90 border-purple-700/50 text-purple-200'
              : 'bg-red-950/90 border-red-700/50 text-red-200'
          }`}
        >
          {t.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
          ) : (
            <X className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
