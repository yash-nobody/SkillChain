import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  initialMockUser,
  demoAccounts,
  initialCertificates,
  mockSkills,
  mockProjects,
  mockInternships,
  mockRecentActivity,
  mockCandidates,
  mockVerificationRequests,
  mockCompanyIssuedCerts,
  mockPlatformStats
} from '../data/mockData';

const SkillChainContext = createContext(null);

const KNOWN_ISSUERS_MAP = [
  'Google Cloud Training & Stanford EECS',
  'Meta Open Source & Dev Academy',
  'DeepLearning.AI & Stanford Online',
  'Acme Cloud Technologies',
  'Stanford EECS Lab',
  'MIT EECS Laboratory'
];

/**
 * SkillChainProvider
 * 
 * IMPORTANT SECURITY NOTE:
 * This authentication system uses browser localStorage for frontend demonstration
 * and state simulation purposes. Client-side state and route guards are NOT sufficient
 * for production security.
 * 
 * In a production architecture:
 * 1. Authentication must be verified via a backend server (Node.js/Express) using secure,
 *    HttpOnly, SameSite cookies and cryptographically signed JWT tokens or server sessions.
 * 2. Every protected API endpoint must independently authenticate the user and authorize
 *    their role on the server before returning data or performing mutations.
 */
export const SkillChainProvider = ({ children }) => {
  // Global Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', duration = 3500) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  // Registered accounts stored locally
  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('skillchain_registered_accounts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Demo Authentication Session State
  const [authSession, setAuthSession] = useState(() => {
    try {
      const saved = localStorage.getItem('skillchain_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.isAuthenticated === 'boolean') {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse auth session from localStorage:', e);
    }
    return {
      isAuthenticated: false,
      user: null,
      role: null
    };
  });

  const isAuthenticated = authSession.isAuthenticated;
  const currentUser = authSession.user;
  const currentRole = authSession.role;

  // Determine if active user is a designated demo account
  const isDemoUser = useMemo(() => {
    if (!currentUser) return false;
    if (currentUser.isDemo === true) return true;
    if (currentUser.email === 'alex.chen@stanford.edu') return true;
    if (demoAccounts.some(d => d.email.toLowerCase() === (currentUser.email || '').toLowerCase())) return true;
    return false;
  }, [currentUser]);

  // Master certificates repository
  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('skillchain_certs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialCertificates.map(c => ({
      ...c,
      isDemo: true,
      studentEmail: 'alex.chen@stanford.edu',
      status: c.status === 'Pending' ? 'Pending Automatic Verification' : c.status,
      extractedDetails: c.extractedDetails || {
        holderName: 'Alex Chen',
        issuer: c.issuer,
        title: c.title,
        certId: c.id,
        issueDate: c.issueDate,
        expiryDate: c.expiryDate,
        verificationUrl: `https://skillchain.network/verify?id=${c.id}`,
        qrPayload: `SKC_QR_SIGNATURE_PAYLOAD:${c.id}`,
      },
      autoVerificationEvidence: c.autoVerificationEvidence || {
        sourceChecked: c.verifiedBy || 'SkillChain Protocol Notary',
        checkDate: c.issueDate,
        evidenceNotes: c.description || 'Verified via SkillChain protocol.',
        rejectionReason: c.status === 'Rejected' ? 'Submission audit incomplete' : '',
        adapterName: 'DEMO_MODULAR_ADAPTER',
        isOfficialCheck: c.status === 'Verified',
      },
      companySharing: c.companySharing || {
        sharedWithCompany: false,
        targetCompanyId: '',
        targetCompanyName: '',
        consentedAt: null,
        consentStatement: '',
        companyResponseNotes: '',
        respondedAt: null,
        infoRequestedDetails: '',
      },
      verificationHistory: c.verificationHistory || [
        {
          timestamp: new Date().toISOString(),
          engineVersion: 'SkillChain-VerifEngine-v2.1',
          sourceChecked: c.verifiedBy || 'SkillChain Protocol Notary',
          isOfficialCheck: c.status === 'Verified',
          resultStatus: c.status === 'Pending' ? 'Pending Automatic Verification' : c.status,
          evidenceNotes: 'Initial ledger synchronization.',
          rejectionReason: c.status === 'Rejected' ? 'Submission audit incomplete' : '',
          adapterType: 'DEMO_MODULAR_ADAPTER'
        }
      ]
    }));
  });

  // Dynamic state for company issued certs
  const [issuedCerts, setIssuedCerts] = useState(() => {
    const saved = localStorage.getItem('skillchain_issued');
    return saved ? JSON.parse(saved) : mockCompanyIssuedCerts;
  });

  // Verification requests queue
  const [verificationRequests, setVerificationRequests] = useState(() => {
    const saved = localStorage.getItem('skillchain_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return mockVerificationRequests.map(r => ({
      ...r,
      certificateId: r.courseId || 'SKC-2026-32109-P',
      targetCompanyId: r.targetCompanyId || 'usr-company-01',
      targetCompanyName: r.targetCompanyName || 'Acme Cloud Technologies',
      status: r.status === 'Pending' ? 'Pending Company Review' : r.status,
      studentConsent: {
        consented: true,
        consentedAt: new Date().toISOString(),
        consentText: 'I grant permission to share this credential exclusively with the designated issuer.',
      },
      extractedDetails: {
        holderName: r.studentName,
        issuer: r.issuingOrg,
        title: r.credentialTitle,
        certId: r.courseId,
        issueDate: r.submittedDate,
        expiryDate: 'Never',
      },
      autoVerificationFailureReason: 'Automated check inconclusive: manual review requested by student.',
      companyDecisionNotes: '',
      rejectionReason: '',
      additionalInfoRequiredNotes: '',
      respondedAt: null,
    }));
  });

  // Candidates list for recruiters
  const [candidates, setCandidates] = useState(() => {
    const saved = localStorage.getItem('skillchain_candidates');
    return saved ? JSON.parse(saved) : mockCandidates;
  });

  // Activity log
  const [activities, setActivities] = useState(mockRecentActivity);

  // Student Profiles store by email
  const [studentProfiles, setStudentProfiles] = useState(() => {
    const saved = localStorage.getItem('skillchain_all_student_profiles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Demo student profile
    return {
      'alex.chen@stanford.edu': {
        fullName: 'Alex Chen',
        email: 'alex.chen@stanford.edu',
        studentIdNumber: 'STU-2026-89412',
        passportId: 'SKC-PASSPORT-89412-AC',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        headline: 'Full-Stack & Cloud Systems Engineer',
        aboutMe: 'Computer Science senior at Stanford University passionate about fault-tolerant distributed systems, verifiable credentials, and high-performance microservices architecture.',
        phone: '+1 (555) 234-5678',
        location: 'Stanford, CA',
        linkedinUrl: 'https://linkedin.com/in/alexchen-demo',
        githubUrl: 'https://github.com/alexchen-dev',
        portfolioUrl: 'https://alexchen.systems',
        education: [
          {
            id: 'edu-01',
            school: 'Stanford University',
            degree: 'B.S. in Computer Science',
            branch: 'Systems & Distributed Computing',
            currentYear: 'Senior (Year 4)',
            graduationYear: '2027',
            cgpa: '3.94 / 4.0'
          }
        ],
        skills: mockSkills.map((s, idx) => ({
          id: `skl-demo-${idx}`,
          name: s.name,
          category: s.category,
          level: s.level,
          yearsOfExperience: '2-3 years',
          isVerified: true,
          verifiedBy: 'SkillChain Protocol Notary'
        })),
        experience: [
          {
            id: 'exp-01',
            organization: 'Acme Cloud Technologies',
            role: 'Software Engineering Intern',
            startDate: 'June 2026',
            endDate: 'September 2026',
            description: 'Optimized database query execution time by 42% on core billing APIs. Deployed containerized microservices on Kubernetes.',
            certificateUrl: 'https://storage.googleapis.com/skillchain-credentials/certs/SKC-2026-44321-V.pdf',
            isVerified: true,
          }
        ],
        projects: mockProjects,
        completionPercentage: 95,
        trustScore: 98,
        isDemo: true,
      }
    };
  });

  // Calculate profile completion percentage accurately
  const calculateProfileCompletion = (profile) => {
    if (!profile) return 0;
    let score = 0;
    if (profile.fullName && profile.fullName.trim()) score += 10;
    if (profile.email && profile.email.trim()) score += 10;
    if (profile.profileImage && profile.profileImage.trim()) score += 15;
    if (profile.headline && profile.headline.trim()) score += 15;
    if (profile.aboutMe && profile.aboutMe.trim().length > 15) score += 15;
    if ((profile.location && profile.location.trim()) || (profile.phone && profile.phone.trim())) score += 10;
    if (profile.education && profile.education.length > 0) score += 10;
    if (profile.skills && profile.skills.length > 0) score += 10;
    if (profile.linkedinUrl || profile.githubUrl || profile.portfolioUrl) score += 15;
    return Math.min(100, score);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('skillchain_certs', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('skillchain_issued', JSON.stringify(issuedCerts));
  }, [issuedCerts]);

  useEffect(() => {
    localStorage.setItem('skillchain_requests', JSON.stringify(verificationRequests));
  }, [verificationRequests]);

  useEffect(() => {
    localStorage.setItem('skillchain_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('skillchain_all_student_profiles', JSON.stringify(studentProfiles));
  }, [studentProfiles]);

  useEffect(() => {
    localStorage.setItem('skillchain_registered_accounts', JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  // Evidence-Based Trust Index Calculator strictly matching backend specification
  const calculateTrustIndex = (profile, certs = []) => {
    const BASE_SCORE = 60;
    const verifiedCerts = (certs || []).filter(
      c => c && (c.status === 'Verified' || c.status === 'Company Confirmed')
    );
    const certPoints = Math.min(20, verifiedCerts.length * 5);

    const verifiedExp = (profile?.experience || []).filter(
      e => e && (e.isVerified === true || e.verified === true)
    );
    const expPoints = Math.min(10, verifiedExp.length * 5);

    const verifiedProj = (profile?.projects || []).filter(
      p => p && (p.isVerified === true || p.verified === true)
    );
    const projPoints = Math.min(10, verifiedProj.length * 5);

    const verifiedEdu = (profile?.education || []).filter(
      ed => ed && (ed.isVerified === true || ed.verified === true)
    );
    const eduPoints = verifiedEdu.length > 0 ? 5 : 0;

    const totalEarnedPoints = certPoints + expPoints + projPoints + eduPoints;
    const totalScore = Math.min(100, Math.max(0, BASE_SCORE + totalEarnedPoints));

    return {
      score: totalScore,
      breakdown: {
        baseScore: BASE_SCORE,
        certificatesPoints: certPoints,
        experiencePoints: expPoints,
        projectsPoints: projPoints,
        educationPoints: eduPoints,
        totalEarnedPoints,
        maxPossibleScore: 100
      }
    };
  };

  // Current active student profile
  const activeStudentProfile = useMemo(() => {
    if (!currentUser || currentRole !== 'student') return null;
    const cleanEmail = (currentUser.email || '').toLowerCase().trim();
    const userCerts = isDemoUser 
      ? certificates 
      : certificates.filter(c => (c.studentEmail || '').toLowerCase().trim() === cleanEmail);

    let profile = studentProfiles[cleanEmail];
    if (!profile) {
      profile = {
        fullName: currentUser.name,
        email: cleanEmail,
        studentIdNumber: currentUser.studentIdNumber || '',
        passportId: currentUser.passportId || `SKC-PASSPORT-${Math.floor(10000 + Math.random() * 90000)}-ST`,
        profileImage: currentUser.avatar || '',
        headline: currentUser.title || 'Student',
        aboutMe: '',
        phone: '',
        location: '',
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: '',
        education: currentUser.institution ? [{
          id: 'edu-init',
          school: currentUser.institution,
          degree: currentUser.degree || 'Degree Program',
          branch: '',
          currentYear: '',
          graduationYear: '',
          cgpa: ''
        }] : [],
        skills: [],
        experience: [],
        projects: [],
        completionPercentage: 25,
        trustScore: 60,
        isDemo: isDemoUser,
      };
    }

    // For demo student (Alex Chen), retain audited demo score (95)
    // For all real students, recalculate strictly from verified evidence starting at 60
    const trustResult = isDemoUser 
      ? { score: profile.trustScore || 95, breakdown: { baseScore: 60, totalEarnedPoints: 35 } }
      : calculateTrustIndex(profile, userCerts);

    return {
      ...profile,
      trustScore: trustResult.score,
      trustBreakdown: trustResult.breakdown
    };
  }, [currentUser, currentRole, studentProfiles, isDemoUser, certificates]);

  // Scoped student certificates (clean empty list for new real student)
  const studentCertificates = useMemo(() => {
    if (!currentUser) return [];
    const cleanEmail = (currentUser.email || '').toLowerCase().trim();
    if (isDemoUser) {
      return certificates;
    }
    return certificates.filter(c => (c.studentEmail || '').toLowerCase().trim() === cleanEmail);
  }, [currentUser, isDemoUser, certificates]);

  // Scoped student skills (empty for real student until they add them)
  const studentSkills = useMemo(() => {
    if (isDemoUser) {
      return activeStudentProfile?.skills || mockSkills;
    }
    return activeStudentProfile?.skills || [];
  }, [isDemoUser, activeStudentProfile]);

  // Scoped student projects (empty for real student)
  const studentProjects = useMemo(() => {
    if (isDemoUser) {
      return mockProjects;
    }
    return activeStudentProfile?.projects || [];
  }, [isDemoUser, activeStudentProfile]);

  // Scoped student internships (empty for real student)
  const studentInternships = useMemo(() => {
    if (isDemoUser) {
      return mockInternships;
    }
    return activeStudentProfile?.experience || [];
  }, [isDemoUser, activeStudentProfile]);

  /**
   * Register a new user with backend API integration & duplicate verification
   */
  const registerUser = async (userData) => {
    const cleanEmail = (userData.email || '').toLowerCase().trim();
    const cleanStudentId = (userData.studentIdNumber || '').trim().toLowerCase();

    if (!cleanEmail) {
      return { success: false, message: 'Please provide an email address.' };
    }

    // 1. Try Backend API first
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: cleanEmail,
          password: userData.password,
          role: userData.role || 'student',
          studentIdNumber: userData.studentIdNumber || '',
          institution: userData.organization || '',
          degree: userData.roleOrDegree || '',
          title: userData.roleOrDegree || (userData.role === 'student' ? 'Student' : 'Partner'),
          phone: userData.phone || '',
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Registration failed. Please try again.'
        };
      }

      if (data.token) {
        localStorage.setItem('skillchain_token', data.token);
      }

      const newAccount = {
        ...data.user,
        password: userData.password,
        role: data.user.role || userData.role || 'student',
        isDemo: false
      };

      // Keep local store synchronized
      setRegisteredAccounts(prev => {
        const filtered = prev.filter(a => a.email.toLowerCase() !== cleanEmail);
        return [...filtered, newAccount];
      });

      // Create clean student profile with trustScore: 60
      if (newAccount.role === 'student') {
        const cleanProfile = {
          fullName: newAccount.name,
          email: cleanEmail,
          studentIdNumber: newAccount.studentIdNumber || '',
          passportId: newAccount.passportId || `SKC-PASSPORT-${Math.floor(10000 + Math.random() * 90000)}-ST`,
          profileImage: '',
          headline: newAccount.title || 'Student',
          aboutMe: '',
          phone: userData.phone || '',
          location: '',
          linkedinUrl: '',
          githubUrl: '',
          portfolioUrl: '',
          education: userData.organization ? [{
            id: `edu-${Date.now()}`,
            school: userData.organization,
            degree: userData.roleOrDegree || 'Undergraduate Degree',
            branch: '',
            currentYear: 'Year 1',
            graduationYear: '2028',
            cgpa: ''
          }] : [],
          skills: [],
          experience: [],
          projects: [],
          completionPercentage: 25,
          trustScore: 60, // Exactly 60/100 default
          isDemo: false
        };

        setStudentProfiles(prev => ({
          ...prev,
          [cleanEmail]: cleanProfile
        }));
      }

      const newSession = {
        isAuthenticated: true,
        user: newAccount,
        role: newAccount.role
      };

      setAuthSession(newSession);
      localStorage.setItem('skillchain_auth_session', JSON.stringify(newSession));
      localStorage.setItem('skillchain_role', newAccount.role);

      showToast(`Welcome to SkillChain, ${newAccount.name}! Your Skill Passport is initialized.`, 'success');
      return { success: true, user: newAccount };
    } catch (networkErr) {
      console.warn('Backend registration failed, using local store:', networkErr);
    }

    // 2. Offline fallback check against demo accounts & existing registrations
    const emailInDemo = demoAccounts.some(d => d.email.toLowerCase() === cleanEmail);
    const emailInReg = registeredAccounts.some(r => r.email.toLowerCase() === cleanEmail);
    if (emailInDemo || emailInReg) {
      return {
        success: false,
        message: 'This account already exists. Please log in instead.'
      };
    }

    // Check duplicate student registration number
    if (cleanStudentId) {
      const idExists = registeredAccounts.some(r => 
        r.studentIdNumber && r.studentIdNumber.toLowerCase() === cleanStudentId
      );
      if (idExists || cleanStudentId === 'stu-2026-89412') {
        return {
          success: false,
          message: 'A student account with this registration or enrollment number already exists.'
        };
      }
    }

    const randomPassportNum = Math.floor(10000 + Math.random() * 90000);
    const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'ST';
    const passportId = `SKC-PASSPORT-${randomPassportNum}-${initials}`;

    const newAccount = {
      id: `usr-${userData.role || 'student'}-${Date.now()}`,
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password,
      role: userData.role || 'student',
      studentIdNumber: userData.studentIdNumber ? userData.studentIdNumber.trim() : '',
      title: userData.roleOrDegree || (userData.role === 'student' ? 'Student' : 'Partner'),
      institution: userData.organization || '',
      avatar: '',
      passportId,
      isDemo: false, // CRITICAL: Real student account
    };

    setRegisteredAccounts(prev => [...prev, newAccount]);

    // Create CLEAN, empty student profile
    if (newAccount.role === 'student') {
      const cleanProfile = {
        fullName: newAccount.name,
        email: cleanEmail,
        studentIdNumber: newAccount.studentIdNumber,
        passportId,
        profileImage: '',
        headline: newAccount.title,
        aboutMe: '',
        phone: '',
        location: '',
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: '',
        education: newAccount.institution ? [{
          id: `edu-${Date.now()}`,
          school: newAccount.institution,
          degree: userData.roleOrDegree || 'Undergraduate Degree',
          branch: '',
          currentYear: 'Year 1',
          graduationYear: '2028',
          cgpa: ''
        }] : [],
        skills: [], // EMPTY FOR REAL STUDENTS
        experience: [], // EMPTY FOR REAL STUDENTS
        projects: [], // EMPTY FOR REAL STUDENTS
        trustScore: 60, // Exactly 60/100 default
        isDemo: false,
      };

      cleanProfile.completionPercentage = calculateProfileCompletion(cleanProfile);

      setStudentProfiles(prev => ({
        ...prev,
        [cleanEmail]: cleanProfile
      }));
    }

    // Auto log in to clean dashboard
    const newSession = {
      isAuthenticated: true,
      user: newAccount,
      role: newAccount.role
    };

    setAuthSession(newSession);
    localStorage.setItem('skillchain_auth_session', JSON.stringify(newSession));
    localStorage.setItem('skillchain_role', newAccount.role);

    showToast(`Welcome to SkillChain, ${newAccount.name}! Your Skill Passport is initialized.`, 'success');
    return { success: true, user: newAccount };
  };

  /**
   * Login Function - Authenticates real registered accounts via Backend API or local store,
   * or switches to 1-Click Demo Profiles when selected.
   */
  const login = async (role, credentials = null) => {
    // If credentials (email and/or password) are supplied:
    if (credentials && credentials.email) {
      const cleanEmail = (credentials.email || '').toLowerCase().trim();
      const enteredPassword = credentials.password || '';

      // 1. Try Backend API first
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            password: enteredPassword,
            role
          })
        });

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            message: data.message || 'Invalid email or password.'
          };
        }

        if (data.token) {
          localStorage.setItem('skillchain_token', data.token);
        }

        const authenticatedUser = {
          ...data.user,
          role: data.user.role || role,
          isDemo: data.user.isDemo || false,
        };

        const newSession = {
          isAuthenticated: true,
          user: authenticatedUser,
          role: authenticatedUser.role
        };

        setAuthSession(newSession);
        localStorage.setItem('skillchain_auth_session', JSON.stringify(newSession));
        localStorage.setItem('skillchain_role', authenticatedUser.role);

        // If student, synchronize remote profile
        if (authenticatedUser.role === 'student' && data.token) {
          try {
            const profileRes = await fetch('/api/student/profile', {
              headers: { 'Authorization': `Bearer ${data.token}` }
            });
            if (profileRes.ok) {
              const profileJson = await profileRes.json();
              if (profileJson.data?.profile) {
                setStudentProfiles(prev => ({
                  ...prev,
                  [cleanEmail]: profileJson.data.profile
                }));
              }
            }
          } catch (e) {
            console.warn('Could not fetch student remote profile:', e);
          }
        }

        showToast(`Signed in as ${authenticatedUser.name}`, 'success');
        return { success: true, user: authenticatedUser };
      } catch (networkErr) {
        console.warn('Backend auth unreachable, checking local store:', networkErr);
      }

      // 2. Offline fallback against registered accounts and demo accounts
      const existingAccount = registeredAccounts.find(a => a.email.toLowerCase() === cleanEmail);
      if (existingAccount) {
        if (existingAccount.role !== role) {
          return {
            success: false,
            message: `This account is registered as a ${existingAccount.role}, not a ${role}.`
          };
        }

        if (existingAccount.password && enteredPassword && existingAccount.password !== enteredPassword) {
          return {
            success: false,
            message: 'Invalid email or password.'
          };
        }

        const newSession = {
          isAuthenticated: true,
          user: existingAccount,
          role: existingAccount.role
        };

        setAuthSession(newSession);
        localStorage.setItem('skillchain_auth_session', JSON.stringify(newSession));
        localStorage.setItem('skillchain_role', existingAccount.role);

        showToast(`Signed in as ${existingAccount.name}`, 'success');
        return { success: true, user: existingAccount };
      }

      // Check demo accounts
      const matchedDemo = demoAccounts.find(d => d.email.toLowerCase() === cleanEmail);
      if (matchedDemo) {
        const userData = {
          ...initialMockUser,
          ...matchedDemo,
          role: matchedDemo.role,
          isDemo: true
        };
        const newSession = {
          isAuthenticated: true,
          user: userData,
          role: matchedDemo.role
        };
        setAuthSession(newSession);
        localStorage.setItem('skillchain_auth_session', JSON.stringify(newSession));
        localStorage.setItem('skillchain_role', matchedDemo.role);
        showToast(`Signed in as demo ${userData.name}`, 'success');
        return { success: true, user: userData };
      }

      return {
        success: false,
        message: 'Account not found. Please check your email or create an account.'
      };
    }

    // 3. Quick 1-Click Demo Profile login (when clicked from demo profile badges)
    let userData;
    if (role === 'student') {
      userData = {
        ...initialMockUser,
        ...demoAccounts[0],
        role: 'student',
        isDemo: true, // Designated demo student
      };
    } else {
      const matched = demoAccounts.find(acc => acc.role === role);
      userData = {
        id: `usr-${role}-01`,
        role,
        name: matched?.name || 'Authorized User',
        email: matched?.email || `${role}@skillchain.network`,
        title: matched?.title || '',
        avatar: matched?.avatar || '',
        badge: matched?.badge,
        institution: role === 'company' ? matched?.name : undefined,
        isDemo: true,
      };
    }

    const newSession = {
      isAuthenticated: true,
      user: userData,
      role
    };

    setAuthSession(newSession);
    try {
      localStorage.setItem('skillchain_auth_session', JSON.stringify(newSession));
      localStorage.setItem('skillchain_role', role);
    } catch (e) {
      console.error('Failed to save session to localStorage:', e);
    }

    showToast(`Signed in as ${userData.name} (Demo)`, 'success');
    return { success: true, user: userData };
  };

  const logout = () => {
    const emptySession = {
      isAuthenticated: false,
      user: null,
      role: null
    };

    setAuthSession(emptySession);
    try {
      localStorage.removeItem('skillchain_auth_session');
      localStorage.removeItem('skillchain_role');
    } catch (e) {
      console.error('Failed to remove session from localStorage:', e);
    }

    showToast('Signed out of SkillChain.', 'info');
  };

  const switchRole = (role) => {
    return login(role);
  };

  /**
   * Profile Management Functions
   */
  const updateStudentProfile = (updates) => {
    if (!currentUser || currentRole !== 'student') return null;
    const cleanEmail = (currentUser.email || '').toLowerCase().trim();

    setStudentProfiles(prev => {
      const current = prev[cleanEmail] || activeStudentProfile;
      const updated = {
        ...current,
        ...updates,
        email: cleanEmail, // Email is immutable
      };
      updated.completionPercentage = calculateProfileCompletion(updated);

      // Keep currentUser name and avatar in sync
      if (updates.fullName || updates.profileImage !== undefined || updates.headline) {
        const updatedUser = {
          ...currentUser,
          ...(updates.fullName ? { name: updates.fullName } : {}),
          ...(updates.profileImage !== undefined ? { avatar: updates.profileImage } : {}),
          ...(updates.headline ? { title: updates.headline } : {})
        };
        setAuthSession(s => ({ ...s, user: updatedUser }));
        localStorage.setItem('skillchain_auth_session', JSON.stringify({ ...authSession, user: updatedUser }));
      }

      return {
        ...prev,
        [cleanEmail]: updated
      };
    });

    showToast('Student Profile updated successfully.', 'success');
  };

  const uploadProfilePhoto = (photoDataUrl) => {
    updateStudentProfile({ profileImage: photoDataUrl });
  };

  const removeProfilePhoto = () => {
    updateStudentProfile({ profileImage: '' });
  };

  const addStudentSkill = (skillData) => {
    if (!currentUser || currentRole !== 'student') return null;
    const cleanEmail = (currentUser.email || '').toLowerCase().trim();

    const newSkill = {
      id: `skl-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: skillData.name.trim(),
      category: skillData.category || 'Technical',
      level: skillData.level || 'Intermediate',
      yearsOfExperience: skillData.yearsOfExperience || '1 year',
      isVerified: false, // IMPORTANT: Self-reported skills are NOT verified!
      verifiedBy: '',
      verifiedDate: '',
    };

    setStudentProfiles(prev => {
      const current = prev[cleanEmail] || activeStudentProfile;
      const skills = [...(current.skills || []), newSkill];
      const updated = { ...current, skills };
      updated.completionPercentage = calculateProfileCompletion(updated);
      return { ...prev, [cleanEmail]: updated };
    });

    showToast(`Skill "${newSkill.name}" added (Self-Reported).`, 'success');
    return newSkill;
  };

  const deleteStudentSkill = (skillId) => {
    if (!currentUser || currentRole !== 'student') return;
    const cleanEmail = (currentUser.email || '').toLowerCase().trim();

    setStudentProfiles(prev => {
      const current = prev[cleanEmail] || activeStudentProfile;
      const skills = (current.skills || []).filter(s => s.id !== skillId);
      const updated = { ...current, skills };
      updated.completionPercentage = calculateProfileCompletion(updated);
      return { ...prev, [cleanEmail]: updated };
    });

    showToast('Skill removed from profile.', 'info');
  };

  const addStudentEducation = (eduData) => {
    if (!currentUser || currentRole !== 'student') return null;
    const cleanEmail = (currentUser.email || '').toLowerCase().trim();

    const newEdu = {
      id: `edu-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      school: eduData.school.trim(),
      degree: eduData.degree.trim(),
      branch: eduData.branch || '',
      currentYear: eduData.currentYear || '',
      graduationYear: eduData.graduationYear || '',
      cgpa: eduData.cgpa || ''
    };

    setStudentProfiles(prev => {
      const current = prev[cleanEmail] || activeStudentProfile;
      const education = [...(current.education || []), newEdu];
      const updated = { ...current, education };
      updated.completionPercentage = calculateProfileCompletion(updated);
      return { ...prev, [cleanEmail]: updated };
    });

    showToast('Education record added.', 'success');
    return newEdu;
  };

  const deleteStudentEducation = (eduId) => {
    if (!currentUser || currentRole !== 'student') return;
    const cleanEmail = (currentUser.email || '').toLowerCase().trim();

    setStudentProfiles(prev => {
      const current = prev[cleanEmail] || activeStudentProfile;
      const education = (current.education || []).filter(e => e.id !== eduId);
      const updated = { ...current, education };
      updated.completionPercentage = calculateProfileCompletion(updated);
      return { ...prev, [cleanEmail]: updated };
    });

    showToast('Education record removed.', 'info');
  };

  const addStudentExperience = (expData) => {
    if (!currentUser || currentRole !== 'student') return null;
    const cleanEmail = (currentUser.email || '').toLowerCase().trim();

    const newExp = {
      id: `exp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      organization: expData.organization.trim(),
      role: expData.role.trim(),
      startDate: expData.startDate || '',
      endDate: expData.endDate || 'Present',
      description: expData.description || '',
      certificateUrl: expData.certificateUrl || '',
      isVerified: false // Unverified initially
    };

    setStudentProfiles(prev => {
      const current = prev[cleanEmail] || activeStudentProfile;
      const experience = [...(current.experience || []), newExp];
      const updated = { ...current, experience };
      updated.completionPercentage = calculateProfileCompletion(updated);
      return { ...prev, [cleanEmail]: updated };
    });

    showToast('Experience record added.', 'success');
    return newExp;
  };

  const deleteStudentExperience = (expId) => {
    if (!currentUser || currentRole !== 'student') return;
    const cleanEmail = (currentUser.email || '').toLowerCase().trim();

    setStudentProfiles(prev => {
      const current = prev[cleanEmail] || activeStudentProfile;
      const experience = (current.experience || []).filter(e => e.id !== expId);
      const updated = { ...current, experience };
      updated.completionPercentage = calculateProfileCompletion(updated);
      return { ...prev, [cleanEmail]: updated };
    });

    showToast('Experience record removed.', 'info');
  };

  /**
   * Upload Certificate (Student-Controlled)
   */
  const uploadCertificate = (certData) => {
    const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const newId = certData.certId || `SKC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}-P`;
    
    const isKnown = KNOWN_ISSUERS_MAP.some(
      ki => ki.toLowerCase() === (certData.issuer || '').toLowerCase()
    );

    let finalStatus = 'Verified';
    let evidenceNotes = `Successfully verified against ${certData.issuer} official registry via SkillChain Protocol.`;
    let rejectionReason = '';

    if (certData.forceReject || newId.endsWith('-R')) {
      finalStatus = 'Rejected';
      rejectionReason = certData.rejectionReason || 'Certificate ID revoked or invalid digital hash in issuer ledger.';
      evidenceNotes = 'Cryptographic ledger revocation matched.';
    } else if (!isKnown) {
      finalStatus = 'Unable to Verify';
      evidenceNotes = `Issuing organization "${certData.issuer}" is not yet registered in SkillChain's automated verification network. Manual company audit recommended.`;
    }

    const isVerified = finalStatus === 'Verified';
    const timestamp = new Date().toISOString();

    const extractedDetails = {
      holderName: certData.holderName || currentUser?.name || 'Student',
      issuer: certData.issuer,
      title: certData.title,
      certId: newId,
      issueDate: certData.issueDate || 'October 2026',
      expiryDate: certData.expiryDate || 'Lifetime Verifiable',
      verificationUrl: certData.verificationUrl || `https://skillchain.network/verify?id=${newId}`,
      qrPayload: certData.qrPayload || `SKC_QR_SIGNATURE_PAYLOAD:${newId}`
    };

    const newCert = {
      id: newId,
      title: certData.title,
      issuer: certData.issuer,
      issuerCategory: certData.issuerCategory || 'Engineering & Technology',
      issuerLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80',
      issueDate: extractedDetails.issueDate,
      expiryDate: extractedDetails.expiryDate,
      status: finalStatus,
      verificationHash: `0x${randomHex}`,
      grade: certData.grade || 'Verified Completion',
      skills: certData.skills || ['Software Engineering'],
      credentialType: certData.credentialType || 'Course Credential',
      verifiedBy: isVerified ? `${certData.issuer} Registry Authority` : 'SkillChain Confidential Vault',
      ledgerBlock: isVerified ? 18952000 + Math.floor(Math.random() * 5000) : 0,
      description: certData.description || certData.notes || 'Certificate uploaded for cryptographic audit.',
      evidenceUrl: certData.fileUrl || 'https://storage.googleapis.com/skillchain-credentials/certs/sample-cert.pdf',
      studentEmail: (currentUser?.email || '').toLowerCase().trim(),
      isDemo: isDemoUser,
      extractedDetails,
      autoVerificationEvidence: {
        sourceChecked: isVerified ? `${certData.issuer} Registry API` : 'SkillChain Issuer Directory',
        checkDate: timestamp,
        evidenceNotes,
        rejectionReason,
        adapterName: 'DEMO_MODULAR_ADAPTER',
        isOfficialCheck: isVerified,
      },
      companySharing: {
        sharedWithCompany: false,
        targetCompanyId: '',
        targetCompanyName: '',
        consentedAt: null,
        consentStatement: '',
        companyResponseNotes: '',
        respondedAt: null,
        infoRequestedDetails: '',
      },
      verificationHistory: [
        {
          timestamp,
          engineVersion: 'SkillChain-VerifEngine-v2.1',
          sourceChecked: isVerified ? `${certData.issuer} Registry API` : 'SkillChain Issuer Directory',
          isOfficialCheck: isVerified,
          resultStatus: finalStatus,
          evidenceNotes,
          rejectionReason,
          adapterType: 'DEMO_MODULAR_ADAPTER',
          ocrExtracted: extractedDetails
        }
      ]
    };

    setCertificates(prev => [newCert, ...prev]);

    setActivities(prev => [
      {
        id: `act-${Date.now()}`,
        title: `Certificate Stored (${finalStatus})`,
        detail: `Uploaded "${certData.title}" — automatic check: ${finalStatus}`,
        time: 'Just now',
        type: isVerified ? 'verified' : 'request'
      },
      ...prev
    ]);

    showToast(`Certificate uploaded to SkillChain! Status: ${finalStatus}`, isVerified ? 'success' : 'info');
    return newCert;
  };

  /**
   * Send to Company for Verification (Student-Controlled)
   */
  const sendToCompanyForVerification = (
    certId, 
    targetCompanyId, 
    targetCompanyName, 
    studentNotes = '', 
    consentStatement = ''
  ) => {
    const cert = certificates.find(c => c.id === certId);
    if (!cert) return null;

    const consentTime = new Date().toISOString();
    const requestId = `req-${Date.now().toString().slice(-4)}`;

    const historyEntry = {
      timestamp: consentTime,
      engineVersion: 'SkillChain-CompanyBridge-v1.0',
      sourceChecked: `Transmitted to ${targetCompanyName} with student consent`,
      isOfficialCheck: false,
      resultStatus: 'Pending Company Review',
      evidenceNotes: `Student consented to share document with ${targetCompanyName}. ${studentNotes ? 'Notes: ' + studentNotes : ''}`,
      adapterType: 'STUDENT_AUTHORIZED_DISPATCH'
    };

    setCertificates(prev => prev.map(c => {
      if (c.id === certId) {
        return {
          ...c,
          status: 'Pending Company Review',
          companySharing: {
            sharedWithCompany: true,
            targetCompanyId,
            targetCompanyName,
            consentedAt: consentTime,
            consentStatement: consentStatement || 'Student authorized transmission for institutional review.',
            companyResponseNotes: '',
            respondedAt: null,
            infoRequestedDetails: '',
          },
          verificationHistory: [...(c.verificationHistory || []), historyEntry]
        };
      }
      return c;
    }));

    const newRequest = {
      id: requestId,
      certificateId: cert.id,
      studentId: currentUser?.id || 'usr-student-01',
      studentName: currentUser?.name || 'Student',
      studentEmail: (currentUser?.email || '').toLowerCase().trim(),
      studentAvatar: currentUser?.avatar || '',
      credentialTitle: cert.title,
      targetCompanyId,
      targetCompanyName,
      courseId: cert.id,
      submittedDate: 'Just now',
      status: 'Pending Company Review',
      evidenceUrl: cert.evidenceUrl,
      extractedDetails: cert.extractedDetails,
      autoVerificationFailureReason: cert.autoVerificationEvidence?.rejectionReason || cert.autoVerificationEvidence?.evidenceNotes || '',
      studentConsent: {
        consented: true,
        consentedAt: consentTime,
        consentText: consentStatement,
      },
      skillsClaimed: cert.skills,
      studentNotes,
      companyDecisionNotes: '',
      rejectionReason: '',
      additionalInfoRequiredNotes: '',
      respondedAt: null,
    };

    setVerificationRequests(prev => [newRequest, ...prev]);

    setActivities(prev => [
      {
        id: `act-${Date.now()}`,
        title: 'Sent to Company for Verification',
        detail: `Transmitted "${cert.title}" to ${targetCompanyName} reviewer queue`,
        time: 'Just now',
        type: 'request'
      },
      ...prev
    ]);

    return newRequest;
  };

  const confirmCompanyRequest = (requestId, notes = '') => {
    const req = verificationRequests.find(r => r.id === requestId);
    if (!req) return;

    const respondedAt = new Date().toISOString();
    const decisionNotes = notes || `Verified and confirmed by ${currentUser?.name || 'Acme Cloud Technologies'} Credential Officer.`;

    setVerificationRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'Company Confirmed',
          companyDecisionNotes: decisionNotes,
          respondedAt
        };
      }
      return r;
    }));

    const historyEntry = {
      timestamp: respondedAt,
      engineVersion: 'SkillChain-CompanyReview-v2.1',
      sourceChecked: `${currentUser?.name || req.targetCompanyName} Official Review`,
      isOfficialCheck: true,
      resultStatus: 'Company Confirmed',
      evidenceNotes: decisionNotes,
      adapterType: 'MANUAL_ISSUER_AUDIT'
    };

    setCertificates(prev => prev.map(c => {
      if (c.id === req.certificateId || c.title === req.credentialTitle) {
        return {
          ...c,
          status: 'Company Confirmed',
          verifiedBy: `${currentUser?.name || req.targetCompanyName} Authorized Signer`,
          ledgerBlock: 18953000 + Math.floor(Math.random() * 5000),
          companySharing: {
            ...(c.companySharing || {}),
            companyResponseNotes: decisionNotes,
            respondedAt
          },
          verificationHistory: [...(c.verificationHistory || []), historyEntry]
        };
      }
      return c;
    }));

    showToast(`Verification confirmed for ${req.studentName}!`, 'success');
  };

  const rejectCompanyRequest = (requestId, rejectionReason = '') => {
    const req = verificationRequests.find(r => r.id === requestId);
    if (!req) return;

    const respondedAt = new Date().toISOString();
    const reason = rejectionReason || 'Institutional records could not validate completion criteria.';

    setVerificationRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'Company Rejected',
          rejectionReason: reason,
          companyDecisionNotes: reason,
          respondedAt
        };
      }
      return r;
    }));

    const historyEntry = {
      timestamp: respondedAt,
      engineVersion: 'SkillChain-CompanyReview-v2.1',
      sourceChecked: `${currentUser?.name || req.targetCompanyName} Official Review`,
      isOfficialCheck: true,
      resultStatus: 'Company Rejected',
      evidenceNotes: `Company declined verification: ${reason}`,
      rejectionReason: reason,
      adapterType: 'MANUAL_ISSUER_AUDIT'
    };

    setCertificates(prev => prev.map(c => {
      if (c.id === req.certificateId || c.title === req.credentialTitle) {
        return {
          ...c,
          status: 'Company Rejected',
          companySharing: {
            ...(c.companySharing || {}),
            companyResponseNotes: reason,
            respondedAt
          },
          verificationHistory: [...(c.verificationHistory || []), historyEntry]
        };
      }
      return c;
    }));

    showToast(`Claim rejected: ${reason}`, 'error');
  };

  const requestAdditionalInfoFromStudent = (requestId, notes = '') => {
    const req = verificationRequests.find(r => r.id === requestId);
    if (!req) return;

    const respondedAt = new Date().toISOString();
    const requiredNotes = notes || 'Please provide your institutional registration ID or laboratory report link.';

    setVerificationRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'Additional Information Required',
          additionalInfoRequiredNotes: requiredNotes,
          respondedAt
        };
      }
      return r;
    }));

    const historyEntry = {
      timestamp: respondedAt,
      engineVersion: 'SkillChain-CompanyReview-v2.1',
      sourceChecked: `${currentUser?.name || req.targetCompanyName} Official Review`,
      isOfficialCheck: false,
      resultStatus: 'Additional Information Required',
      evidenceNotes: `Reviewer requested details: ${requiredNotes}`,
      adapterType: 'MANUAL_ISSUER_AUDIT'
    };

    setCertificates(prev => prev.map(c => {
      if (c.id === req.certificateId || c.title === req.credentialTitle) {
        return {
          ...c,
          status: 'Additional Information Required',
          companySharing: {
            ...(c.companySharing || {}),
            infoRequestedDetails: requiredNotes,
            respondedAt
          },
          verificationHistory: [...(c.verificationHistory || []), historyEntry]
        };
      }
      return c;
    }));

    showToast('Additional info request transmitted to student.', 'info');
  };

  const approveRequest = (requestId, feedback) => confirmCompanyRequest(requestId, feedback);
  const rejectRequest = (requestId, reason) => rejectCompanyRequest(requestId, reason);

  const issueCertificate = (data) => {
    const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const newId = `SKC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}-V`;
    
    const newIssuedCert = {
      id: newId,
      recipientName: data.recipientName,
      recipientEmail: data.recipientEmail,
      credentialTitle: data.credentialTitle,
      issueDate: data.issueDate || 'October 2026',
      status: 'Verified',
      hash: `0x${randomHex}`,
      skills: data.skills || ['Full-Stack', 'Cloud Systems']
    };

    setIssuedCerts(prev => [newIssuedCert, ...prev]);

    if (data.recipientEmail.toLowerCase().includes('alex') || data.recipientName.toLowerCase().includes('alex')) {
      const studentCert = {
        id: newId,
        title: data.credentialTitle,
        issuer: currentUser?.name || 'Acme Cloud Technologies',
        issuerCategory: 'Enterprise Credential',
        issuerLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
        issueDate: data.issueDate || 'Today',
        expiryDate: 'Lifetime Verifiable',
        status: 'Verified',
        verificationHash: `0x${randomHex}`,
        grade: data.grade || 'Excellence Distinction',
        skills: data.skills || ['Software Architecture'],
        credentialType: 'Enterprise Issued Credential',
        verifiedBy: `${currentUser?.name || 'Acme Cloud Technologies'} Cryptographic Key #SKC-KEY-994`,
        ledgerBlock: 18950000 + Math.floor(Math.random() * 10000),
        description: data.notes || 'Officially issued verifiable credential via SkillChain protocol.',
        evidenceUrl: 'https://storage.googleapis.com/skillchain-credentials/certs/acme-issued.pdf',
        studentEmail: 'alex.chen@stanford.edu',
        isDemo: true,
      };
      setCertificates(prev => [studentCert, ...prev]);
    }

    showToast(`Successfully issued verifiable certificate ${newId}!`, 'success');
    return newIssuedCert;
  };

  const toggleShortlistCandidate = (candId) => {
    setCandidates(prev =>
      prev.map(c => {
        if (c.id === candId) {
          const updated = !c.shortlisted;
          showToast(updated ? `Added ${c.name} to recruitment pipeline` : `Removed ${c.name} from pipeline`, 'info');
          return { ...c, shortlisted: updated };
        }
        return c;
      })
    );
  };

  const verifyCredentialById = (searchId) => {
    if (!searchId) return null;
    const clean = searchId.trim().toLowerCase();
    const foundCert = certificates.find(c => 
      c.id.toLowerCase() === clean || 
      (c.verificationHash && c.verificationHash.toLowerCase() === clean)
    );
    if (foundCert) return foundCert;

    const foundIssued = issuedCerts.find(i => 
      i.id.toLowerCase() === clean || 
      (i.hash && i.hash.toLowerCase() === clean)
    );
    if (foundIssued) {
      return {
        id: foundIssued.id,
        title: foundIssued.credentialTitle,
        issuer: 'Acme Cloud Technologies',
        issuerLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
        issueDate: foundIssued.issueDate,
        expiryDate: 'Lifetime Verifiable',
        status: foundIssued.status,
        verificationHash: foundIssued.hash,
        grade: 'Verified Master Credential',
        skills: foundIssued.skills,
        credentialType: 'Direct Corporate Credential',
        verifiedBy: 'SkillChain Distributed Registry Node #892',
        ledgerBlock: 18942104,
        description: `Cryptographically verified credential issued directly to ${foundIssued.recipientName}.`
      };
    }

    return null;
  };

  // Calculate stats dynamically for the active student (clean 0s for real new student)
  const stats = useMemo(() => {
    const certs = studentCertificates;
    const totalCerts = certs.length;
    const verifiedCerts = certs.filter(c => c.status === 'Verified' || c.status === 'Company Confirmed').length;
    const pendingCerts = certs.filter(c => 
      c.status === 'Pending Automatic Verification' || 
      c.status === 'Pending Company Review' ||
      c.status === 'Pending'
    ).length;
    const unableCerts = certs.filter(c => c.status === 'Unable to Verify').length;
    const rejectedCerts = certs.filter(c => c.status === 'Rejected' || c.status === 'Company Rejected').length;

    return {
      totalCerts,
      verifiedCerts,
      pendingCerts,
      unableCerts,
      rejectedCerts,
      projectsCount: studentProjects.length,
      skillsCount: studentSkills.length,
    };
  }, [studentCertificates, studentProjects, studentSkills]);

  return (
    <SkillChainContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        currentRole,
        isDemoUser,
        login,
        logout,
        switchRole,
        registerUser,
        // Active student data (real student vs demo student)
        studentProfile: activeStudentProfile,
        certificates: studentCertificates,
        skills: studentSkills,
        projects: studentProjects,
        internships: studentInternships,
        stats,
        // Profile management mutations
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
        // Master collections
        allCertificates: certificates,
        issuedCerts,
        verificationRequests,
        candidates,
        activities,
        platformStats: mockPlatformStats,
        toast,
        showToast,
        uploadCertificate,
        sendToCompanyForVerification,
        confirmCompanyRequest,
        rejectCompanyRequest,
        requestAdditionalInfoFromStudent,
        issueCertificate,
        approveRequest,
        rejectRequest,
        toggleShortlistCandidate,
        verifyCredentialById
      }}
    >
      {children}
    </SkillChainContext.Provider>
  );
};

export const useSkillChain = () => {
  const context = useContext(SkillChainContext);
  if (!context) {
    throw new Error('useSkillChain must be used within a SkillChainProvider');
  }
  return context;
};
