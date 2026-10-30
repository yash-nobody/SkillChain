import React from 'react';
import { 
  ShieldCheck, 
  AlertCircle, 
  HelpCircle, 
  Building2, 
  CheckCircle2, 
  Send, 
  Clock, 
  Info,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const VerificationStatusPanel = ({ 
  certificate, 
  onSendToCompany, 
  onViewHistory 
}) => {
  if (!certificate) return null;

  const status = certificate.status || 'Pending Automatic Verification';
  const evidence = certificate.autoVerificationEvidence || {};
  const sharing = certificate.companySharing || {};

  const canSendToCompany = [
    'Unable to Verify', 
    'Rejected', 
    'Additional Information Required'
  ].includes(status) && !sharing.sharedWithCompany;

  const isCompanyPending = status === 'Pending Company Review';
  const isCompanyConfirmed = status === 'Company Confirmed';
  const isCompanyRejected = status === 'Company Rejected';
  const isInfoRequired = status === 'Additional Information Required';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
      {/* Top: Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Verification Protocol Status
          </span>
          <div className="flex items-center gap-2 mt-1">
            <h4 className="text-base font-extrabold text-slate-900">
              {status}
            </h4>
            <Badge status={status} size="sm" />
          </div>
        </div>

        {onViewHistory && (
          <button
            onClick={onViewHistory}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer self-start sm:self-center"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Audit Trail ({certificate.verificationHistory?.length || 1})</span>
          </button>
        )}
      </div>

      {/* Status Specific Banners & Insights */}
      {status === 'Pending Automatic Verification' && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-spin" />
          <div>
            <p className="font-bold">Automatic Verification in Progress</p>
            <p className="text-amber-700 text-[11px] mt-0.5">
              SkillChain is inspecting OCR text, scanning cryptographic hashes, and pinging registered issuer registries. Document remains strictly confidential.
            </p>
          </div>
        </div>
      )}

      {status === 'Verified' && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Cryptographically Verified</p>
            <p className="text-emerald-700 text-[11px]">
              Credential cryptographic proof verified against registered authority registry.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-emerald-800 font-mono">
              <span>Source: {evidence.sourceChecked || 'Official Issuer API'}</span>
              <span>•</span>
              <span>Adapter: {evidence.adapterName || 'DEMO_MODULAR_ADAPTER'}</span>
            </div>
          </div>
        </div>
      )}

      {status === 'Unable to Verify' && (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-800">
            <HelpCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Automatic Verification Inconclusive</p>
              <p className="text-slate-600 text-[11px]">
                {evidence.evidenceNotes || 
                  'The issuing organization does not maintain a public automated API endpoint or requires manual administrative confirmation.'
                }
              </p>
              <p className="text-[11px] font-medium text-slate-700 pt-0.5">
                Your certificate is stored securely in SkillChain. You may now request direct manual verification from the issuing company.
              </p>
            </div>
          </div>

          {canSendToCompany && (
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <span>Student-Controlled Company Verification</span>
                </p>
                <p className="text-[11px] text-purple-700">
                  Transmit this certificate to the issuing company's official reviewer queue for manual audit and digital signature.
                </p>
              </div>
              <button
                type="button"
                onClick={onSendToCompany}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Company</span>
              </button>
            </div>
          )}
        </div>
      )}

      {status === 'Rejected' && (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Automatic Verification Rejected</p>
              <p className="text-rose-700 text-[11px]">
                {evidence.rejectionReason || 'The cryptographic proof or certificate ID failed validation checks against issuer standards.'}
              </p>
              <div className="text-[10px] text-rose-800 font-mono pt-1">
                Preserved Rejection Evidence: {evidence.evidenceNotes || 'Revoked or mismatched credentials detected.'}
              </div>
            </div>
          </div>

          {canSendToCompany && (
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-purple-900">
                  Dispute or Request Direct Manual Company Review
                </p>
                <p className="text-[11px] text-purple-700">
                  If this rejection is due to an outdated API or special program record, send directly to the company.
                </p>
              </div>
              <button
                type="button"
                onClick={onSendToCompany}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Company</span>
              </button>
            </div>
          )}
        </div>
      )}

      {isCompanyPending && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900">
          <Building2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Pending Review with {sharing.targetCompanyName || 'Issuing Company'}</p>
            <p className="text-purple-700 text-[11px]">
              Transmitted to designated company reviewer with your explicit cryptographic consent. Awaiting institutional sign-off.
            </p>
            {sharing.consentedAt && (
              <p className="text-[10px] text-purple-500 font-mono">
                Consent recorded: {new Date(sharing.consentedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}

      {isCompanyConfirmed && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Officially Confirmed by {sharing.targetCompanyName || certificate.issuer}</p>
            <p className="text-teal-700 text-[11px]">
              {sharing.companyResponseNotes || 'The issuing company reviewer has authenticated your credential and applied digital signature.'}
            </p>
            {sharing.respondedAt && (
              <p className="text-[10px] text-teal-600 font-mono">
                Confirmed on: {new Date(sharing.respondedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}

      {isCompanyRejected && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-900">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Company Review Declined</p>
            <p className="text-rose-700 text-[11px]">
              {sharing.companyResponseNotes || 'The designated company was unable to confirm this credential in their internal enrollment registry.'}
            </p>
          </div>
        </div>
      )}

      {isInfoRequired && (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900">
            <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Additional Information Requested</p>
              <p className="text-sky-700 text-[11px]">
                {sharing.infoRequestedDetails || 'The reviewer has requested supplementary documents or student registration numbers.'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={onSendToCompany}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Resubmit to Company with Details</span>
            </button>
          </div>
        </div>
      )}

      {/* Extracted Certificate Snapshot Details */}
      {certificate.extractedDetails && (
        <div className="pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              Extracted Data Audit
            </span>
            <span className="text-[10px] text-slate-400">OCR & QR Detection</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">Recipient</span>
              <span className="font-semibold text-slate-800 truncate block">{certificate.extractedDetails.holderName || 'Alex Chen'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Issuer</span>
              <span className="font-semibold text-slate-800 truncate block">{certificate.extractedDetails.issuer || certificate.issuer}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Credential ID</span>
              <span className="font-mono text-slate-800 truncate block">{certificate.extractedDetails.certId || certificate.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Issue Date</span>
              <span className="text-slate-800 truncate block">{certificate.extractedDetails.issueDate || certificate.issueDate}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

