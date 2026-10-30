import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Briefcase, 
  Building2, 
  Lock, 
  QrCode, 
  Search, 
  Cpu, 
  FileCheck2, 
  ChevronRight
} from 'lucide-react';
import { useSkillChain } from '../context/SkillChainContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const LandingPage = () => {
  const [searchCertId, setSearchCertId] = useState('');
  const { isAuthenticated, currentRole } = useSkillChain();
  const navigate = useNavigate();

  const handleHeroVerify = (e) => {
    e.preventDefault();
    if (searchCertId.trim()) {
      navigate(`/verify?id=${encodeURIComponent(searchCertId.trim())}`);
    } else {
      navigate('/verify');
    }
  };

  const getStartedDestination = isAuthenticated 
    ? (currentRole === 'company' ? '/company' : currentRole === 'recruiter' ? '/recruiter' : currentRole === 'admin' ? '/admin' : '/student')
    : '/register';

  const stats = [
    { label: 'Verifiable Passports', value: '14,800+' },
    { label: 'Partner Issuers & Academies', value: '480+' },
    { label: 'Fraud Detection Rate', value: '99.8%' },
    { label: 'Instant Verification Latency', value: '< 2.4s' },
  ];

  const features = [
    {
      icon: QrCode,
      title: 'Digital Skill Passport',
      description: 'A unified, portable digital profile consolidating your academic honors, project milestones, and company credentials into one shareable verified portfolio.',
      badge: 'Student First'
    },
    {
      icon: Lock,
      title: 'Tamper-Proof Cryptographic Signatures',
      description: 'Each certificate is anchored with unique SHA-256 hashes and institutional cryptographic keys, preventing fake diplomas and resume inflation.',
      badge: 'Zero Fraud'
    },
    {
      icon: Cpu,
      title: 'AI-Powered Skill Taxonomy',
      description: 'Automated skill mapping breaks course syllabi and capstones down into granular, industry-standard competencies with proficiency benchmarks.',
      badge: 'AI Mapping'
    },
    {
      icon: Building2,
      title: 'Seamless Corporate Issuer Suite',
      description: 'Companies and bootcamps can mint verifiable internship completion badges and course credentials directly to student profiles in seconds.',
      badge: 'For Issuers'
    },
    {
      icon: Search,
      title: 'Recruiter Direct Talent Search',
      description: 'Filter candidate pipelines by audited skills, verified grades, and verified project contributions without back-and-forth manual screening.',
      badge: 'For Recruiters'
    },
    {
      icon: FileCheck2,
      title: 'Universal Instant Verification',
      description: 'Anyone with a certificate ID or QR code can instantly audit credentials against the distributed ledger without needing an account.',
      badge: 'Public Audit'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Students Learn & Submit',
      description: 'Students complete degrees, online courses, hackathons, or internships and upload certificates or project evidence into their SkillChain portal.',
    },
    {
      number: '02',
      title: 'Issuers Digitally Sign',
      description: 'Authorized universities and companies review and cryptographically sign the claim using immutable digital keys and verifiable hashes.',
    },
    {
      number: '03',
      title: 'Passport Generated & Updated',
      description: 'The student receives a dynamic, shareable Digital Skill Passport with verified skill badges, trust scores, and an encrypted QR key.',
    },
    {
      number: '04',
      title: 'Recruiters Verify & Hire',
      description: 'Employers discover verified talent with 100% confidence, reducing credential verification delays from weeks to seconds.',
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-100">
        
        {/* Decorative background glow & grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/15 via-accent-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Top Announcement Pill */}
            <Link 
              to="/passport"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200/80 text-xs font-semibold mb-6 shadow-xs hover:scale-105 transition-transform cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>SkillChain 2.0: AI-Powered Verifiable Credential Passport</span>
              <ChevronRight className="w-3 h-3 text-brand-400" />
            </Link>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Your Skills. <br className="hidden sm:inline" />
              <span className="gradient-text">Your Proof. </span>
              Your Future.
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              SkillChain empowers students to build tamper-proof digital skill profiles containing verified certificates, internships, and technical projects. Companies issue authentic credentials, and recruiters hire with 100% confidence.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to={getStartedDestination}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{isAuthenticated ? 'Go to Your Workspace' : 'Get Started as Student'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/passport"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-brand-600" />
                <span>Explore Live Passport Demo</span>
              </Link>
            </div>

            {/* Interactive Hero Verifier Widget */}
            <div className="mt-12 max-w-xl mx-auto bg-white p-2.5 rounded-2xl shadow-premium border border-slate-200/90">
              <form onSubmit={handleHeroVerify} className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchCertId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Enter Certificate ID (e.g. SKC-2026-89412-V)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-slate-400 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verify Now</span>
                </button>
              </form>
              <div className="mt-2 flex items-center justify-between px-2 text-[11px] text-slate-500">
                <span>Try sample: <code className="text-brand-600 font-mono cursor-pointer hover:underline" onClick={() => setSearchCertId('SKC-2026-89412-V')}>SKC-2026-89412-V</code></span>
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Realtime Cryptographic Check
                </span>
              </div>
            </div>

          </div>

          {/* Metrics bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 border-t border-slate-200/80 pt-10">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/60 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Role Selector Cards / Stakeholder Ecosystem */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">
              Multi-Stakeholder Architecture
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Built for every actor in the skill economy
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Student Card */}
            <div className="rounded-2xl p-6 bg-gradient-to-b from-brand-50/40 to-white border border-brand-200/80 shadow-xs hover:shadow-premium transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center mb-4 shadow-md shadow-brand-500/20">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Students & Graduates
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-1 mb-2">
                  Own your verifiable achievements
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Consolidate university degrees, hackathon wins, online certificates, and verified internships into an untamperable digital passport with a single QR code.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 font-medium mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>One-click credential upload & claim</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Cryptographic proof of work & project code</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Shareable passport link for resume & LinkedIn</span>
                  </li>
                </ul>
              </div>
              <Link
                to={isAuthenticated && currentRole === 'student' ? '/student' : '/login'}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center text-brand-700 bg-brand-100/80 hover:bg-brand-200 transition-colors"
              >
                Launch Student Dashboard →
              </Link>
            </div>

            {/* Company Card */}
            <div className="rounded-2xl p-6 bg-gradient-to-b from-purple-50/40 to-white border border-purple-200/80 shadow-xs hover:shadow-premium transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-md shadow-purple-500/20">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                  Companies & Issuers
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-1 mb-2">
                  Issue cryptographically signed credentials
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Award verified internship badges, boot camp diplomas, and corporate training certificates that cannot be faked or tampered with.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 font-medium mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Instant credential minting simulator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Review incoming student verification claims</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Enhance employer brand and alumni trust</span>
                  </li>
                </ul>
              </div>
              <Link
                to={isAuthenticated && currentRole === 'company' ? '/company' : '/login'}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center text-purple-700 bg-purple-100/80 hover:bg-purple-200 transition-colors"
              >
                Launch Issuer Portal →
              </Link>
            </div>

            {/* Recruiter Card */}
            <div className="rounded-2xl p-6 bg-gradient-to-b from-blue-50/40 to-white border border-blue-200/80 shadow-xs hover:shadow-premium transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Recruiters & Employers
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-1 mb-2">
                  Hire verified talent with zero fraud
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Search candidate talent pools based on cryptographically proven skills, verified project capstones, and institutional endorsements.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 font-medium mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Audit candidate skills without phone screening</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Multi-facet skill search with Trust Index ranking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Save candidates to talent pipelines instantly</span>
                  </li>
                </ul>
              </div>
              <Link
                to={isAuthenticated && currentRole === 'recruiter' ? '/recruiter' : '/login'}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center text-blue-700 bg-blue-100/80 hover:bg-blue-200 transition-colors"
              >
                Launch Recruiter Search →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
              Core Platform Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Engineered for absolute trust and verifiable competence
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Traditional resumes rely on honor codes. SkillChain replaces guesswork with cryptographic proof, verifiable hashes, and AI-audited skill taxonomies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-premium hover:border-brand-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center">
                      <feat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
              Step-by-Step Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              How SkillChain works from start to finish
            </h2>
            <p className="mt-4 text-base text-slate-600">
              A frictionless lifecycle connecting educational institutions, students, and employers into a single chain of verifiable trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className="relative bg-slate-50 rounded-2xl p-6 border border-slate-200/70 hover:border-brand-200 transition-colors"
              >
                <div className="text-3xl font-extrabold text-brand-500/30 mb-3 font-mono">
                  {step.number}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-brand-600 to-accent-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to build your Verifiable Skill Passport?
          </h2>
          <p className="mt-4 text-base text-brand-100 max-w-2xl mx-auto">
            Join thousands of students and leading technology enterprises pioneering the future of verifiable credentials.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={getStartedDestination}
              className="px-7 py-3 rounded-xl bg-white text-slate-900 text-sm font-bold shadow-lg hover:bg-slate-50 transition-all hover:scale-105 cursor-pointer"
            >
              Get Started Free
            </Link>
            <Link
              to="/verify"
              className="px-7 py-3 rounded-xl bg-brand-700/60 hover:bg-brand-700 text-white text-sm font-bold border border-brand-400/40 transition-all cursor-pointer"
            >
              Verify Any Credential
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
