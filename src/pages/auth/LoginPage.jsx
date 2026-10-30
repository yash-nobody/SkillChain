import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Sparkles, Lock, Mail, Info, AlertCircle } from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';
import { demoAccounts } from '../../data/mockData';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const LoginPage = () => {
  const { login, logout, isAuthenticated, currentUser, currentRole } = useSkillChain();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('alex.chen@stanford.edu');
  const [password, setPassword] = useState('demo-password-123');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user was redirected from a protected route
  const attemptedDestination = location.state?.from?.pathname;

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setErrorMessage('');
    const matched = demoAccounts.find(a => a.role === roleKey);
    if (matched) {
      setEmail(matched.email);
    }
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case 'company': return '/company';
      case 'recruiter': return '/recruiter';
      case 'admin': return '/admin';
      case 'student':
      default: return '/student';
    }
  };

  const handleFormLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await login(selectedRole, { email, password });
      setIsLoading(false);

      if (result && result.success === false) {
        setErrorMessage(result.message || 'Invalid email or password.');
        return;
      }

      const roleToNavigate = result?.user?.role || selectedRole;
      const targetDashboard = getDashboardPath(roleToNavigate);
      if (attemptedDestination && attemptedDestination.startsWith(`/${roleToNavigate}`)) {
        navigate(attemptedDestination, { replace: true });
      } else {
        navigate(targetDashboard, { replace: true });
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Server unavailable or authentication failed. Please try again.');
    }
  };

  const handleQuickDemoClick = async (roleKey) => {
    setErrorMessage('');
    await login(roleKey);
    const targetDashboard = getDashboardPath(roleKey);
    navigate(targetDashboard, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-premium">
          
          {/* Logo & Heading */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-500/20 mb-3">
              <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Sign In to SkillChain
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select a demo profile to test role-based dashboards and verifiable credentials
            </p>
          </div>

          {/* Notice if redirected from an unauthorized or protected route */}
          {attemptedDestination && (
            <div className="mb-5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Required</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  You must sign in with an authorized account to access <code className="font-mono bg-amber-100/60 px-1 rounded">{attemptedDestination}</code>.
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-rose-900">{errorMessage}</p>
                {errorMessage.includes('Account not found') && (
                  <Link
                    to="/register"
                    className="inline-block font-bold text-brand-600 hover:underline pt-0.5"
                  >
                    Click here to create a new student account →
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* If already authenticated, show current session status */}
          {isAuthenticated && currentUser ? (
            <div className="mb-6 p-4 rounded-2xl bg-brand-50/70 border border-brand-200 text-center space-y-3">
              <div className="flex items-center justify-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-200"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-brand-700 font-semibold capitalize">Active Role: {currentRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  to={getDashboardPath(currentRole)}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
                >
                  Continue to {currentRole.toUpperCase()} Dashboard →
                </Link>
                <button
                  onClick={() => logout()}
                  className="py-2 px-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : null}

          {/* 1-Click Demo Accounts Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>1-Click Demo Profiles</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Click to sign in instantly</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {demoAccounts.map((acc) => {
                const isSelected = selectedRole === acc.role;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleQuickDemoClick(acc.role)}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all hover:shadow-subtle cursor-pointer ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/40 ring-1 ring-brand-500/50'
                        : 'border-slate-200/90 hover:border-brand-300 bg-white'
                    }`}
                  >
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-9 h-9 rounded-xl object-cover shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {acc.name}
                        </span>
                      </div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded mt-0.5">
                        {acc.role}
                      </span>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {acc.email}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 font-semibold uppercase tracking-wider">
                Or Sign In With Form
              </span>
            </div>
          </div>

          {/* Role Selection Tabs for form */}
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Role for Credentials
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl">
              {[
                { id: 'student', label: 'Student' },
                { id: 'company', label: 'Company' },
                { id: 'recruiter', label: 'Recruiter' },
                { id: 'admin', label: 'Admin' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleSelect(r.id)}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all capitalize cursor-pointer ${
                    selectedRole === r.id
                      ? 'bg-white text-brand-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleFormLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Enter your secure account password</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{isLoading ? 'Verifying Credentials...' : `Sign In as ${selectedRole.toUpperCase()} & Go to Dashboard`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Security & Architecture Note */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-[11px] text-slate-400 text-center leading-relaxed">
            <span className="font-semibold text-slate-600">Demo Mode Notice:</span> Client-side localStorage simulation. In production, authentication and role permissions will be enforced securely via Node.js/Express API endpoints and HTTP-only session cookies.
          </div>

          <div className="mt-4 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:underline">
              Register as Student, Company, or Recruiter
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
