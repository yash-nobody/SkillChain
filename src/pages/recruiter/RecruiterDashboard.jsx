import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  GraduationCap, 
  MapPin, 
  CheckCircle2, 
  QrCode, 
  Users,
  Bookmark
} from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';
import { Header } from '../../components/dashboard/Header';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Link } from 'react-router-dom';

export const RecruiterDashboard = () => {
  const { candidates, toggleShortlistCandidate, showToast, certificates } = useSkillChain();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('ALL');
  const [minTrustScore, setMinTrustScore] = useState(90);
  const [onlyShortlisted, setOnlyShortlisted] = useState(false);
  const [previewCandidate, setPreviewCandidate] = useState(null);

  const availableSkills = ['ALL', 'Go', 'React', 'Kubernetes', 'Python', 'PyTorch', 'Rust', 'TypeScript', 'PostgreSQL'];

  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = 
      cand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.primaryRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.topSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkill = selectedSkill === 'ALL' || cand.topSkills.includes(selectedSkill);
    const matchesTrust = cand.trustScore >= minTrustScore;
    const matchesShortlist = !onlyShortlisted || cand.shortlisted;

    return matchesSearch && matchesSkill && matchesTrust && matchesShortlist;
  });

  const handleOpenDossier = (cand) => {
    setPreviewCandidate(cand);
  };

  const handleContactCandidate = (cand) => {
    showToast(`Interview invitation sent directly to ${cand.name}!`, 'success');
  };

  return (
    <div>
      <Header
        pageTitle="Recruiter Talent Hub"
        pageSubtitle="Discover and hire pre-vetted engineers with cryptographically verified achievements"
        actionButton={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyShortlisted(!onlyShortlisted)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                onlyShortlisted 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Pipeline ({candidates.filter(c => c.shortlisted).length})</span>
            </button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Talent Search & Filter Controls */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates by role, university, or verified skill..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Min Trust Slider */}
            <div className="flex items-center gap-3 w-full md:w-auto bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shrink-0">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
                Min Trust Index: <span className="text-blue-600 font-extrabold">{minTrustScore}</span>
              </span>
              <input
                type="range"
                min="80"
                max="98"
                value={minTrustScore}
                onChange={(e) => setMinTrustScore(Number(e.target.value))}
                className="w-24 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Skill Tags */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
              Filter Skill:
            </span>
            {availableSkills.map((sk) => (
              <button
                key={sk}
                onClick={() => setSelectedSkill(sk)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSkill === sk
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {sk}
              </button>
            ))}
          </div>

        </div>

        {/* Candidate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs max-w-md mx-auto">
              <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-900">No matching candidates</h4>
              <p className="text-xs text-slate-500 mt-1">
                Try lowering the minimum trust score or removing skill filters.
              </p>
            </div>
          ) : (
            filteredCandidates.map((cand) => (
              <div
                key={cand.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-premium transition-all flex flex-col justify-between"
              >
                <div>
                  
                  {/* Top Bar: Avatar, Name, Trust Score, Bookmark */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={cand.avatar}
                        alt={cand.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-100 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-slate-900 leading-tight">
                            {cand.name}
                          </h3>
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-xs font-semibold text-blue-700">
                          {cand.primaryRole}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleShortlistCandidate(cand.id)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        cand.shortlisted 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                      }`}
                      title={cand.shortlisted ? 'In Pipeline' : 'Shortlist Candidate'}
                    >
                      <Bookmark className={`w-4 h-4 ${cand.shortlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Education & Location */}
                  <div className="space-y-1 text-xs text-slate-500 mb-4">
                    <p className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-700">{cand.university}</span> • {cand.degree}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cand.location}</span>
                    </p>
                  </div>

                  {/* Trust Score & Verified Stats */}
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/70 mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Trust Index
                      </p>
                      <p className="text-base font-extrabold text-blue-700">
                        {cand.trustScore}/100
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Verified Proofs
                      </p>
                      <p className="text-xs font-bold text-slate-800">
                        {cand.verifiedCertsCount} Certs
                      </p>
                    </div>
                  </div>

                  {/* Top Verified Skills Tags */}
                  <div className="mb-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Audited Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {cand.topSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {cand.bio}
                  </p>

                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDossier(cand)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-center cursor-pointer"
                  >
                    View Dossier
                  </button>

                  <Link
                    to="/passport"
                    className="py-2 px-3 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1"
                    title="Open Live Public Passport"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Passport</span>
                  </Link>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

      {/* Candidate Dossier Inspection Modal */}
      {previewCandidate && (
        <Modal
          isOpen={!!previewCandidate}
          onClose={() => setPreviewCandidate(null)}
          title={`Candidate Dossier: ${previewCandidate.name}`}
          subtitle={`Verified Skill Passport #${previewCandidate.passportId}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6">
            
            {/* Candidate Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <img
                  src={previewCandidate.avatar}
                  alt={previewCandidate.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-100 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{previewCandidate.name}</h3>
                    <Badge status="Verified" size="sm" />
                  </div>
                  <p className="text-xs font-semibold text-blue-700">{previewCandidate.primaryRole}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {previewCandidate.university} • {previewCandidate.degree}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
                  Trust Score: {previewCandidate.trustScore}/100
                </span>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  {previewCandidate.availability}
                </p>
              </div>
            </div>

            {/* Candidate Bio */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Candidate Summary
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {previewCandidate.bio}
              </p>
            </div>

            {/* Verified Skills & Proofs */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Audited Competencies
              </h4>
              <div className="flex flex-wrap gap-2">
                {previewCandidate.topSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{sk}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Verified Credentials in Profile */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Verified Credentials on Record
              </h4>
              <div className="space-y-2">
                {certificates.slice(0, 3).map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{c.title}</p>
                      <p className="text-[11px] text-slate-500">{c.issuer} • {c.issueDate}</p>
                    </div>
                    <Badge status="Verified" size="xs" />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Link
                to="/passport"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Open Full Public Skill Passport</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleShortlistCandidate(previewCandidate.id)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  {previewCandidate.shortlisted ? 'Remove from Pipeline' : 'Save to Pipeline'}
                </button>
                <button
                  onClick={() => handleContactCandidate(previewCandidate)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Schedule Interview
                </button>
              </div>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
};
