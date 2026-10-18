import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X, 
  BellRing
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationToast = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isDanger = toast.type === 'danger';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl backdrop-blur-xl border transition-all duration-300 transform translate-y-0 animate-slide-up ${
              isSuccess 
                ? 'bg-white border-emerald-200 shadow-emerald-900/5'
                : isDanger
                ? 'bg-white border-rose-200 shadow-rose-900/5'
                : isWarning
                ? 'bg-white border-amber-200 shadow-amber-900/5'
                : 'bg-white border-slate-200 shadow-slate-900/5'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="mt-0.5 shrink-0">
                {isSuccess && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                {isDanger && (
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-sm">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
                {isWarning && (
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-sm">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
                {!isSuccess && !isDanger && !isWarning && (
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 shadow-sm">
                    <Info className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-slate-900 tracking-tight truncate">
                    {toast.title}
                  </span>
                  {toast.roleTag && (
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 tracking-wider">
                      {toast.roleTag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-snug font-normal">
                  {toast.message}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 p-1 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
