import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Copy, Check, Download, ShieldCheck } from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';

export const QRCodeModal = ({ isOpen, onClose }) => {
  const { currentUser, showToast } = useSkillChain();
  const [copied, setCopied] = useState(false);
  const [qrError, setQrError] = useState(false);

  const passportUrl = window.location.origin + `/passport`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(passportUrl);
    setCopied(true);
    showToast('Passport URL copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    showToast('Passport QR code saved to downloads.', 'info');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Shareable Digital Skill Passport"
      subtitle="Publicly verifiable credential profile with tamper-proof QR key"
      maxWidth="max-w-md"
    >
      <div className="text-center space-y-5">
        
        {/* Visual Passport Card Mock */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden">
          {/* Subtle glow circle */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
              <span className="text-xs font-bold tracking-wider uppercase text-slate-300">
                Verifiable Passport
              </span>
            </div>
            <span className="text-[10px] font-mono bg-brand-500/30 text-brand-300 border border-brand-500/40 px-2 py-0.5 rounded-full font-bold">
              Trust Score: 98/100
            </span>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-4 rounded-xl inline-block shadow-inner mb-3">
            {!qrError ? (
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(passportUrl)}`}
                alt="Passport QR Code"
                className="w-40 h-40 mx-auto"
                onError={() => setQrError(true)}
              />
            ) : (
              <div className="w-40 h-40 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-brand-400 p-2">
                <ShieldCheck className="w-12 h-12 mb-2 text-brand-400" />
                <span className="text-[10px] text-slate-300 font-mono">SKC-QR-CODE</span>
              </div>
            )}
          </div>

          {/* Student Info */}
          <h4 className="text-base font-bold text-white tracking-tight">
            {currentUser?.name || 'Alex Chen'}
          </h4>
          <p className="text-xs text-slate-400">
            {currentUser?.institution || 'Stanford University'}
          </p>
          <div className="mt-2 text-[11px] font-mono text-slate-400 bg-slate-800/80 px-3 py-1 rounded-lg inline-block border border-slate-700">
            ID: {currentUser?.passportId || 'SKC-PASSPORT-89412-AC'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Public Link!' : 'Copy Public Passport URL'}</span>
          </button>

          <button
            onClick={handleDownloadQR}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download High-Res QR Image</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400 leading-normal">
          Anyone scanning this QR code will be routed directly to your cryptographic SkillChain dossier, verifying your authentic achievements without sign-in requirements.
        </p>

      </div>
    </Modal>
  );
};
