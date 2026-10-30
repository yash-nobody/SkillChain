import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Camera, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Sparkles, 
  ArrowLeft, 
  Save, 
  Globe, 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  HelpCircle,
  ShieldCheck,
  Percent,
  X
} from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';
import { Header } from '../../components/dashboard/Header';
import { Badge } from '../../components/common/Badge';

export const StudentProfilePage = () => {
  const { 
    currentUser, 
    studentProfile, 
    updateStudentProfile, 
    uploadProfilePhoto, 
    removeProfilePhoto,
    addStudentSkill,
    deleteStudentSkill,
    addStudentEducation,
    deleteStudentEducation,
    addStudentExperience,
    deleteStudentExperience,
    calculateProfileCompletion,
    showToast 
  } = useSkillChain();

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    headline: '',
    aboutMe: '',
    phone: '',
    location: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    studentIdNumber: '',
  });

  const [previewImage, setPreviewImage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Skill input modal / state
  const [skillInput, setSkillInput] = useState({
    name: '',
    category: 'Technical',
    level: 'Intermediate',
    yearsOfExperience: '1-2 years'
  });
  const [showSkillForm, setShowSkillForm] = useState(false);

  // Education input state
  const [eduInput, setEduInput] = useState({
    school: '',
    degree: '',
    branch: '',
    currentYear: 'Senior (Year 4)',
    graduationYear: '2027',
    cgpa: ''
  });
  const [showEduForm, setShowEduForm] = useState(false);

  // Experience input state
  const [expInput, setExpInput] = useState({
    organization: '',
    role: '',
    startDate: '',
    endDate: 'Present',
    description: '',
    certificateUrl: ''
  });
  const [showExpForm, setShowExpForm] = useState(false);

  // Populate from active student profile on load
  useEffect(() => {
    if (studentProfile) {
      setFormData({
        fullName: studentProfile.fullName || currentUser?.name || '',
        headline: studentProfile.headline || currentUser?.title || '',
        aboutMe: studentProfile.aboutMe || '',
        phone: studentProfile.phone || '',
        location: studentProfile.location || '',
        linkedinUrl: studentProfile.linkedinUrl || '',
        githubUrl: studentProfile.githubUrl || '',
        portfolioUrl: studentProfile.portfolioUrl || '',
        studentIdNumber: studentProfile.studentIdNumber || currentUser?.studentIdNumber || '',
      });
      setPreviewImage(studentProfile.profileImage || currentUser?.avatar || '');
    }
  }, [studentProfile, currentUser]);

  const completionRate = calculateProfileCompletion({
    ...studentProfile,
    ...formData,
    profileImage: previewImage
  });

  // Handle Photo selection with size & type validation
  const handlePhotoSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      showToast('Please upload a valid image file (JPG, PNG, or WEBP).', 'error');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size exceeds 5MB limit.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setPreviewImage(dataUrl);
      uploadProfilePhoto(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPreviewImage('');
    removeProfilePhoto();
  };

  // Save profile updates
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      updateStudentProfile({
        ...formData,
        profileImage: previewImage
      });
      setIsSaving(false);
    }, 400);
  };

  // Add Skill handler
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!skillInput.name.trim()) return;
    addStudentSkill(skillInput);
    setSkillInput({
      name: '',
      category: 'Technical',
      level: 'Intermediate',
      yearsOfExperience: '1-2 years'
    });
    setShowSkillForm(false);
  };

  // Add Education handler
  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!eduInput.school.trim() || !eduInput.degree.trim()) return;
    addStudentEducation(eduInput);
    setEduInput({
      school: '',
      degree: '',
      branch: '',
      currentYear: 'Senior',
      graduationYear: '2027',
      cgpa: ''
    });
    setShowEduForm(false);
  };

  // Add Experience handler
  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!expInput.organization.trim() || !expInput.role.trim()) return;
    addStudentExperience(expInput);
    setExpInput({
      organization: '',
      role: '',
      startDate: '',
      endDate: 'Present',
      description: '',
      certificateUrl: ''
    });
    setShowExpForm(false);
  };

  return (
    <div>
      <Header
        pageTitle="Student Profile & Passport Credentials"
        pageSubtitle="Personalize your identity, educational milestones, and audited skills"
        actionButton={
          <div className="flex items-center gap-2">
            <Link
              to="/student"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        }
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Profile Completion Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Left: Avatar with interactive upload button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-100 border-2 border-slate-200 p-1 flex items-center justify-center overflow-hidden shadow-sm">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt={formData.fullName || 'Student'}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <User className="w-12 h-12 text-slate-400" />
                  )}
                </div>

                {/* Upload action overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                  title="Upload / Replace Photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoSelect}
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {formData.fullName || 'Student Name'}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                    Verified Student Passport
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-600">
                  {formData.headline || 'Add your professional headline (e.g. Computer Science Student)'}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1 font-mono">
                  <span>ID: {studentProfile?.passportId || 'SKC-PASSPORT-PENDING'}</span>
                  {studentProfile?.studentIdNumber && (
                    <>
                      <span>•</span>
                      <span>Enrollment #{studentProfile.studentIdNumber}</span>
                    </>
                  )}
                </div>

                {previewImage && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Profile Photo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Profile Completion Progress */}
            <div className="w-full lg:w-72 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Profile Completion
                </span>
                <span className="font-extrabold text-brand-600 text-sm">
                  {completionRate}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    completionRate >= 80 ? 'bg-emerald-500' : completionRate >= 50 ? 'bg-brand-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${completionRate}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-snug">
                {completionRate >= 80 
                  ? 'Your profile is comprehensive and recruiter-ready!'
                  : 'Add photo, about me, education, and skills to boost recruiter visibility.'}
              </p>
            </div>

          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSaveProfile} className="space-y-8">
          
          {/* SECTION B: Basic Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-600" />
                <span>Basic Personal Information</span>
              </h3>
              <p className="text-xs text-slate-500">Contact details and verified public identity</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Alex Chen"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="e.g. Full-Stack & Cloud Systems Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Verified Account Email (Read-Only)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={currentUser?.email || ''}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100/80 text-xs sm:text-sm text-slate-500 cursor-not-allowed font-medium"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Verified email cannot be modified directly for cryptographic integrity.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Student ID / University Enrollment Number
                </label>
                <input
                  type="text"
                  value={formData.studentIdNumber}
                  onChange={(e) => setFormData({ ...formData, studentIdNumber: e.target.value })}
                  placeholder="e.g. STU-2026-89412"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Location (City, State / Country)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Social & Professional Links */}
            <div className="pt-2 border-t border-slate-100">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Professional Profiles & Portfolio
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Linkedin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="LinkedIn Profile URL"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="relative">
                  <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="GitHub Profile URL"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="Personal Portfolio URL"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION D: Dedicated About Me */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" />
                <span>About Me & Career Objectives</span>
              </h3>
              <p className="text-xs text-slate-500">
                Describe your academic background, passions, technical goals, and target roles
              </p>
            </div>

            <div>
              <textarea
                rows="4"
                value={formData.aboutMe}
                onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                placeholder="Write a concise narrative about yourself: your engineering background, favorite frameworks, research projects, and what kind of internships or full-time roles you are seeking..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400 leading-relaxed resize-y"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Recruiters read this summary when assessing your verified skill passport.
              </p>
            </div>
          </div>

          {/* SECTION C: Educational Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-brand-600" />
                  <span>Educational Background</span>
                </h3>
                <p className="text-xs text-slate-500">Add colleges, degrees, and academic performance</p>
              </div>
              <button
                type="button"
                onClick={() => setShowEduForm(!showEduForm)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Education</span>
              </button>
            </div>

            {/* Add Education Sub-form */}
            {showEduForm && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Add University / College Record</span>
                  <button type="button" onClick={() => setShowEduForm(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">College / University *</label>
                    <input
                      type="text"
                      placeholder="e.g. Stanford University"
                      value={eduInput.school}
                      onChange={(e) => setEduInput({ ...eduInput, school: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Degree & Major *</label>
                    <input
                      type="text"
                      placeholder="e.g. B.S. in Computer Science"
                      value={eduInput.degree}
                      onChange={(e) => setEduInput({ ...eduInput, degree: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Department / Branch</label>
                    <input
                      type="text"
                      placeholder="e.g. Electrical Engineering & CS"
                      value={eduInput.branch}
                      onChange={(e) => setEduInput({ ...eduInput, branch: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Graduation Year</label>
                      <input
                        type="text"
                        placeholder="e.g. 2027"
                        value={eduInput.graduationYear}
                        onChange={(e) => setEduInput({ ...eduInput, graduationYear: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">CGPA / %</label>
                      <input
                        type="text"
                        placeholder="e.g. 3.9 / 4.0"
                        value={eduInput.cgpa}
                        onChange={(e) => setEduInput({ ...eduInput, cgpa: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEduForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
                  >
                    Save Education Entry
                  </button>
                </div>
              </div>
            )}

            {/* List of Education Entries */}
            {(!studentProfile?.education || studentProfile.education.length === 0) ? (
              <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200/80">
                <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-700">No education records added yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click "+ Add Education" above to list your college or degree.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {studentProfile.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">{edu.school}</h4>
                      <p className="text-xs font-semibold text-brand-700">{edu.degree}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                        {edu.branch && <span>Branch: {edu.branch}</span>}
                        {edu.graduationYear && <span>Class of {edu.graduationYear}</span>}
                        {edu.cgpa && (
                          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            CGPA: {edu.cgpa}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteStudentEducation(edu.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove Education"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION E: Skills Management */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-600" />
                  <span>Skills & Competencies</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Self-reported skills remain unverified until supported by cryptographic credentials
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSkillForm(!showSkillForm)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            {/* Add Skill Form */}
            {showSkillForm && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Add Technical or Professional Skill</span>
                  <button type="button" onClick={() => setShowSkillForm(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-600 mb-1">Skill Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. React, Python, Docker, Go"
                      value={skillInput.name}
                      onChange={(e) => setSkillInput({ ...skillInput, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Proficiency Level</label>
                    <select
                      value={skillInput.level}
                      onChange={(e) => setSkillInput({ ...skillInput, level: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Experience</label>
                    <input
                      type="text"
                      placeholder="e.g. 2 years"
                      value={skillInput.yearsOfExperience}
                      onChange={(e) => setSkillInput({ ...skillInput, yearsOfExperience: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Note: Newly added skills will be marked as "Self-Reported"
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSkillForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
                    >
                      Add Skill
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Skills List */}
            {(!studentProfile?.skills || studentProfile.skills.length === 0) ? (
              <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200/80">
                <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-700">No skills added yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Add your first skill to showcase your engineering abilities on your passport.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {studentProfile.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-brand-200 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900">{skill.name}</p>
                        {skill.isVerified ? (
                          <span title="Cryptographically Verified Competency">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                            Self-Reported
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {skill.level} • {skill.yearsOfExperience || '1 year'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteStudentSkill(skill.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      title="Remove Skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION F: Internships and Experience */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-600" />
                  <span>Work Experience & Internships</span>
                </h3>
                <p className="text-xs text-slate-500">Record practical industry experience and contributions</p>
              </div>
              <button
                type="button"
                onClick={() => setShowExpForm(!showExpForm)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Experience</span>
              </button>
            </div>

            {/* Add Experience Sub-form */}
            {showExpForm && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Add Work or Internship Experience</span>
                  <button type="button" onClick={() => setShowExpForm(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Cloud Technologies"
                      value={expInput.organization}
                      onChange={(e) => setExpInput({ ...expInput, organization: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Role Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Software Engineering Intern"
                      value={expInput.role}
                      onChange={(e) => setExpInput({ ...expInput, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Start Date</label>
                    <input
                      type="text"
                      placeholder="e.g. June 2026"
                      value={expInput.startDate}
                      onChange={(e) => setExpInput({ ...expInput, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">End Date</label>
                    <input
                      type="text"
                      placeholder="e.g. September 2026 or Present"
                      value={expInput.endDate}
                      onChange={(e) => setExpInput({ ...expInput, endDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Key Responsibilities / Impact</label>
                  <textarea
                    rows="2"
                    placeholder="Describe main responsibilities, technologies deployed, and measured impact..."
                    value={expInput.description}
                    onChange={(e) => setExpInput({ ...expInput, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">
                    Initially recorded as unverified until verified by employer signature.
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowExpForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddExperience}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
                    >
                      Add Experience
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Experience List */}
            {(!studentProfile?.experience || studentProfile.experience.length === 0) ? (
              <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200/80">
                <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-slate-700">No internship or work experience added yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click "+ Add Experience" above to highlight past internships or software jobs.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {studentProfile.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{exp.role}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                          {exp.organization}
                        </span>
                        {exp.isVerified ? (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Verified Experience
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            Unverified Claim
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {exp.startDate} - {exp.endDate}
                      </p>
                      {exp.description && (
                        <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteStudentExperience(exp.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove Experience"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Save & Reset Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Link
              to="/student"
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Profile...' : 'Save All Changes'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

