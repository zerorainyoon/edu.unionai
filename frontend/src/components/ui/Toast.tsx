import React, { createContext, useContext, useState, useCallback } from 'react';
import { BellRing, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
}

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message }]);
    
    // Automatically remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-slate-900/95 backdrop-blur text-white px-4 py-3.5 rounded-xl shadow-2xl border border-slate-800 flex items-start justify-between gap-3 animate-slide-in-right select-none"
          >
            <div className="flex gap-3 items-center">
              <div className="bg-brand-secondary/20 p-2 rounded-lg text-brand-accent">
                <BellRing size={18} />
              </div>
              <p className="text-sm font-medium tracking-wide">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
