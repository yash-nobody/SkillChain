import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Lock
} from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';

export const UploadCertificateModal = ({ isOpen, onClose }) => {
  const { uploadCertificate, currentUser } = useSkillChain();
  const fileInputRef = useRef(null);

  // Workflow steps: 1 = File Selection, 2 = Review Extracted OCR/QR Data, 3 = Submission Processing
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState('Stanford_Distributed_Systems_Certificate.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extracted details that student can review and correct
  const [extractedData, setExtractedData] = useState({
    holderName: currentUser?.name || 'Alex Chen',
    title: 'Cloud Architecture & Distributed Microservices',
    issuer: 'Google Cloud Training & Stanford EECS',
    issuerCategory: 'Cloud & Infrastructure',
    certId: `SKC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}-P`,
    issueDate: 'October 14, 2026',
    expiryDate: 'Never (Lifetime Verifiable)',
    verificationUrl: 'https://cloud.google.com/certification/verify',
    qrPayload: 'SKC_QR_SIGNATURE_PAYLOAD:GCP-DIST-8941',
    grade: 'Score: 98.4% (Honors)',
    skillsText: 'Kubernetes, Go, Distributed Systems, gRPC',
    notes: 'Capstone engineering project verified on course lab cluster.',
    testScenario: 'NORMAL' // 'NORMAL' | 'UNREGISTERED_ISSUER' | 'FORCE_REJECT'
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      
      // Auto-populate intelligent demo extraction based on file name or default
      if (file.name.toLowerCase().includes('meta') || file.name.toLowerCase().includes('react')) {
        setExtractedData(prev => ({
          ...prev,
          title: 'Advanced React & Next.js Architecture',
          issuer: 'Meta Open Source & Dev Academy',
          skillsText: 'React 19, TypeScript, Next.js, State Machines',
          verificationUrl: 'https://developers.facebook.com/credentials/verify'
        }));
      } else if (file.name.toLowerCase().includes('deep') || file.name.toLowerCase().includes('ai')) {
        setExtractedData(prev => ({
          ...prev,
          title: 'Deep Learning & Neural Network Foundations',
          issuer: 'DeepLearning.AI & Stanford Online',
          skillsText: 'PyTorch, Transformers, CNNs, Vector Search',
          verificationUrl: 'https://deeplearning.ai/certificates/verify'
        }));
      }
    }
  };

  const handleProceedToReview = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleScenarioChange = (scenario) => {
    if (scenario === 'UNREGISTERED_ISSUER') {
      setExtractedData(prev => ({
        ...prev,
        testScenario: scenario,
        issuer: 'Apex Global Tech Academy (Unregistered)',
        verificationUrl: 'https://apex-unknown-academy.org/verify'
      }));
    } else if (scenario === 'FORCE_REJECT') {
      setExtractedData(prev => ({
        ...prev,
        testScenario: scenario,
        issuer: 'Google Cloud Training & Stanford EECS',
        certId: `SKC-2026-${Math.floor(10000 + Math.random() * 90000)}-R`
      }));
    } else {
      setExtractedData(prev => ({
        ...prev,
        testScenario: scenario,
        issuer: 'Google Cloud Training & Stanford EECS',
        certId: `SKC-2026-${Math.floor(10000 + Math.random() * 90000)}-P`
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const skillsArray = extractedData.skillsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const isForceReject = extractedData.testScenario === 'FORCE_REJECT';

    setTimeout(() => {
      uploadCertificate({
        title: extractedData.title,
        issuer: extractedData.issuer,
        issuerCategory: extractedData.issuerCategory,
        skills: skillsArray.length > 0 ? skillsArray : ['Software Engineering', 'Verified Skills'],
        grade: extractedData.grade,
        notes: extractedData.notes,
        issueDate: extractedData.issueDate,
        expiryDate: extractedData.expiryDate,
        certId: extractedData.certId,
        verificationUrl: extractedData.verificationUrl,
        qrPayload: extractedData.qrPayload,
        forceReject: isForceReject,
        rejectionReason: isForceReject ? 'Certificate ID revoked in issuer authority registry' : '',
        fileUrl: `https://storage.skillchain.network/uploads/${fileName}`
      });

      setIsSubmitting(false);
      setStep(1);
      onClose();
    }, 700);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload & Verify Certificate"
      subtitle={
        step === 1 
          ? "Step 1 of 2: Select credential file to store securely in SkillChain" 
          : "Step 2 of 2: Review and correct extracted OCR & QR data"
      }
      maxWidth="max-w-2xl"
    >
      {step === 1 ? (
        /* STEP 1: Upload Document & Initial Preview */
        <form onSubmit={handleProceedToReview} className="space-y-4">
          
          <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Student Confidentiality Guarantee</p>
              <p className="text-[11px] text-purple-700 mt-0.5 leading-relaxed">
                This certificate will be stored <span className="font-bold">strictly within SkillChain</span>. It will NOT be sent to any company automatically. You will review extracted details before automated verification runs.
              </p>
            </div>
          </div>

          {/* File Dropzone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Select Document (PDF, JPEG, PNG) *
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.svg"
              className="hidden"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-6 text-center bg-slate-50/70 hover:bg-brand-50/20 transition-all cursor-pointer group"
            >
              <div className="flex flex-col items-center gap-2.5">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 group-hover:scale-105 transition-transform flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {fileName ? (
                      <span className="text-brand-600 flex items-center gap-1.5 justify-center">
                        <FileText className="w-4 h-4" />
                        {fileName}
                      </span>
                    ) : (
                      'Click to upload or drag and drop your credential file'
                    )}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Accepts official diplomas, course certificates, and accredited badges (Max 25MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Scenario Selector (Helpful for evaluator / demo) */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Demo Verification Testing Scenario
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleScenarioChange('NORMAL')}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                  extractedData.testScenario === 'NORMAL'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Known Issuer</span>
                </div>
                <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                  Simulates auto-verification pass
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleScenarioChange('UNREGISTERED_ISSUER')}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                  extractedData.testScenario === 'UNREGISTERED_ISSUER'
                    ? 'border-purple-500 bg-purple-50 text-purple-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                  <span>Unknown Issuer</span>
                </div>
                <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                  Results in "Unable to Verify"
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleScenarioChange('FORCE_REJECT')}
                className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                  extractedData.testScenario === 'FORCE_REJECT'
                    ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Revoked Credential</span>
                </div>
                <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                  Results in "Rejected"
                </p>
              </button>
            </div>
          </div>

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
              className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Scan & Extract Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      ) : (
        /* STEP 2: Review and Correct Extracted Data */
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              <span className="font-semibold text-slate-800">OCR & QR Data Extracted</span>
            </div>
            <span className="text-[11px] text-slate-500">Please review & edit any inaccurate fields</span>
          </div>

          {/* Title & Issuer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Certificate / Course Title *
              </label>
              <input
                type="text"
                required
                value={extractedData.title}
                onChange={(e) => setExtractedData({ ...extractedData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Issuing Organization *
              </label>
              <input
                type="text"
                required
                value={extractedData.issuer}
                onChange={(e) => setExtractedData({ ...extractedData, issuer: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Cert ID & Recipient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Certificate ID / Serial Number *
              </label>
              <input
                type="text"
                required
                value={extractedData.certId}
                onChange={(e) => setExtractedData({ ...extractedData, certId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Certificate Holder Name
              </label>
              <input
                type="text"
                value={extractedData.holderName}
                onChange={(e) => setExtractedData({ ...extractedData, holderName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Issue Date
              </label>
              <input
                type="text"
                value={extractedData.issueDate}
                onChange={(e) => setExtractedData({ ...extractedData, issueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                value={extractedData.expiryDate}
                onChange={(e) => setExtractedData({ ...extractedData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Verification URL & QR info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Official Verification URL
              </label>
              <input
                type="text"
                value={extractedData.verificationUrl}
                onChange={(e) => setExtractedData({ ...extractedData, verificationUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                QR Code Signature / Payload
              </label>
              <input
                type="text"
                value={extractedData.qrPayload}
                onChange={(e) => setExtractedData({ ...extractedData, qrPayload: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Extracted Skills (Comma separated)
            </label>
            <input
              type="text"
              value={extractedData.skillsText}
              onChange={(e) => setExtractedData({ ...extractedData, skillsText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to File</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Executing Verification Engine...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm & Run Automatic Verification</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}
    </Modal>
  );
};
