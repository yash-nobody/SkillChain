import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Send, 
  CheckSquare, 
  Award, 
  ShieldCheck, 
  Clock, 
  Users, 
  CheckCircle2, 
  Hash
} from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';
import { Header } from '../../components/dashboard/Header';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';

export const CompanyDashboard = () => {
  const { 
    currentUser, 
    issuedCerts, 
    verificationRequests, 
    confirmCompanyRequest, 
    rejectCompanyRequest 
  } = useSkillChain();

  const navigate = useNavigate();

  const companyName = currentUser?.name || 'Acme Cloud Technologies';
  const myCompanyRequests = verificationRequests.filter(req => {
    if (!req.targetCompanyName && !req.targetCompanyId) return true;
    const cleanCompany = companyName.toLowerCase().trim();
    const reqCompany = (req.targetCompanyName || '').toLowerCase().trim();
    return reqCompany.includes(cleanCompany) || 
           cleanCompany.includes(reqCompany) ||
           req.targetCompanyId === currentUser?.id;
  });

  const pendingRequests = myCompanyRequests.filter(r => 
    r.status === 'Pending Company Review' || r.status === 'Pending'
  );

  return (
    <div>
      <Header
        pageTitle="Company / Issuer Hub"
        pageSubtitle="Issue verifiable certificates and review student verification claims"
        actionButton={
          <Link
            to="/company/issue"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02]"
          >
            <Send className="w-4 h-4" />
            <span>Issue New Certificate</span>
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Company Profile Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-50 border border-purple-200 p-2 flex items-center justify-center shrink-0">
              <Building2 className="w-10 h-10 text-purple-600" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {currentUser?.name || 'Acme Cloud Technologies'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  Accredited Issuer
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Decentralized Issuer ID: <code className="text-purple-600 font-mono">did:skillchain:acme-cloud-994</code>
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                <span>Signing Key: <span className="text-emerald-600 font-medium font-mono">ED25519-ACTIVE</span></span>
                <span>Audit Status: <span className="text-slate-800 font-semibold">Tier-1 Sovereign Enterprise</span></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Link
              to="/company/issue"
              className="flex-1 sm:flex-initial text-center px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm"
            >
              Issue Credential
            </Link>
            <Link
              to="/company/requests"
              className="flex-1 sm:flex-initial text-center px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              Review Queue ({pendingRequests.length})
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Issued"
            value={issuedCerts.length + 245}
            subtitle="Lifetime verifiable credentials"
            icon={Award}
            color="purple"
            trend={18}
          />
          <StatCard
            title="Pending Requests"
            value={pendingRequests.length}
            subtitle="Claims requiring review"
            icon={Clock}
            color="amber"
            badgeText="Action Needed"
          />
          <StatCard
            title="Verification Rate"
            value="98.7%"
            subtitle="Audit pass percentage"
            icon={ShieldCheck}
            color="emerald"
            badgeText="Optimal"
          />
          <StatCard
            title="Talent Reach"
            value="4,200+"
            subtitle="Students holding credentials"
            icon={Users}
            color="brand"
            trend={24}
          />
        </div>

        {/* Two-Column Section: Pending Requests & Recently Issued */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Column 1: Review Candidate Requests */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-purple-600" />
                    <span>Candidate Verification Requests</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Incoming claims submitted by students for work or course credits
                  </p>
                </div>
                <Link
                  to="/company/requests"
                  className="text-xs font-semibold text-purple-600 hover:text-purple-700"
                >
                  View All ({pendingRequests.length}) →
                </Link>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/60 my-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-900">Queue is Clear!</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    All candidate claims have been processed.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 my-2">
                  {pendingRequests.slice(0, 3).map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-200 transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={req.studentAvatar}
                            alt={req.studentName}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{req.studentName}</p>
                            <p className="text-[11px] text-slate-500">{req.studentEmail}</p>
                          </div>
                        </div>
                        <Badge status="Pending" size="xs" />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-purple-900 font-mono">
                          {req.credentialTitle}
                        </p>
                        <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                          {req.notes}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                        <span className="text-[10px] text-slate-400 font-mono">
                          Submitted: {req.submittedDate}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => rejectCompanyRequest(req.id, 'Claim rejected upon company records inspection.')}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => confirmCompanyRequest(req.id, `Verified by ${companyName} Credential Officer`)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                          >
                            Approve & Sign
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-center">
              <Link
                to="/company/requests"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Go to Dedicated Claims Manager →
              </Link>
            </div>
          </div>

          {/* Column 2: Issued Certificates Registry */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    <span>Issued Credentials Registry</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verifiable credentials signed with your cryptographic key
                  </p>
                </div>
                <Link
                  to="/company/issue"
                  className="text-xs font-semibold text-purple-600 hover:text-purple-700"
                >
                  + Issue New
                </Link>
              </div>

              <div className="space-y-3 my-2">
                {issuedCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-purple-200 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900">{cert.credentialTitle}</p>
                        <Badge status="Verified" size="xs" />
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Recipient: <span className="font-semibold text-slate-800">{cert.recipientName}</span> ({cert.recipientEmail})
                      </p>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                        <Hash className="w-3 h-3" />
                        <span>{cert.id}</span>
                        <span>•</span>
                        <span>{cert.issueDate}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/verify?id=${encodeURIComponent(cert.id)}`)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors shrink-0 cursor-pointer"
                    >
                      Audit
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-center">
              <Link
                to="/company/issue"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Mint Another Verifiable Credential →
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
