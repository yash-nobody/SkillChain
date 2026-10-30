import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, UserCheck, Building2, Briefcase, Info, AlertCircle } from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';

export const RegisterPage = () => {
  const { registerUser, login, showToast } = useSkillChain();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    roleOrDegree: '',
    studentIdNumber: '',
    password: 'password123'
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDashboardPath = (targetRole) => {
    switch (targetRole) {
      case 'company': return '/company';
      case 'recruiter': return '/recruiter';
      case 'student':
      default: return '/student';
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = formData.email.trim().toLowerCase();
    if (!formData.name.trim() || !cleanEmail) {
      setErrorMessage('Please provide your name and email address.');
      return;
    }

    setIsSubmitting(true);

    // Call registration with backend validation & duplicate detection
    const result = await registerUser({
      name: formData.name.trim(),
      email: cleanEmail,
      role,
      studentIdNumber: formData.studentIdNumber.trim(),
      organization: formData.organization.trim(),
      roleOrDegree: formData.roleOrDegree.trim(),
      password: formData.password,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.message);
      showToast(result.message, 'error');
      return;
    }

    navigate(getDashboardPath(role), { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-premium">
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-500/20 mb-3">
              <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create Your SkillChain Passport
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select your platform role to get started with verifiable credentials
            </p>
          </div>

          {/* Duplicate Account Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-rose-900">{errorMessage}</p>
                {errorMessage.includes('already exists') && (
                  <Link
                    to="/login"
                    className="inline-block font-bold text-brand-600 hover:underline pt-0.5"
                  >
                    Click here to sign in to your existing account →
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Account Role
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Choose your account type</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'student', label: 'Student', icon: UserCheck, desc: 'Earn & Verify' },
                { id: 'company', label: 'Company', icon: Building2, desc: 'Issue & Sign' },
                { id: 'recruiter', label: 'Recruiter', icon: Briefcase, desc: 'Search & Hire' }
              ].map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setRole(r.id);
                      setErrorMessage('');
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/50 text-brand-900 shadow-xs ring-1 ring-brand-500'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-brand-600' : 'text-slate-400'}`} />
                    <p className="text-xs font-bold">{r.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{r.desc}</p>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Platform Administrator accounts are strictly provisioned by governance.</span>
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Full Name or Organization Name *
              </label>
              <input
                type="text"
                required
                placeholder={role === 'student' ? 'e.g. Jordan Lee' : role === 'company' ? 'e.g. Acme Tech Solutions' : 'e.g. Sarah Miller'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Official Email Address *
              </label>
              <input
                type="email"
                required
                placeholder={role === 'student' ? 'e.g. jordan.lee@university.edu' : 'e.g. contact@acme.com'}
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setErrorMessage('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            {role === 'student' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Student Registration / Enrollment Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. STU-2026-90412"
                  value={formData.studentIdNumber}
                  onChange={(e) => {
                    setFormData({ ...formData, studentIdNumber: e.target.value });
                    setErrorMessage('');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {role === 'student' ? 'University / College' : 'Organization Name'}
                </label>
                <input
                  type="text"
                  placeholder={role === 'student' ? 'e.g. University of California' : 'e.g. Tech Talent Inc.'}
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  {role === 'student' ? 'Degree & Major' : 'Title / Role Focus'}
                </label>
                <input
                  type="text"
                  placeholder={role === 'student' ? 'B.S. Software Engineering' : 'Technical Sourcer'}
                  value={formData.roleOrDegree}
                  onChange={(e) => setFormData({ ...formData, roleOrDegree: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Verifying & Initializing...' : `Register as ${role.toUpperCase()} & Enter Clean Dashboard`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-5 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:underline">
              Sign in with your account
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
