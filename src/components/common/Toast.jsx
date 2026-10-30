import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';

export const Toast = () => {
  const { toast, showToast } = useSkillChain();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-500 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-200 bg-white text-emerald-950 ring-1 ring-emerald-500/10',
    error: 'border-rose-200 bg-white text-rose-950 ring-1 ring-rose-500/10',
    info: 'border-brand-200 bg-white text-brand-950 ring-1 ring-brand-500/10'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-premium max-w-md ${borders[toast.type] || borders.info}`}>
        {icons[toast.type] || icons.info}
        <p className="text-xs sm:text-sm font-semibold">{toast.message}</p>
        <button
          onClick={() => showToast('', '', 0)}
          aria-label="Dismiss toast"
          className="ml-auto text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
