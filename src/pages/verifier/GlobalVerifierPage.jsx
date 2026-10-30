import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ExternalLink 
} from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Badge } from '../../components/common/Badge';

export const GlobalVerifierPage = () => {
  const location = useLocation();
  const { verifyCredentialById, showToast } = useSkillChain();

  const [searchId, setSearchId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryId = params.get('id');
    if (queryId) {
      setSearchId(queryId);
      performVerification(queryId);
    }
  }, [location.search]);

  const performVerification = (idToVerify) => {
    setIsVerifying(true);
    setHasSearched(true);

    setTimeout(() => {
      const result = verifyCredentialById(idToVerify);
      setVerifiedResult(result);
      setIsVerifying(false);
    }, 600);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    performVerification(searchId.trim());
  };

  const handleSampleClick = (sampleId) => {
    setSearchId(sampleId);
    performVerification(sampleId);
  };

  const handleCopyAuditCert = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Audit certificate URL copied to clipboard!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 flex-1">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200 flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cryptographic Credential Verifier
          </h1>
          <p className="text-sm text-slate-600">
            Audit any SkillChain verifiable credential, internship badge, or degree directly against the decentralized ledger.
          </p>
        </div>

        {/* Search / Verification Input Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-premium">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Enter Credential ID or SHA-256 Hash
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="e.g. SKC-2026-89412-V or 0x8f2b98e1a90c4d..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Try sample IDs:</span>
                <button
                  type="button"
                  onClick={() => handleSampleClick('SKC-2026-89412-V')}
                  className="font-mono text-brand-600 hover:underline px-1.5 py-0.5 rounded bg-brand-50 border border-brand-200 text-[11px] cursor-pointer"
                >
                  SKC-2026-89412-V
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleClick('SKC-2026-77319-V')}
                  className="font-mono text-brand-600 hover:underline px-1.5 py-0.5 rounded bg-brand-50 border border-brand-200 text-[11px] cursor-pointer"
                >
                  SKC-2026-77319-V
                </button>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <span>Checking Ledger...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Audit Credential</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Verification Result Presentation */}
        {hasSearched && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            {verifiedResult ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-premium space-y-6">
                
                {/* Result Status Banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-emerald-950">
                        Cryptographic Verification Passed
                      </h3>
                      <p className="text-xs text-emerald-700">
                        This credential is valid, untampered, and signed by an accredited authority.
                      </p>
                    </div>
                  </div>
                  <Badge status={verifiedResult.status} size="md" />
                </div>

                {/* Credential Details */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Credential Title
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                      {verifiedResult.title}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Issuing Authority</span>
                      <p className="text-slate-900 font-bold text-sm mt-0.5">{verifiedResult.issuer}</p>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Date of Issuance</span>
                      <p className="text-slate-900 font-bold text-sm mt-0.5">{verifiedResult.issueDate}</p>
                    </div>
                  </div>

                  {verifiedResult.grade && (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">Evaluation / Distinction</span>
                      <p className="text-emerald-800 font-bold text-sm mt-0.5">{verifiedResult.grade}</p>
                    </div>
                  )}

                  {/* Skills Verified */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Audited Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {verifiedResult.skills?.map((sk, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Ledger Cryptographic Proof */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-2">
                    <div className="flex justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
                      <span>SIGNATURE VERIFIED: SHA-256</span>
                      <span>BLOCK #{verifiedResult.ledgerBlock || '18942104'}</span>
                    </div>
                    <div className="break-all text-[11px] text-emerald-400">
                      HASH: {verifiedResult.verificationHash || '0x8f2b98e1a90c4d21e873b526da0f34081c741e893e1b7829'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      SIGNER: {verifiedResult.verifiedBy || 'SkillChain Node #8891'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <Link
                    to="/passport"
                    className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1"
                  >
                    <span>View Student's Skill Passport</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={handleCopyAuditCert}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Copy Audit Certificate
                  </button>
                </div>

              </div>
            ) : (
              /* Not Found / Invalid */
              <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-premium text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
                  <XCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Credential ID Not Found in Registry
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  No cryptographic block or credential record matches "{searchId}". Please check the ID or verify with the issuing organization.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSearchId('SKC-2026-89412-V')}
                    className="text-xs font-semibold text-brand-600 hover:underline cursor-pointer"
                  >
                    Load sample valid credential (SKC-2026-89412-V)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};
