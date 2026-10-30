import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut, Lock } from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const AccessDeniedPage = ({ attemptedPath, allowedRoles = [] }) => {
  const { currentUser, currentRole, logout } = useSkillChain();
  const navigate = useNavigate();

  const getDashboardPath = (role) => {
    switch (role) {
      case 'company':
        return '/company';
      case 'recruiter':
        return '/recruiter';
      case 'admin':
        return '/admin';
      case 'student':
      default:
        return '/student';
    }
  };

  const roleLabels = {
    student: 'Student Dashboard',
    company: 'Company / Issuer Portal',
    recruiter: 'Recruiter Hub',
    admin: 'Platform Admin Dashboard'
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-premium text-center space-y-6">
          
          {/* 403 Badge Icon */}
          <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Lock className="w-3 h-3" />
              <span>403 Forbidden • Access Denied</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Restricted Area
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2">
              You do not have the required permissions to access{' '}
              <code className="text-rose-600 font-mono font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                {attemptedPath || 'this route'}
              </code>.
            </p>
          </div>

          {/* Current Session Context */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Authenticated User:</span>
              <span className="font-bold text-slate-900">{currentUser?.name || 'Anonymous User'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Your Active Role:</span>
              <span className="font-bold text-brand-700 uppercase bg-brand-50 border border-brand-200 px-2 py-0.5 rounded">
                {currentRole || 'None'}
              </span>
            </div>
            {allowedRoles.length > 0 && (
              <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 font-medium">Permitted Roles:</span>
                <span className="font-mono text-[11px] text-slate-700 font-semibold">
                  {allowedRoles.join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <Link
              to={getDashboardPath(currentRole)}
              className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to {roleLabels[currentRole] || 'My Dashboard'}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-slate-500" />
              <span>Sign Out / Switch Account</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            SkillChain security enforces role-based routing guards. Normal accounts cannot self-elevate permissions.
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
};
