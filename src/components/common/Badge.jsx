import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  XCircle, 
  AlertCircle, 
  HelpCircle, 
  Building2, 
  Info,
  CheckCircle2
} from 'lucide-react';

export const Badge = ({ status, variant, children, size = 'sm', icon = true }) => {
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  // Status mapping
  if (status) {
    const s = status.toLowerCase().trim();

    if (s === 'verified') {
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs ${sizeClasses[size]}`}>
          {icon && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
          <span>Verified</span>
        </span>
      );
    }

    if (s === 'company confirmed' || s === 'approved') {
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 shadow-xs ${sizeClasses[size]}`}>
          {icon && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
          <span>Company Confirmed</span>
        </span>
      );
    }

    if (s === 'pending automatic verification' || s === 'pending') {
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shadow-xs ${sizeClasses[size]}`}>
          {icon && <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />}
          <span>Pending Auto-Verification</span>
        </span>
      );
    }

    if (s === 'pending company review') {
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200/80 shadow-xs ${sizeClasses[size]}`}>
          {icon && <Building2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
          <span>Pending Company Review</span>
        </span>
      );
    }

    if (s === 'unable to verify') {
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-300 shadow-xs ${sizeClasses[size]}`}>
          {icon && <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
          <span>Unable to Verify</span>
        </span>
      );
    }

    if (s === 'rejected') {
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs ${sizeClasses[size]}`}>
          {icon && <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
          <span>Auto Rejected</span>
        </span>
      );
    }

    if (s === 'company rejected') {
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-rose-100 text-rose-800 border border-rose-300 shadow-xs ${sizeClasses[size]}`}>
          {icon && <AlertCircle className="w-3.5 h-3.5 text-rose-700 shrink-0" />}
          <span>Company Rejected</span>
        </span>
      );
    }

    if (s === 'additional information required') {
      return (
        <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 shadow-xs ${sizeClasses[size]}`}>
          {icon && <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
          <span>Info Required</span>
        </span>
      );
    }
  }

  // Variant mapping
  const variantStyles = {
    primary: 'bg-brand-50 text-brand-700 border-brand-200',
    purple: 'bg-accent-50 text-accent-700 border-accent-200',
    navy: 'bg-slate-100 text-slate-800 border-slate-200',
    outline: 'bg-white text-slate-700 border-slate-200',
    gold: 'bg-amber-50 text-amber-800 border-amber-200'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variantStyles[variant] || variantStyles.primary} ${sizeClasses[size]}`}>
      {children}
    </span>
  );
};
