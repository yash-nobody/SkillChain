import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckSquare, 
  Users, 
  Building2, 
  CheckCircle2, 
  Search, 
  Activity, 
  Server, 
  FileCheck2 
} from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';
import { Header } from '../../components/dashboard/Header';
import { StatCard } from '../../components/common/StatCard';

export const AdminDashboard = () => {
  const { 
    verificationRequests, 
    approveRequest, 
    rejectRequest, 
    platformStats, 
    candidates,
    showToast 
  } = useSkillChain();

  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'students' | 'companies' | 'audit'
  const [searchQuery, setSearchQuery] = useState('');

  const [companyList, setCompanyList] = useState([
    { id: 'iss-01', name: 'Acme Cloud Technologies', category: 'Enterprise Cloud', status: 'Accredited', keyId: 'KEY-ACME-01', certsIssued: 248 },
    { id: 'iss-02', name: 'Stanford EECS Lab', category: 'Academic Institution', status: 'Accredited', keyId: 'KEY-STAN-02', certsIssued: 1420 },
    { id: 'iss-03', name: 'Meta Open Source', category: 'Technology Partner', status: 'Accredited', keyId: 'KEY-META-03', certsIssued: 890 },
    { id: 'iss-04', name: 'DeepLearning.AI', category: 'AI Education', status: 'Accredited', keyId: 'KEY-DEEP-04', certsIssued: 610 },
    { id: 'iss-05', name: 'Web3 Security Guild', category: 'Community Auditor', status: 'Pending Review', keyId: 'KEY-WEB3-05', certsIssued: 34 }
  ]);

  const pendingRequests = verificationRequests.filter(r => r.status === 'Pending');

  const toggleCompanyStatus = (companyId) => {
    setCompanyList(prev =>
      prev.map(c => {
        if (c.id === companyId) {
          const nextStatus = c.status === 'Accredited' ? 'Suspended' : 'Accredited';
          showToast(`Issuer ${c.name} status updated to ${nextStatus}`, 'info');
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  return (
    <div>
      <Header
        pageTitle="Platform Governance & Admin"
        pageSubtitle="Audit network verifications, manage institutions, and enforce compliance"
        actionButton={
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Root Authority Node</span>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Governance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Verified Credentials"
            value={platformStats.totalVerifiedCertificates.toLocaleString()}
            subtitle="Anchored on ledger"
            icon={FileCheck2}
            color="brand"
            trend={14}
          />
          <StatCard
            title="Pending Queue"
            value={pendingRequests.length}
            subtitle="Claims awaiting protocol sign"
            icon={Activity}
            color="amber"
            badgeText="Queue Active"
          />
          <StatCard
            title="Fraud Detection Rate"
            value={`${platformStats.fraudDetectionRatePercent}%`}
            subtitle="Zero fraudulent diplomas"
            icon={ShieldAlert}
            color="emerald"
            badgeText="Secure"
          />
          <StatCard
            title="Accredited Issuers"
            value={companyList.filter(c => c.status === 'Accredited').length}
            subtitle="Verified universities & corps"
            icon={Building2}
            color="purple"
            trend={8}
          />
        </div>

        {/* Admin Navigation Tabs */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              {[
                { id: 'queue', label: `Verification Queue (${pendingRequests.length})`, icon: CheckSquare },
                { id: 'students', label: `Manage Students (${candidates.length})`, icon: Users },
                { id: 'companies', label: `Manage Issuers (${companyList.length})`, icon: Building2 },
                { id: 'audit', label: 'Cryptographic Audit Trail', icon: Server }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick search input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quick filter entries..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* TAB 1: Pending Verification Queue */}
          {activeTab === 'queue' && (
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <div className="p-10 text-center bg-slate-50 rounded-2xl border border-slate-200/80">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-900">Verification Queue is Clear</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    All submitted credentials have been resolved by compliance officers.
                  </p>
                </div>
              ) : (
                pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.studentAvatar}
                          alt={req.studentName}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{req.studentName}</h4>
                            <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                              {req.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{req.studentEmail}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-brand-900">
                          {req.credentialTitle}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Claimed Institution: <span className="font-semibold text-slate-800">{req.issuingOrg}</span> • Course Ref: <span className="font-mono text-slate-600">{req.courseId}</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-1 bg-white p-2 rounded-lg border border-slate-200/60">
                          Note: "{req.notes}"
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {req.skillsClaimed?.map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-white text-slate-700 border border-slate-200">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
                      <button
                        onClick={() => rejectRequest(req.id, 'Claim rejected by platform compliance authority.')}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                      >
                        Reject Claim
                      </button>

                      <button
                        onClick={() => approveRequest(req.id, 'SkillChain Governance Authority Root Key #AUTH-001')}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Anchor</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Manage Students Directory */}
          {activeTab === 'students' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3">Student</th>
                    <th className="px-5 py-3">University</th>
                    <th className="px-5 py-3">Passport ID</th>
                    <th className="px-5 py-3">Trust Index</th>
                    <th className="px-5 py-3">Verified Certs</th>
                    <th className="px-5 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {candidates.map((cand) => (
                    <tr key={cand.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img src={cand.avatar} alt={cand.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-slate-900">{cand.name}</p>
                            <p className="text-[11px] text-slate-400">{cand.primaryRole}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{cand.university}</td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-brand-600">{cand.passportId}</td>
                      <td className="px-5 py-3.5 font-bold text-emerald-700">{cand.trustScore}/100</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">{cand.verifiedCertsCount} Verified</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: Manage Issuers & Companies Directory */}
          {activeTab === 'companies' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3">Issuing Organization</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Signing Key ID</th>
                    <th className="px-5 py-3">Certs Issued</th>
                    <th className="px-5 py-3">Authority Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {companyList.map((company) => (
                    <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">{company.name}</p>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{company.category}</td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-purple-700">{company.keyId}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">{company.certsIssued}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          company.status === 'Accredited'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : company.status === 'Suspended'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {company.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => toggleCompanyStatus(company.id)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          {company.status === 'Accredited' ? 'Suspend' : 'Accredit'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: Cryptographic Audit Trail */}
          {activeTab === 'audit' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 space-y-2 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    SkillChain Consensus Engine v2.4 (Mainnet)
                  </span>
                  <span>Ledger Block #18951204</span>
                </div>

                <div className="space-y-1.5 pt-1 text-[11px]">
                  <p className="text-slate-300">
                    <span className="text-purple-400">[BLOCK 18951204]</span> MINT_VERIFIED_CREDENTIAL id=<span className="text-brand-300">SKC-2026-89412-V</span> root_sig=<span className="text-emerald-300">0x8f2b98e1a90c4d21e873b526da0f3408</span>
                  </p>
                  <p className="text-slate-300">
                    <span className="text-purple-400">[BLOCK 18951203]</span> IDENTITY_PASSPORT_UPDATE subject=<span className="text-brand-300">alex.chen@stanford.edu</span> trust_score=<span className="text-emerald-300">98</span>
                  </p>
                  <p className="text-slate-300">
                    <span className="text-purple-400">[BLOCK 18951202]</span> ISSUER_KEY_VALIDATED issuer=<span className="text-brand-300">Acme Cloud Technologies</span> key=<span className="text-emerald-300">ED25519-ACME-994</span>
                  </p>
                  <p className="text-slate-300">
                    <span className="text-purple-400">[BLOCK 18951201]</span> FRAUD_CHECK_PASSED target_hash=<span className="text-brand-300">0x3c71a94f6e1820b9e8471b02938a1cf8</span> result=<span className="text-emerald-300">AUTHENTIC_VALID</span>
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
