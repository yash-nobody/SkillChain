import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { 
  ShieldCheck, 
  Award, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Hash, 
  Calendar, 
  CheckCircle2,
  Lock,
  Clock,
  Send,
  Building2
} from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';
import { VerificationStatusPanel } from './VerificationStatusPanel';
import { CompanyReviewTimeline } from './CompanyReviewTimeline';

export const CertificateDetailModal = ({ 
  isOpen, 
  onClose, 
  certificate,
  onSendToCompany
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [activeTab, setActiveTab] = useState('credential'); // 'credential' | 'status' | 'timeline'
  const { currentUser, showToast } = useSkillChain();

  if (!certificate) return null;

  const status = certificate.status || 'Pending Automatic Verification';
  const canSend = [
    'Unable to Verify', 
    'Rejected', 
    'Additional Information Required'
  ].includes(status) && !certificate.companySharing?.sharedWithCompany;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(certificate.verificationHash || certificate.id);
    setCopied(true);
    showToast('Verification hash copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    showToast('Verifiable PDF credential export initialized.', 'success');
  };

  const handleShare = () => {
    const url = window.location.origin + `/verify?id=${certificate.id}`;
    navigator.clipboard.writeText(url);
    showToast('Public verification link copied to clipboard!', 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verifiable Digital Credential"
      subtitle={`Credential Record #${certificate.id}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5">
        
        {/* Navigation Tabs inside modal */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('credential')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'credential'
                ? 'bg-white text-brand-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Digital Credential
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'status'
                ? 'bg-white text-brand-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verification Protocol & Evidence
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-white text-brand-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Trail ({certificate.verificationHistory?.length || 1})
          </button>
        </div>

        {activeTab === 'status' && (
          <VerificationStatusPanel
            certificate={certificate}
            onSendToCompany={() => {
              if (onSendToCompany) onSendToCompany(certificate);
            }}
            onViewHistory={() => setActiveTab('timeline')}
          />
        )}

        {activeTab === 'timeline' && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Cryptographic Audit Timeline</h4>
                <p className="text-xs text-slate-500">Recorded events, issuer pings, and student consent actions</p>
              </div>
              <Badge status={status} size="sm" />
            </div>
            <CompanyReviewTimeline 
              history={certificate.verificationHistory}
              currentStatus={status}
            />
          </div>
        )}

        {activeTab === 'credential' && (
          <div className="space-y-5">
            {/* Certificate Canvas / Decorative Bordered Frame */}
            <div className="relative rounded-2xl border-4 border-double border-slate-200 bg-gradient-to-b from-white via-slate-50/50 to-white p-6 sm:p-10 shadow-xs overflow-hidden">
              
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                <ShieldCheck className="w-96 h-96 text-slate-900" />
              </div>

              {/* Certificate Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200/80 pb-6 text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 p-2 shadow-xs flex items-center justify-center">
                    {certificate.issuerLogo && !imgError ? (
                      <img
                        src={certificate.issuerLogo}
                        alt={certificate.issuer}
                        className="max-h-full max-w-full object-contain"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <Award className="w-8 h-8 text-brand-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
                      Issuing Authority
                    </p>
                    <h4 className="text-base font-bold text-slate-900">
                      {certificate.issuer}
                    </h4>
                  </div>
                </div>

                {/* Verification Seal */}
                <div className="flex flex-col items-center sm:items-end">
                  <Badge status={certificate.status} size="md" />
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">
                    W3C VC Protocol 2.0
                  </span>
                </div>
              </div>

              {/* Certificate Main Body */}
              <div className="py-8 text-center space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                  Certificate of Verifiable Achievement
                </span>

                <p className="text-sm text-slate-500 pt-2">
                  This officially certifies that
                </p>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {certificate.extractedDetails?.holderName || certificate.recipientName || currentUser?.name || 'Alex Chen'}
                </h2>

                <p className="text-sm text-slate-500">
                  has satisfactorily completed the curriculum and demonstrated validated competence in
                </p>

                <h3 className="text-xl sm:text-2xl font-bold text-brand-700 max-w-xl mx-auto leading-tight pt-1">
                  {certificate.title}
                </h3>

                {certificate.grade && (
                  <p className="text-sm font-semibold text-slate-700 bg-slate-100/80 px-4 py-1.5 rounded-xl inline-block mt-2">
                    Honors & Evaluation: <span className="text-emerald-700">{certificate.grade}</span>
                  </p>
                )}

                <p className="text-xs text-slate-500 max-w-lg mx-auto pt-2 leading-relaxed">
                  {certificate.description}
                </p>
              </div>

              {/* Competency & Skills Validated */}
              <div className="border-t border-slate-200/80 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
                  Audited Skill Competencies
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {certificate.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Certificate Footer with Signatures & Hash */}
              <div className="mt-8 pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div>
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Issue Date: <span className="font-medium text-slate-600">{certificate.issueDate}</span>
                  </p>
                  <p className="mt-1 font-semibold text-slate-800 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-slate-400" />
                    Validity: <span className="font-medium text-emerald-700">{certificate.expiryDate || 'Lifetime'}</span>
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="font-bold text-slate-900">
                    {certificate.verifiedBy || 'SkillChain Cryptographic Notary'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Authorized Digital Signature & Key
                  </p>
                </div>
              </div>

            </div>

            {/* Cryptographic Ledger & Audit Metadata */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  Cryptographic SHA-256 Proof
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Block #{certificate.ledgerBlock || '18942104'}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
                <code className="text-xs text-brand-700 font-mono flex-1 truncate">
                  {certificate.verificationHash || '0x8f2b98e1a90c4d21e873b526da0f34081c741e893e1b7829'}
                </code>
                <button
                  onClick={handleCopyHash}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Copy Hash"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Close Viewer
            </button>
            {canSend && onSendToCompany && (
              <button
                type="button"
                onClick={() => onSendToCompany(certificate)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Company for Verification</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-slate-500" />
              <span>Share Public Link</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
