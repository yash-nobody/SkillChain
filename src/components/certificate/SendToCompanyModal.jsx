import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';

const REGISTERED_COMPANIES = [
  { id: 'usr-company-01', name: 'Acme Cloud Technologies', category: 'Enterprise Cloud' },
  { id: 'iss-02', name: 'Stanford EECS Lab', category: 'Academic Institution' },
  { id: 'iss-03', name: 'Meta Open Source', category: 'Technology Partner' },
  { id: 'iss-04', name: 'DeepLearning.AI', category: 'AI Education' },
  { id: 'iss-05', name: 'Web3 Security Guild', category: 'Community Auditor' },
];

export const SendToCompanyModal = ({ 
  isOpen, 
  onClose, 
  certificate, 
  onSuccess 
}) => {
  const { sendToCompanyForVerification, showToast } = useSkillChain();

  // Pre-populate with certificate's detected issuer
  const initialCompany = certificate?.issuer || 'Acme Cloud Technologies';
  
  // Find matching registered company if any
  const matchedRegistered = REGISTERED_COMPANIES.find(
    c => c.name.toLowerCase().includes(initialCompany.toLowerCase()) || 
         initialCompany.toLowerCase().includes(c.name.toLowerCase())
  );

  const [selectedCompanyId, setSelectedCompanyId] = useState(matchedRegistered ? matchedRegistered.id : 'custom');
  const [customCompanyName, setCustomCompanyName] = useState(initialCompany);
  const [studentNotes, setStudentNotes] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!certificate) return null;

  const targetName = selectedCompanyId === 'custom' 
    ? customCompanyName 
    : (REGISTERED_COMPANIES.find(c => c.id === selectedCompanyId)?.name || customCompanyName);

  const failureReason = certificate.autoVerificationEvidence?.rejectionReason || 
    certificate.autoVerificationEvidence?.evidenceNotes || 
    'Issuing organization does not provide an automated public verification API.';

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    if (!consentChecked) {
      showToast('You must confirm student consent before transmitting.', 'error');
      return;
    }
    if (!targetName.trim()) {
      showToast('Please specify the issuing company name.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      sendToCompanyForVerification(
        certificate.id,
        selectedCompanyId === 'custom' ? `comp-custom-${Date.now()}` : selectedCompanyId,
        targetName,
        studentNotes,
        'I hereby authorize SkillChain to transmit this certificate document and extracted claims strictly to the designated issuing company for verification.'
      );
      setIsSubmitting(false);
      showToast(`Verification request sent to ${targetName}.`, 'success');
      if (onSuccess) onSuccess();
      onClose();
    }, 700);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send to Issuing Company for Verification"
      subtitle="Student-controlled sharing for institutional review and cryptographic endorsement"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleConfirmSubmit} className="space-y-5">
        
        {/* Step Callout */}
        <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200 text-xs text-purple-900 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-purple-600" />
            <span>Strict Student Privacy Control</span>
          </p>
          <p className="text-[11px] text-purple-700 leading-relaxed">
            Your certificate was not sent automatically. SkillChain only shares this document with an issuing company when you explicitly authorize transmission.
          </p>
        </div>

        {/* Certificate Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
              Credential To Be Shared
            </span>
            <span className="font-mono text-[10px] text-slate-500">
              ID: {certificate.id}
            </span>
          </div>

          <p className="text-sm font-bold text-slate-900">
            {certificate.title}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10px]">Detected Issuer</span>
              <span className="font-semibold text-slate-800">{certificate.issuer}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Recipient</span>
              <span className="font-semibold text-slate-800">{certificate.extractedDetails?.holderName || 'Alex Chen'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Current Status</span>
              <span className="font-semibold text-amber-700">{certificate.status}</span>
            </div>
          </div>
        </div>

        {/* Why Auto-Verification Failed */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
          <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Reason Automatic Verification Was Inconclusive
          </span>
          <p className="text-[11px] text-amber-900">
            {failureReason}
          </p>
        </div>

        {/* Company Selection / Confirmation */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Select or Confirm Target Issuing Organization *
          </label>

          <div className="space-y-2">
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <optgroup label="Registered SkillChain Issuers">
                {REGISTERED_COMPANIES.map(comp => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name} ({comp.category}) - Instant Protocol Routing
                  </option>
                ))}
              </optgroup>
              <option value="custom">Other / Custom Organization (Unregistered)</option>
            </select>

            {selectedCompanyId === 'custom' && (
              <div className="space-y-1.5 pt-1">
                <input
                  type="text"
                  required
                  value={customCompanyName}
                  onChange={(e) => setCustomCompanyName(e.target.value)}
                  placeholder="Enter organization name (e.g. AWS Training, Berkeley EECS)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-[11px] text-slate-400">
                  SkillChain will route the audit request to this organization's accredited domain verifiers.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Supplementary Notes for Company Auditor */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Student Notes for Reviewer (Optional)
          </label>
          <textarea
            rows="2"
            value={studentNotes}
            onChange={(e) => setStudentNotes(e.target.value)}
            placeholder="Add student ID, batch number, or link to lab repository to help reviewer locate your records..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>

        {/* Document That Will Be Shared Preview */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-purple-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Uploaded Document & Extracted Metadata</p>
              <p className="text-[11px] text-slate-400">PDF / Image cryptographic payload</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
            Encrypted Transit
          </span>
        </div>

        {/* Explicit Student Consent Checkbox */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer"
            />
            <span className="text-xs text-slate-700 leading-snug">
              I explicitly authorize SkillChain to transmit this certificate document and my extracted claims <span className="font-bold text-slate-900">exclusively to {targetName}</span> for manual verification. I understand this will create a reviewer request in their institutional dashboard.
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!consentChecked || isSubmitting}
            className="px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Transmitting Request...</span>
            ) : (
              <>
                <span>Confirm & Send to Company</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>
    </Modal>
  );
};

