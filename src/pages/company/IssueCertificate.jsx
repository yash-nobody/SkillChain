import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  ArrowLeft
} from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';
import { Header } from '../../components/dashboard/Header';

export const IssueCertificate = () => {
  const { currentUser, issueCertificate } = useSkillChain();

  const [formData, setFormData] = useState({
    recipientName: 'Alex Chen',
    recipientEmail: 'alex.chen@stanford.edu',
    credentialTitle: 'Advanced Cloud Native Microservices Specialization',
    issueDate: 'October 2026',
    grade: 'Summa Cum Laude (Top 1%)',
    skillsText: 'Kubernetes, Go, Kafka, Distributed Architecture, Docker',
    notes: 'Awarded for exceptional capstone performance demonstrating production-level microservices resilience.'
  });

  const [isMinting, setIsMinting] = useState(false);
  const [mintedCert, setMintedCert] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.recipientName || !formData.credentialTitle) return;

    setIsMinting(true);

    const skillsArray = formData.skillsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    setTimeout(() => {
      const newCert = issueCertificate({
        ...formData,
        skills: skillsArray
      });
      setIsMinting(false);
      setMintedCert(newCert);
    }, 800);
  };

  return (
    <div>
      <Header
        pageTitle="Issue Verifiable Certificate"
        pageSubtitle="Cryptographically sign and mint a tamper-proof credential for a student"
        actionButton={
          <Link
            to="/company"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Issuer Hub</span>
          </Link>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {mintedCert ? (
          /* Mint Success Card */
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-premium text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Cryptographically Signed & Minted
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
                Credential Issued Successfully!
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                The certificate has been recorded and anchored to the SkillChain distributed ledger. The recipient's skill passport has been automatically updated.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 max-w-lg mx-auto text-left space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient:</span>
                <span className="font-bold text-slate-900">{mintedCert.recipientName} ({mintedCert.recipientEmail})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Credential Title:</span>
                <span className="font-bold text-slate-900">{mintedCert.credentialTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Credential ID:</span>
                <span className="font-mono text-purple-700 font-bold">{mintedCert.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cryptographic Hash:</span>
                <span className="font-mono text-slate-700 truncate max-w-[200px]">{mintedCert.hash}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={() => setMintedCert(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Issue Another Credential
              </button>
              <Link
                to={`/verify?id=${mintedCert.id}`}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
              >
                Verify on Public Ledger
              </Link>
            </div>
          </div>
        ) : (
          /* Issue Certificate Form */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
            
            <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Credential Details & Recipient
                </h2>
                <p className="text-xs text-slate-500">
                  Signed using {currentUser?.name || 'Acme Cloud Technologies'} authorized cryptographic key
                </p>
              </div>
              <span className="text-[11px] font-mono text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full font-bold">
                ED25519-SIGNER
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    placeholder="e.g. Alex Chen"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Student Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.recipientEmail}
                    onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                    placeholder="e.g. alex.chen@stanford.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Credential / Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.credentialTitle}
                  onChange={(e) => setFormData({ ...formData, credentialTitle: e.target.value })}
                  placeholder="e.g. Enterprise Cloud Architecture Fellowship"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Date of Issuance
                  </label>
                  <input
                    type="text"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Honors, Grade or Distinction
                  </label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="e.g. Score 98% or Return Offer Extended"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Verified Skills Acquired (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.skillsText}
                  onChange={(e) => setFormData({ ...formData, skillsText: e.target.value })}
                  placeholder="e.g. Kubernetes, Golang, CI/CD, PostgreSQL"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Evaluation Note & Verification Basis
                </label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Explain why this student was awarded this credential..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>Will be anchored to cryptographic block #18950000+</span>
                </div>

                <button
                  type="submit"
                  disabled={isMinting}
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isMinting ? (
                    <span>Signing & Minting...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Sign & Mint Verifiable Credential</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
