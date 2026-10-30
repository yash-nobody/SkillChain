import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Award, 
  QrCode, 
  Send, 
  Search, 
  CheckSquare, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  User
} from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { currentRole, currentUser, logout } = useSkillChain();
  const navigate = useNavigate();

  // Role navigation links
  const studentNav = [
    { label: 'Overview', path: '/student', icon: LayoutDashboard },
    { label: 'My Profile', path: '/student/profile', icon: User },
    { label: 'My Certificates', path: '/student/certificates', icon: Award },
    { label: 'Skill Passport', path: '/passport', icon: QrCode, badge: 'Public' },
    { label: 'Verify Credential', path: '/verify', icon: ShieldCheck },
  ];

  const companyNav = [
    { label: 'Issuer Overview', path: '/company', icon: LayoutDashboard },
    { label: 'Issue Certificate', path: '/company/issue', icon: Send, badge: 'Mint' },
    { label: 'Review Requests', path: '/company/requests', icon: CheckSquare, badge: '3' },
    { label: 'Verify Credential', path: '/verify', icon: ShieldCheck },
  ];

  const recruiterNav = [
    { label: 'Talent Search', path: '/recruiter', icon: Search },
    { label: 'Skill Passport Explorer', path: '/passport', icon: QrCode },
    { label: 'Verify Credential', path: '/verify', icon: ShieldCheck },
  ];

  const adminNav = [
    { label: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Global Verifier', path: '/verify', icon: ShieldCheck },
    { label: 'Skill Passport Explorer', path: '/passport', icon: QrCode },
  ];

  const navMap = {
    student: studentNav,
    company: companyNav,
    recruiter: recruiterNav,
    admin: adminNav,
  };

  const navItems = navMap[currentRole] || studentNav;

  const roleLabels = {
    student: 'Student Workspace',
    company: 'Issuer Organization',
    recruiter: 'Recruiter Hub',
    admin: 'Platform Governance'
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Skill<span className="text-brand-600">Chain</span>
            </span>
          </Link>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
            {currentRole || 'User'}
          </span>
        </div>

        {/* Role indicator banner inside sidebar */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Active Workspace
          </p>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-xs font-bold text-slate-800">
              {roleLabels[currentRole] || 'Workspace'}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === '/student' || item.path === '/company' || item.path === '/admin'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 shadow-xs border border-brand-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-600" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-brand-100 text-brand-700">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* User Card at bottom */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/60">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={currentUser?.name || 'User Avatar'}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {currentUser?.name || 'Demo User'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {currentUser?.email || ''}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 text-center">
            <Link
              to="/"
              className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 flex items-center justify-center gap-1"
            >
              <span>Back to Public Website</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};
