import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Building2, 
  Send,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const CompanyReviewTimeline = ({ history = [], currentStatus }) => {
  if (!history || history.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
        No verification events recorded yet.
      </div>
    );
  }

  const getEventIcon = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('verified') || s.includes('confirmed')) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    }
    if (s.includes('rejected')) {
      return <AlertCircle className="w-4 h-4 text-rose-600" />;
    }
    if (s.includes('company review') || s.includes('sent')) {
      return <Building2 className="w-4 h-4 text-purple-600" />;
    }
    if (s.includes('additional')) {
      return <Clock className="w-4 h-4 text-sky-600" />;
    }
    return <Clock className="w-4 h-4 text-amber-600" />;
  };

  return (
    <div className="space-y-4">
      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {history.map((event, idx) => {
          const dateStr = event.timestamp ? new Date(event.timestamp).toLocaleString() : 'Recent';
          
          return (
            <div key={idx} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-slate-300 group-hover:border-brand-500 flex items-center justify-center transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-brand-500" />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getEventIcon(event.resultStatus)}
                    <span className="font-bold text-xs text-slate-900">
                      {event.resultStatus || 'Status Transition'}
                    </span>
                    <Badge status={event.resultStatus} size="xs" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {dateStr}
                  </span>
                </div>

                {event.sourceChecked && (
                  <p className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Source:</span> {event.sourceChecked}
                  </p>
                )}

                {event.evidenceNotes && (
                  <p className="text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-100">
                    {event.evidenceNotes}
                  </p>
                )}

                {event.rejectionReason && (
                  <p className="text-xs font-semibold text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                    Rejection Reason: {event.rejectionReason}
                  </p>
                )}

                {event.adapterType && (
                  <div className="flex items-center gap-2 pt-0.5 text-[10px] font-mono text-slate-400">
                    <span>Engine: {event.engineVersion || 'SkillChain-Protocol-v2'}</span>
                    <span>•</span>
                    <span>Adapter: {event.adapterType}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

