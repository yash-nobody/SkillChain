import React, { useState } from 'react';
import { ShieldCheck, Hash, Calendar, Award, Send, Building2, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

export const CertificateCard = ({ 
  certificate, 
  onViewDetails, 
  onVerifyNow, 
  onSendToCompany 
}) => {
  const [imgError, setImgError] = useState(false);

  const status = certificate.status || 'Pending Automatic Verification';
  const canSend = [
    'Unable to Verify', 
    'Rejected', 
    'Additional Information Required'
  ].includes(status) && !certificate.companySharing?.sharedWithCompany;

  const isCompanyPending = status === 'Pending Company Review';

  return (
    <div className="group relative bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-premium hover:border-brand-300 transition-all duration-200 flex flex-col justify-between">
      {/* Top row: Issuer logo & Status badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              {certificate.issuerLogo && !imgError ? (
                <img
                  src={certificate.issuerLogo}
                  alt={certificate.issuer}
                  className="w-full h-full object-contain rounded-lg"
                  onError={() => setImgError(true)}
                />
              ) : (
                <Award className="w-6 h-6 text-brand-600" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide truncate max-w-[160px]">
                {certificate.issuer}
              </p>
              <span className="text-[11px] text-slate-400">
                {certificate.credentialType || 'Credential'}
              </span>
            </div>
          </div>

          <Badge status={status} />
        </div>

        {/* Certificate Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug mb-2">
          {certificate.title}
        </h3>

        {/* Grade / Distinction */}
        {certificate.grade && (
          <p className="text-xs font-medium text-slate-600 mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            <span>{certificate.grade}</span>
          </p>
        )}

        {/* Status Callout if actionable */}
        {canSend && (
          <div className="mb-3 p-2.5 rounded-xl bg-purple-50/80 border border-purple-200 flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-purple-900 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              Direct Company Audit Available
            </span>
            {onSendToCompany && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSendToCompany(certificate);
                }}
                className="px-2.5 py-1 text-[11px] font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Send</span>
              </button>
            )}
          </div>
        )}

        {isCompanyPending && (
          <div className="mb-3 p-2 rounded-xl bg-purple-50 border border-purple-200 text-[11px] text-purple-800 flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            <span>Sent to {certificate.companySharing?.targetCompanyName || 'Company'} for review</span>
          </div>
        )}

        {/* Skills Acquired Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {certificate.skills?.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
            >
              {skill}
            </span>
          ))}
          {certificate.skills?.length > 4 && (
            <span className="px-1.5 py-0.5 rounded-md text-[11px] font-medium text-slate-400 bg-slate-50">
              +{certificate.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Metadata & Action Buttons */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Issued: {certificate.issueDate}</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400" title={certificate.id}>
            <Hash className="w-3 h-3" />
            <span>{certificate.id.slice(0, 12)}...</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(certificate)}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center cursor-pointer"
          >
            Inspect Credential
          </button>
          <button
            onClick={() => onVerifyNow(certificate)}
            className="py-2 px-3 rounded-xl text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-200/80 transition-colors flex items-center gap-1 cursor-pointer"
            title="Verify Ledger Proof"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Verify</span>
          </button>
        </div>
      </div>
    </div>
  );
};
