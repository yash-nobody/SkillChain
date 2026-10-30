import React, { useState } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Globe, 
  Award, 
  Briefcase, 
  FolderGit2, 
  CheckCircle2, 
  GraduationCap, 
  MapPin, 
  Sparkles,
  Lock
} from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';
import { initialMockUser } from '../../data/mockData';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Badge } from '../../components/common/Badge';
import { CertificateDetailModal } from '../../components/certificate/CertificateDetailModal';
import { QRCodeModal } from '../../components/passport/QRCodeModal';

export const DigitalSkillPassport = () => {
  const { 
    currentUser, 
    currentRole, 
    isDemoUser, 
    studentProfile: activeProfile, 
    certificates, 
    skills, 
    projects, 
    internships, 
    showToast 
  } = useSkillChain();
  
  // Use real authenticated student profile if available, otherwise fall back to canonical demo passport
  const student = (currentRole === 'student' && activeProfile) ? activeProfile : (currentUser || initialMockUser);

  const displayName = student.fullName || student.name || 'Alex Chen';
  const displayTitle = student.headline || student.title || 'Full-Stack & Cloud Systems Engineer';
  const displayBio = student.aboutMe || student.bio || 'Computer Science senior passionate about fault-tolerant distributed systems and verifiable credentials.';
  const displayAvatar = student.profileImage || student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80';
  const displayLocation = student.location || 'Stanford, CA';
  const displayDegree = (student.education && student.education[0]?.degree) || student.degree || 'B.S. in Computer Science';
  const displayPassportId = student.passportId || 'SKC-PASSPORT-89412-AC';
  const displayTrustScore = student.trustScore !== undefined ? student.trustScore : (isDemoUser ? 95 : 60);

  const [selectedCert, setSelectedCert] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrError, setQrError] = useState(false);
  const [showTrustBreakdown, setShowTrustBreakdown] = useState(false);

  const verifiedCertificates = (certificates || []).filter(c => 
    c.status === 'Verified' || c.status === 'Company Confirmed'
  );

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showToast('Public passport URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadDossier = () => {
    showToast('Compiling verified cryptographic dossier PDF...', 'info');
  };

  const handleInspectCert = (cert) => {
    setSelectedCert(cert);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Public Shareable Header Bar */}
        <div className="bg-white rounded-2xl px-5 py-3 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Live Public Skill Passport
            </span>
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              #{studentProfile.passportId || 'SKC-PASSPORT-89412-AC'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsQROpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-brand-600" />
              <span>Show QR Key</span>
            </button>

            <button
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Public Link'}</span>
            </button>

            <button
              onClick={handleDownloadDossier}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Dossier PDF</span>
            </button>
          </div>
        </div>

        {/* Main Passport Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-premium overflow-hidden">
          
          {/* Decorative Passport Header Banner */}
          <div className="h-40 sm:h-48 bg-gradient-to-r from-slate-900 via-brand-900 to-indigo-950 p-6 sm:p-8 flex items-start justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_60%)]" />
            <div className="relative z-10 text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-brand-400" />
              <span className="text-xs uppercase font-extrabold tracking-widest text-brand-200">
                W3C Verifiable Skill Passport
              </span>
            </div>
            
            {/* Trust Index Header Pill */}
            <div 
              onClick={() => setShowTrustBreakdown(!showTrustBreakdown)}
              className="relative z-10 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-emerald-500/30 transition-all shadow-sm"
              title="Click to view Trust Index audit breakdown"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Trust Index: {displayTrustScore}/100</span>
              <span className="text-[10px] text-emerald-200/80 font-normal">▼ Details</span>
            </div>
          </div>

          {/* Elevated Solid High-Contrast Profile Identity Card */}
          <div className="px-4 sm:px-8 pb-8 pt-0 relative z-20">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl -mt-16 sm:-mt-20">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                
                {/* Left Profile Info */}
                <div className="space-y-4 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={displayAvatar}
                        alt={displayName}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-md bg-slate-100"
                      />
                      <div 
                        className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white shadow-sm"
                        title="Audited Identity"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    </div>

                    {/* High-Contrast Name & Headline */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                          {displayName}
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Verified
                        </span>
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-brand-700">
                        {displayTitle}
                      </p>
                      <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-brand-500" />
                        <span>Passport ID:</span>
                        <span className="font-bold text-slate-700">{displayPassportId}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                    {displayBio}
                  </p>

                  {/* Metadata badges */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                      <GraduationCap className="w-4 h-4 text-brand-600" />
                      {displayDegree}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {displayLocation}
                    </span>
                  </div>

                  {/* Social & Portfolio Links */}
                  <div className="flex items-center gap-2.5 pt-1">
                    {student.githubUrl || student.github ? (
                      <a
                        href={student.githubUrl || student.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span>GitHub</span>
                      </a>
                    ) : null}
                    {student.linkedinUrl || student.linkedin ? (
                      <a
                        href={student.linkedinUrl || student.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </a>
                    ) : null}
                    {student.portfolioUrl || student.website ? (
                      <a
                        href={student.portfolioUrl || student.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Portfolio</span>
                      </a>
                    ) : null}
                  </div>
                </div>

                {/* Right: QR Code & Score Summary */}
                <div className="w-full lg:w-64 bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-center shrink-0 space-y-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Verifiable Passport Key
                    </p>
                    <div 
                      onClick={() => setIsQROpen(true)}
                      className="bg-white p-2.5 rounded-xl border border-slate-200 inline-block shadow-xs cursor-pointer hover:scale-105 transition-transform"
                      title="Click to Enlarge QR Key"
                    >
                      {!qrError ? (
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(window.location.href)}`}
                          alt="QR Code"
                          className="w-24 h-24 mx-auto"
                          onError={() => setQrError(true)}
                        />
                      ) : (
                        <div className="w-24 h-24 bg-slate-900 text-brand-400 flex flex-col items-center justify-center font-mono text-xs rounded">
                          <ShieldCheck className="w-6 h-6 mb-1" />
                          <span>QR KEY</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-left">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-700">Trust Index</span>
                      <span className="font-extrabold text-emerald-600 font-mono">{displayTrustScore}/100</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-brand-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, displayTrustScore))}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {displayTrustScore === 60 ? 'Base score (60) initialized' : 'Evidence-weighted audit score'}
                    </p>
                  </div>
                </div>

              </div>

              {/* Trust Index Breakdown Panel (Expandable or visible when clicked) */}
              {showTrustBreakdown && (
                <div className="mt-6 pt-5 border-t border-slate-200/80">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Trust Index Evidence Breakdown
                      </span>
                      <span className="font-mono font-bold text-emerald-600">
                        {displayTrustScore} / 100 Total Score
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <p className="text-[11px] text-slate-500 font-medium">Base Student Score</p>
                        <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">60 pts</p>
                        <p className="text-[10px] text-slate-400">Guaranteed base</p>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <p className="text-[11px] text-slate-500 font-medium">Verified Certs</p>
                        <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                          +{Math.min(20, verifiedCertificates.length * 5)} pts
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {verifiedCertificates.length} verified (+5 each, max 20)
                        </p>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <p className="text-[11px] text-slate-500 font-medium">Verified Experience</p>
                        <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                          +{student.trustBreakdown?.experiencePoints || (isDemoUser ? 5 : 0)} pts
                        </p>
                        <p className="text-[10px] text-slate-400">+5 each (max 10)</p>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <p className="text-[11px] text-slate-500 font-medium">Verified Projects</p>
                        <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                          +{student.trustBreakdown?.projectsPoints || (isDemoUser ? 5 : 0)} pts
                        </p>
                        <p className="text-[10px] text-slate-400">+5 each (max 10)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* SECTION 1: Audited Skills Matrix */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600" />
                <span>Verified Skills Matrix</span>
              </h2>
              <p className="text-xs text-slate-500">
                Skills confirmed via accredited coursework, capstones, and institutional digital signatures
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              100% Verifiable Proof
            </span>
          </div>

          {skills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-brand-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {skill.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-brand-700">
                      {skill.level}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{skill.category}</span>
                    <span className="font-semibold text-emerald-700">{skill.verifiedCount || (skill.isVerified ? 'Verified Proof' : 'Self-Reported')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
              <Sparkles className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No Skills Added Yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Add your technical and domain competencies in <span className="font-semibold text-brand-600">My Profile</span>.
              </p>
            </div>
          )}
        </section>

        {/* SECTION 2: Verified Certificates & Credentials */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-600" />
                <span>Verified Certificates & Honors</span>
              </h2>
              <p className="text-xs text-slate-500">
                Audited credentials minted directly onto the SkillChain decentralized registry
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600">
              {verifiedCertificates.length} Verified Credentials
            </span>
          </div>

          {verifiedCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {verifiedCertificates.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => handleInspectCert(cert)}
                  className="p-5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-brand-300 hover:shadow-subtle transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                          {cert.issuerLogo ? (
                            <img src={cert.issuerLogo} alt={cert.issuer} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <Award className="w-5 h-5 text-brand-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">{cert.issuer}</p>
                          <span className="text-[11px] text-slate-400 font-mono">#{cert.id}</span>
                        </div>
                      </div>
                      <Badge status="Verified" />
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-1">
                      {cert.title}
                    </h3>

                    {cert.grade && (
                      <p className="text-xs text-emerald-700 font-semibold mb-2">
                        {cert.grade}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1 mb-3">
                      {cert.skills?.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-white text-slate-700 border border-slate-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                    <span>Issued: {cert.issueDate}</span>
                    <span className="text-brand-600 font-semibold group-hover:underline flex items-center gap-1">
                      <span>Inspect Proof</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
              <Award className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No Verified Certificates Yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Upload credentials from your Student Dashboard. Each verified certificate increases your Trust Index by +5 points (up to +20).
              </p>
            </div>
          )}
        </section>

        {/* SECTION 3: Verified Internships & Experience */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-600" />
                <span>Verified Work Experience & Internships</span>
              </h2>
              <p className="text-xs text-slate-500">
                Workplace achievements verified by corporate credential officers
              </p>
            </div>
          </div>

          {internships.length > 0 ? (
            <div className="space-y-4">
              {internships.map((intern) => (
                <div
                  key={intern.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {intern.role}
                      </h3>
                      <Badge status="Verified" />
                    </div>
                    <p className="text-xs font-semibold text-brand-700">
                      {intern.organization || intern.company} • <span className="text-slate-500 font-normal">{intern.period || `${intern.startDate || ''} - ${intern.endDate || ''}`} ({intern.location || 'Remote'})</span>
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {intern.description || intern.summary}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs shrink-0 self-start md:text-right">
                    <p className="font-semibold text-slate-800 flex items-center md:justify-end gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>{intern.verifiedStatus || (intern.isVerified ? 'Verified Experience' : 'Pending Verification')}</span>
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                      Audited: {intern.verifiedDate || 'SkillChain Protocol'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
              <Briefcase className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No Work Experience Listed Yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Add internships and roles in your profile. Verified experience earns +5 Trust Index points (up to +10).
              </p>
            </div>
          )}
        </section>

        {/* SECTION 4: Technical Projects & Achievements */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-brand-600" />
                <span>Verified Projects & Codebases</span>
              </h2>
              <p className="text-xs text-slate-500">
                Open-source capstones with verified benchmarks and peer audit seals
              </p>
            </div>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block mb-2">
                      {proj.verificationBadge || (proj.isVerified ? 'Verified Capstone' : 'Project Repo')}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {proj.tech?.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-medium bg-white text-slate-700 border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">
                      Verified: {proj.verifiedBy || 'SkillChain Protocol'}
                    </span>
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Repo</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
              <FolderGit2 className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No Projects Added Yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Add projects to showcase your technical accomplishments. Evaluated projects earn +5 Trust Index points (up to +10).
              </p>
            </div>
          )}
        </section>

      </main>

      {/* Modals */}
      <CertificateDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        certificate={selectedCert}
      />

      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
      />

      <Footer />
    </div>
  );
};
