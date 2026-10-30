import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Globe, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Skill<span className="text-brand-400">Chain</span>
              </span>
            </Link>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The modern, verifiable skill passport for the next generation of engineers, creators, and innovators. Powered by cryptographic proof and AI-assisted skill auditing.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>SkillChain Decentralized Ledger: 100% Operational</span>
            </div>

            <div className="flex items-center gap-4 pt-2 text-slate-400">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="GitHub Repository"
                className="hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Twitter Profile"
                className="hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="LinkedIn Profile"
                className="hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column: For Students */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              For Students
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/student" className="hover:text-white transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/passport" className="hover:text-white transition-colors">
                  Digital Skill Passport
                </Link>
              </li>
              <li>
                <Link to="/student/certificates" className="hover:text-white transition-colors">
                  Certificate Wallet
                </Link>
              </li>
              <li>
                <Link to="/student/certificates" className="hover:text-white transition-colors">
                  Upload Credential
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: For Issuers & Companies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              For Issuers
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/company" className="hover:text-white transition-colors">
                  Company Dashboard
                </Link>
              </li>
              <li>
                <Link to="/company/issue" className="hover:text-white transition-colors">
                  Issue Certificates
                </Link>
              </li>
              <li>
                <Link to="/company/requests" className="hover:text-white transition-colors">
                  Verify Student Claims
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-white transition-colors">
                  Instant Verification Tool
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: For Recruiters & Admin */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Ecosystem
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/recruiter" className="hover:text-white transition-colors">
                  Recruiter Talent Search
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Governance & Compliance
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-white transition-colors">
                  Tamper Proof Registry
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Demo Role Switcher
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SkillChain Protocol Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-brand-400" />
              W3C Verifiable Credentials Standard
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-accent-400" />
              Cryptographic SHA-256
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
