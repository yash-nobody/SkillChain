import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Award, 
  ShieldCheck, 
  Clock, 
  QrCode, 
  ExternalLink, 
  FolderGit2, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  Github, 
  Plus, 
  TrendingUp,
  MapPin,
  GraduationCap,
  User,
  Edit3,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';
import { Header } from '../../components/dashboard/Header';
import { StatCard } from '../../components/common/StatCard';
import { CertificateCard } from '../../components/certificate/CertificateCard';
import { CertificateDetailModal } from '../../components/certificate/CertificateDetailModal';
import { UploadCertificateModal } from '../../components/certificate/UploadCertificateModal';
import { SendToCompanyModal } from '../../components/certificate/SendToCompanyModal';
import { QRCodeModal } from '../../components/passport/QRCodeModal';
import { Badge } from '../../components/common/Badge';

export const StudentDashboard = () => {
  const { 
    currentUser, 
    studentProfile,
    certificates, 
    stats, 
    skills, 
    projects, 
    internships, 
    activities,
    isDemoUser
  } = useSkillChain();

  const [activeTab, setActiveTab] = useState('certificates');
  const [selectedCert, setSelectedCert] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isSendToCompanyOpen, setIsSendToCompanyOpen] = useState(false);
  const [certToSend, setCertToSend] = useState(null);
  const navigate = useNavigate();

  const handleViewCert = (cert) => {
    setSelectedCert(cert);
    setIsDetailOpen(true);
  };

  const handleVerifyNow = (cert) => {
    navigate(`/verify?id=${encodeURIComponent(cert.id)}`);
  };

  const handleOpenSendToCompany = (cert) => {
    setCertToSend(cert);
    setIsSendToCompanyOpen(true);
  };

  // Student display values
  const displayName = studentProfile?.fullName || currentUser?.name || 'Student';
  const displayImage = studentProfile?.profileImage || currentUser?.avatar || '';
  const displayHeadline = studentProfile?.headline || currentUser?.title || 'Student Profile';
  const displayPassportId = studentProfile?.passportId || currentUser?.passportId || 'SKC-PASSPORT-PENDING';
  const displayDegree = studentProfile?.education?.[0] 
    ? `${studentProfile.education[0].degree} @ ${studentProfile.education[0].school}`
    : (currentUser?.degree || currentUser?.institution || 'Undergraduate Degree');
  const displayLocation = studentProfile?.location || currentUser?.location || 'Location Not Specified';
  const completionRate = studentProfile?.completionPercentage || 25;

  return (
    <div>
      <Header
        pageTitle="Student Dashboard"
        pageSubtitle="Manage your verifiable credentials, skills, and digital passport"
        actionButton={
          <div className="flex items-center gap-2">
            <Link
              to="/student/profile"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-2xs transition-all"
            >
              <Edit3 className="w-4 h-4 text-slate-500" />
              <span>Edit Profile</span>
            </Link>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Certificate</span>
            </button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Profile Overview Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-100/50 via-purple-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            
            {/* Student avatar & details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 border-2 border-slate-200 overflow-hidden ring-4 ring-brand-100 shadow-md flex items-center justify-center">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-slate-400" />
                  )}
                </div>
                <div 
                  className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white shadow-sm"
                  title="Cryptographically Verified Student Identity"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {displayName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                    Profile: {completionRate}% Complete
                  </span>
                  {isDemoUser && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                      Demo Account
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-slate-700">
                  {displayHeadline}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    {displayDegree}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {displayLocation}
                  </span>
                  <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    ID: {displayPassportId}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Passport Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <Link
                to="/student/profile"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Profile</span>
              </Link>

              <button
                onClick={() => setIsQROpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-brand-600" />
                <span>Passport QR Key</span>
              </button>

              <Link
                to="/passport"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>View Full Skill Passport</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>

        {/* Verifiable Trust Index Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 rounded-3xl p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_60%)]" />
          <div className="relative z-10 space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                Verifiable Trust Index
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                Evidence-Based Protocol
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-200">
              Your Trust Index is calculated strictly from verified credentials and audited experience.
            </p>
            <p className="text-xs text-slate-400">
              Guaranteed base: 60/100 • Verified certificates: +5 each (max +20) • Experience: +5 each (max +10) • Projects: +5 each (max +10)
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15 shrink-0">
            <div>
              <p className="text-[11px] text-slate-300 font-medium">Audit Score</p>
              <p className="text-3xl font-extrabold text-white font-mono">
                {studentProfile?.trustScore || (isDemoUser ? 95 : 60)}<span className="text-base font-semibold text-slate-400">/100</span>
              </p>
            </div>
            <Link
              to="/passport"
              className="text-xs font-bold px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-sm"
            >
              Inspect Passport →
            </Link>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Certificates"
            value={stats.totalCerts}
            subtitle={stats.totalCerts === 0 ? "No credentials stored yet" : "Academic & Industry"}
            icon={Award}
            color="brand"
            badgeText={stats.totalCerts === 0 ? "Ready to add" : undefined}
          />
          <StatCard
            title="Verified Credentials"
            value={stats.verifiedCerts}
            subtitle={stats.verifiedCerts === 0 ? "Awaiting cryptographic audit" : "Cryptographically sealed"}
            icon={ShieldCheck}
            color="emerald"
            badgeText={stats.verifiedCerts > 0 ? "Audited" : undefined}
          />
          <StatCard
            title="Pending Verification"
            value={stats.pendingCerts}
            subtitle={stats.pendingCerts === 0 ? "Verification queue clear" : "In review queue"}
            icon={Clock}
            color="amber"
            badgeText={stats.pendingCerts > 0 ? "Action Active" : undefined}
          />
          <StatCard
            title="Passport Skills"
            value={skills.length}
            subtitle={skills.length === 0 ? "Add competencies in profile" : "Verified & self-reported"}
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Skills Summary Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Competencies & Skills Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Skills indexed for recruiter queries and verifiable credential matching
              </p>
            </div>
            <Link
              to="/student/profile"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Manage Skills ({skills.length}) →
            </Link>
          </div>

          {skills.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-800">No skills added yet.</p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Add your first skill to showcase your abilities to recruiters on your passport.
              </p>
              <Link
                to="/student/profile"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 mt-2 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skills in Profile</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-brand-200 transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900">{skill.name}</p>
                      {skill.isVerified ? (
                        <span title="Cryptographically Verified">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                          Self-Reported
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {skill.category || 'Skill'} • <span className="font-medium text-slate-700">{skill.level}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                      {skill.isVerified ? `${skill.verifiedCount || 1} proofs` : (skill.yearsOfExperience || '1 yr')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Tabs for Certificates, Projects, Internships, Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 overflow-x-auto">
            <div className="flex items-center gap-2">
              {[
                { id: 'certificates', label: `Certificates (${certificates.length})`, icon: Award },
                { id: 'projects', label: `Projects (${projects.length})`, icon: FolderGit2 },
                { id: 'internships', label: `Internships (${internships.length})`, icon: Briefcase },
                { id: 'activity', label: 'Recent Activity', icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <Link
              to="/student/certificates"
              className="text-xs font-semibold text-brand-600 hover:underline hidden sm:block whitespace-nowrap"
            >
              View Full Table
            </Link>
          </div>

          {/* TAB 1: Certificates Grid */}
          {activeTab === 'certificates' && (
            certificates.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/90 shadow-xs max-w-lg mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">No certificates added yet.</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Start building your Skill Passport by adding your achievements. Upload diplomas, course certificates, or workshop badges.
                </p>
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm cursor-pointer"
                >
                  Upload First Certificate
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {certificates.map((cert) => (
                  <CertificateCard
                    key={cert.id}
                    certificate={cert}
                    onViewDetails={handleViewCert}
                    onVerifyNow={handleVerifyNow}
                    onSendToCompany={handleOpenSendToCompany}
                  />
                ))}
              </div>
            )
          )}

          {/* TAB 2: Projects Showcase */}
          {activeTab === 'projects' && (
            projects.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/90 shadow-xs max-w-lg mx-auto space-y-2">
                <FolderGit2 className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">No projects attached yet.</h4>
                <p className="text-xs text-slate-500">
                  Link verified code repositories or lab assignments in your profile.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-premium transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          {proj.verificationBadge || 'Audited Project'}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 mb-2">
                        {proj.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {proj.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {proj.tech?.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">
                        Audited by: <span className="text-slate-600 font-medium">{proj.verifiedBy || 'SkillChain Protocol'}</span>
                      </span>
                      {proj.github && (
                        <a
                          href={proj.github}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* TAB 3: Internships Showcase */}
          {activeTab === 'internships' && (
            internships.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/90 shadow-xs max-w-lg mx-auto space-y-2">
                <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">No internship records added yet.</h4>
                <p className="text-xs text-slate-500">
                  Add past work experience in your profile to request company endorsement.
                </p>
                <Link
                  to="/student/profile"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline pt-1"
                >
                  Go to Profile Editor →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {internships.map((intern) => (
                  <div
                    key={intern.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-premium transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                          {intern.company || intern.organization}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-0.5">
                          {intern.role}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {intern.period || `${intern.startDate} - ${intern.endDate}`}
                        </p>
                      </div>
                      <Badge status={intern.isVerified ? 'Verified' : 'Pending'} />
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {intern.summary || intern.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        {intern.isVerified ? 'Verified Industry Credential' : 'Self-Reported Milestone'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* TAB 4: Recent Activity Log */}
          {activeTab === 'activity' && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs divide-y divide-slate-100">
              {activities.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Your profile is ready to be completed. Start by uploading credentials or adding your academic milestones.
                </div>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center shrink-0 mt-0.5 text-brand-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900">{act.title}</p>
                      <p className="text-xs text-slate-600">{act.detail}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                      {act.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>

      {/* Modals */}
      <CertificateDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        certificate={selectedCert}
        onSendToCompany={(cert) => {
          setIsDetailOpen(false);
          handleOpenSendToCompany(cert);
        }}
      />

      <UploadCertificateModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      <SendToCompanyModal
        isOpen={isSendToCompanyOpen}
        onClose={() => {
          setIsSendToCompanyOpen(false);
          setCertToSend(null);
        }}
        certificate={certToSend}
      />

      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
      />
    </div>
  );
};
