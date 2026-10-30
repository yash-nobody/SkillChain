import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  ArrowLeft,
  Building2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Lock,
  Calendar,
  XCircle
} from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';
import { Header } from '../../components/dashboard/Header';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Link } from 'react-router-dom';

export const CandidateRequests = () => {
  const { 
    verificationRequests, 
    confirmCompanyRequest, 
    rejectCompanyRequest, 
    requestAdditionalInfoFromStudent, 
    currentUser 
  } = useSkillChain();

  const [filter, setFilter] = useState('ALL'); 
  const [search, setSearch] = useState('');

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedReqForReject, setSelectedReqForReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Info request modal state
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedReqForInfo, setSelectedReqForInfo] = useState(null);
  const [infoNotes, setInfoNotes] = useState('');

  // Filter requests strictly addressed to this company
  const companyName = currentUser?.name || 'Acme Cloud Technologies';
  const companyRequests = verificationRequests.filter(req => {
    if (!req.targetCompanyName && !req.targetCompanyId) return true;
    const cleanCompany = companyName.toLowerCase().trim();
    const reqCompany = (req.targetCompanyName || '').toLowerCase().trim();
    const isMatch = reqCompany.includes(cleanCompany) || 
                    cleanCompany.includes(reqCompany) ||
                    req.targetCompanyId === currentUser?.id;
    return isMatch;
  });

  const filtered = companyRequests.filter(req => {
    const s = (req.status || '').toLowerCase();
    const matchesSearch = 
      req.studentName.toLowerCase().includes(search.toLowerCase()) ||
      req.credentialTitle.toLowerCase().includes(search.toLowerCase()) ||
      req.studentEmail.toLowerCase().includes(search.toLowerCase());

    let matchesFilter = true;
    if (filter === 'PENDING') {
      matchesFilter = s === 'pending company review' || s === 'pending';
    } else if (filter === 'CONFIRMED') {
      matchesFilter = s === 'company confirmed' || s === 'approved';
    } else if (filter === 'REJECTED') {
      matchesFilter = s === 'company rejected' || s === 'rejected';
    } else if (filter === 'INFO_REQUIRED') {
      matchesFilter = s === 'additional information required';
    }

    return matchesSearch && matchesFilter;
  });

  const handleOpenReject = (req) => {
    setSelectedReqForReject(req);
    setRejectionReason('Official university/corporate records could not validate completion criteria.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!selectedReqForReject || !rejectionReason.trim()) return;
    rejectCompanyRequest(selectedReqForReject.id, rejectionReason.trim());
    setRejectModalOpen(false);
    setSelectedReqForReject(null);
  };

  const handleOpenInfo = (req) => {
    setSelectedReqForInfo(req);
    setInfoNotes('Please provide your student matriculation number and a direct link to your capstone repository.');
    setInfoModalOpen(true);
  };

  const handleConfirmInfo = (e) => {
    e.preventDefault();
    if (!selectedReqForInfo || !infoNotes.trim()) return;
    requestAdditionalInfoFromStudent(selectedReqForInfo.id, infoNotes.trim());
    setInfoModalOpen(false);
    setSelectedReqForInfo(null);
  };

  return (
    <div>
      <Header
        pageTitle="Candidate Verification Claims"
        pageSubtitle={`Audit claims addressed specifically to ${companyName} and attach digital signatures`}
        actionButton={
          <Link
            to="/company"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Company Dashboard</span>
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Company Identity Banner */}
        <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">
                Target Issuer Queue: {companyName}
              </p>
              <p className="text-purple-700 text-[11px]">
                Showing only claims where students explicitly granted transmission consent to your organization.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-purple-600 bg-white px-3 py-1 rounded-xl border border-purple-200 shrink-0 self-start sm:self-auto">
            {companyRequests.length} Total Claims Assigned
          </span>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name or credential title..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {[
              { key: 'ALL', label: 'All' },
              { key: 'PENDING', label: 'Pending Review' },
              { key: 'CONFIRMED', label: 'Confirmed' },
              { key: 'INFO_REQUIRED', label: 'Info Needed' },
              { key: 'REJECTED', label: 'Rejected' }
            ].map((st) => (
              <button
                key={st.key}
                onClick={() => setFilter(st.key)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filter === st.key
                    ? 'bg-white text-purple-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs max-w-md mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-900">No requests found</h4>
              <p className="text-xs text-slate-500 mt-1">
                There are no claims matching the current filter in your company queue.
              </p>
            </div>
          ) : (
            filtered.map((req) => {
              const isPending = req.status === 'Pending Company Review' || req.status === 'Pending';
              
              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-subtle transition-all flex flex-col lg:flex-row lg:items-start justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.studentAvatar}
                        alt={req.studentName}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{req.studentName}</h4>
                          <Badge status={req.status} size="xs" />
                        </div>
                        <p className="text-xs text-slate-500">{req.studentEmail}</p>
                      </div>
                    </div>

                    <div className="pt-1">
                      <p className="text-sm font-bold text-purple-900">
                        {req.credentialTitle}
                      </p>
                      {req.studentNotes && (
                        <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                          <span className="font-semibold text-slate-700">Student Note:</span> {req.studentNotes}
                        </p>
                      )}
                    </div>

                    {/* Auto-verification failure reason if any */}
                    {req.autoVerificationFailureReason && (
                      <div className="text-[11px] text-amber-800 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Prior Auto-Verification Note:</span> {req.autoVerificationFailureReason}
                        </div>
                      </div>
                    )}

                    {/* Decision notes or reason if responded */}
                    {req.companyDecisionNotes && (
                      <div className="text-[11px] text-slate-700 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                        <span className="font-semibold text-slate-900">Company Decision Log:</span> {req.companyDecisionNotes}
                      </div>
                    )}

                    {req.additionalInfoRequiredNotes && (
                      <div className="text-[11px] text-sky-800 bg-sky-50 p-2.5 rounded-xl border border-sky-200">
                        <span className="font-semibold text-sky-900">Info Requested:</span> {req.additionalInfoRequiredNotes}
                      </div>
                    )}

                    {/* Student Consent & Submission metadata */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Lock className="w-3 h-3 text-emerald-600" />
                        Student Cryptographic Consent Granted
                      </span>
                      <span>•</span>
                      <span>Submitted: {req.submittedDate}</span>
                      <span>•</span>
                      <span className="font-mono">Ref: {req.courseId || req.id}</span>
                    </div>
                  </div>

                  {/* Actions for Company Reviewer */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 min-w-[200px]">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => confirmCompanyRequest(req.id, `Confirmed and verified by ${companyName} Official Signer`)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Confirm & Sign</span>
                        </button>
                        <button
                          onClick={() => handleOpenInfo(req)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Request More Info</span>
                        </button>
                        <button
                          onClick={() => handleOpenReject(req)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject Claim</span>
                        </button>
                      </>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Processed Claim
                        </span>
                        <Badge status={req.status} size="sm" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Candidate Verification Claim"
        subtitle={`Please state the reason for rejecting claim for ${selectedReqForReject?.studentName}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
            Institutional rejection reasons are cryptographically logged into the certificate audit trail.
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Rejection Reason *
            </label>
            <textarea
              required
              rows="3"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs cursor-pointer"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </Modal>

      {/* Additional Info Modal */}
      <Modal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        title="Request Additional Information"
        subtitle={`Specify what details ${selectedReqForInfo?.studentName} must provide`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleConfirmInfo} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Required Information Details *
            </label>
            <textarea
              required
              rows="3"
              value={infoNotes}
              onChange={(e) => setInfoNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setInfoModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs cursor-pointer"
            >
              Send Request to Student
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
