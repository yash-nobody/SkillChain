import React from 'react';
import { Menu, QrCode } from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';
import { Link } from 'react-router-dom';

export const Header = ({ setMobileOpen, pageTitle, pageSubtitle, actionButton }) => {
  const { currentRole, currentUser } = useSkillChain();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Mobile hamburger + Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open sidebar"
            className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{pageTitle}</span>
            </h1>
            {pageSubtitle && (
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {pageSubtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Action button passed from page (e.g. Upload Cert or Issue Cert) */}
          {actionButton}

          {/* Quick link to passport if student */}
          {currentRole === 'student' && (
            <Link
              to="/passport"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-brand-600" />
              <span>View Passport</span>
            </Link>
          )}

          {/* Network Status Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Mainnet Verifier v2.4</span>
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={currentUser?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-none">{currentUser?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 capitalize font-medium mt-0.5">{currentRole || 'Role'}</p>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
