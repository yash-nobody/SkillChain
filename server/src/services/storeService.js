import bcrypt from 'bcryptjs';
import { calculateTrustIndex } from './trustIndexService.js';
import {
  seedUsers,
  seedCertificates,
  seedVerificationRequests,
  seedIssuers,
  seedCandidateProfiles
} from '../data/mockSeed.js';

class StoreService {
  constructor() {
    // Seed users with explicit isDemo flag
    this.users = seedUsers.map(u => ({
      ...u,
      isDemo: true,
      studentIdNumber: u.role === 'student' ? 'STU-2026-89412' : '',
    }));

    // Map initial seed certificates - designated strictly for demo student
    this.certificates = seedCertificates.map(c => ({
      ...c,
      isDemo: true,
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

    // Seed verification requests
    this.verificationRequests = seedVerificationRequests.map(r => ({
      ...r,
      certificateId: r.courseId || 'SKC-2026-32109-P',
      targetCompanyId: r.targetCompanyId || 'usr-company-01',
      targetCompanyName: r.targetCompanyName || 'Acme Cloud Technologies',
      status: r.status === 'Pending' ? 'Pending Company Review' : r.status,
      studentConsent: {
        consented: true,
        consentedAt: new Date().toISOString(),
        consentText: 'I grant permission to share this credential and document exclusively with the selected issuing company for verification purposes.',
      },
      extractedDetails: {
        holderName: r.studentName,
        issuer: r.issuingOrg,
        title: r.credentialTitle,
        certId: r.courseId,
        issueDate: r.submittedDate,
        expiryDate: 'Never',
        verificationUrl: `https://skillchain.network/verify?id=${r.courseId}`,
        qrPayload: `SKC_QR_SIGNATURE_PAYLOAD:${r.courseId}`,
      },
      autoVerificationFailureReason: 'External issuer registry does not host public automated endpoint.',
      companyDecisionNotes: '',
      rejectionReason: '',
      additionalInfoRequiredNotes: '',
      respondedAt: null,
    }));

    this.issuers = [...seedIssuers];
    this.candidates = [...seedCandidateProfiles];

    // Dedicated student profiles collection
    this.studentProfiles = [
      {
        id: 'prof-demo-alex',
        userId: 'usr-student-01',
        email: 'alex.chen@stanford.edu',
        fullName: 'Alex Chen',
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
        skills: [
          { id: 'skl-01', name: 'Go', category: 'Backend', level: 'Advanced', yearsOfExperience: '3 years', isVerified: true, verifiedBy: 'Google Cloud Training' },
          { id: 'skl-02', name: 'Kubernetes', category: 'DevOps', level: 'Advanced', yearsOfExperience: '2 years', isVerified: true, verifiedBy: 'Google Cloud Training' },
          { id: 'skl-03', name: 'React 19', category: 'Frontend', level: 'Advanced', yearsOfExperience: '3 years', isVerified: true, verifiedBy: 'Meta Open Source' },
          { id: 'skl-04', name: 'TypeScript', category: 'Languages', level: 'Advanced', yearsOfExperience: '3 years', isVerified: true, verifiedBy: 'Meta Open Source' },
          { id: 'skl-05', name: 'PyTorch', category: 'AI/ML', level: 'Intermediate', yearsOfExperience: '2 years', isVerified: true, verifiedBy: 'DeepLearning.AI' },
        ],
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
        projects: [
          {
            id: 'proj-01',
            title: 'Distributed Consensus Engine (Raft)',
            description: 'Implementation of the Raft distributed consensus protocol in Go, handling leader election and log replication.',
            github: 'https://github.com/alexchen-dev/raft-go',
            tech: ['Go', 'gRPC', 'Distributed Systems'],
            isVerified: true
          }
        ],
        completionPercentage: 95,
        trustScore: 98,
        isDemo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  // --- Normalization helper ---
  normalizeEmail(email) {
    if (!email) return '';
    return email.trim().toLowerCase();
  }

  calculateProfileCompletion(profile) {
    let score = 0;
    if (profile.fullName) score += 10;
    if (profile.email) score += 10;
    if (profile.profileImage) score += 15;
    if (profile.headline) score += 15;
    if (profile.aboutMe && profile.aboutMe.trim().length > 15) score += 15;
    if (profile.location || profile.phone) score += 10;
    if (profile.education && profile.education.length > 0) score += 10;
    if (profile.skills && profile.skills.length > 0) score += 10;
    if (profile.linkedinUrl || profile.githubUrl || profile.portfolioUrl) score += 5;
    return Math.min(100, score);
  }

  // --- User / Auth methods ---
  findUserByEmail(email) {
    const clean = this.normalizeEmail(email);
    if (!clean) return null;
    return this.users.find(u => this.normalizeEmail(u.email) === clean);
  }

  findUserByStudentId(studentIdNumber) {
    if (!studentIdNumber || !studentIdNumber.trim()) return null;
    const clean = studentIdNumber.trim().toLowerCase();
    return this.users.find(u => u.studentIdNumber && u.studentIdNumber.trim().toLowerCase() === clean);
  }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  async createUser(userData) {
    const cleanEmail = this.normalizeEmail(userData.email);
    const isStudent = (userData.role || 'student') === 'student';

    let hashedPassword = userData.password;
    if (userData.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(userData.password, salt);
      } catch (e) {
        hashedPassword = userData.password;
      }
    }

    const newUser = {
      id: `usr-${userData.role || 'student'}-${Date.now()}`,
      name: userData.name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: userData.role || 'student',
      studentIdNumber: userData.studentIdNumber ? userData.studentIdNumber.trim() : '',
      title: userData.title || '',
      institution: userData.institution || '',
      avatar: userData.avatar || '',
      isDemo: false, // REAL STUDENT ACCOUNT
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);

    // If student, initialize a CLEAN, empty profile (NO DUMMY DATA)
    if (isStudent) {
      const randomPassportNum = Math.floor(10000 + Math.random() * 90000);
      const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'ST';
      
      const cleanProfile = {
        id: `prof-${Date.now()}`,
        userId: newUser.id,
        email: cleanEmail,
        fullName: newUser.name,
        studentIdNumber: newUser.studentIdNumber,
        passportId: `SKC-PASSPORT-${randomPassportNum}-${initials}`,
        profileImage: newUser.avatar || '',
        headline: userData.title || 'Student',
        aboutMe: '',
        phone: userData.phone || '',
        location: userData.location || '',
        linkedinUrl: userData.linkedinUrl || '',
        githubUrl: userData.githubUrl || '',
        portfolioUrl: userData.portfolioUrl || '',
        education: userData.institution ? [
          {
            id: `edu-${Date.now()}`,
            school: userData.institution,
            degree: userData.degree || 'Degree Program',
            branch: '',
            currentYear: '',
            graduationYear: '',
            cgpa: ''
          }
        ] : [],
        skills: [], // EMPTY FOR REAL STUDENTS
        experience: [], // EMPTY FOR REAL STUDENTS
        projects: [], // EMPTY FOR REAL STUDENTS
        trustScore: 60, // Exactly 60/100 default for newly registered students
        isDemo: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      cleanProfile.completionPercentage = this.calculateProfileCompletion(cleanProfile);
      this.studentProfiles.push(cleanProfile);
    }

    return newUser;
  }

  async comparePassword(enteredPassword, user) {
    if (user.password === enteredPassword) return true;
    try {
      return await bcrypt.compare(enteredPassword, user.password);
    } catch {
      return user.password === enteredPassword;
    }
  }

  // --- Student Profiles & Trust Index ---
  calculateStudentTrustIndex(email) {
    const clean = this.normalizeEmail(email);
    const profile = this.studentProfiles.find(p => this.normalizeEmail(p.email) === clean);
    const certs = this.findCertificatesByStudentEmail(clean);

    if (!profile) {
      return calculateTrustIndex({ certificates: certs });
    }

    return calculateTrustIndex({
      certificates: certs,
      experience: profile.experience || [],
      projects: profile.projects || [],
      education: profile.education || [],
    });
  }

  getStudentProfile(email) {
    const clean = this.normalizeEmail(email);
    const profile = this.studentProfiles.find(p => this.normalizeEmail(p.email) === clean);
    if (!profile) return null;

    // Dynamically calculate Trust Index strictly based on verified evidence
    const trustResult = this.calculateStudentTrustIndex(clean);
    profile.trustScore = trustResult.score;
    profile.trustBreakdown = trustResult.breakdown;

    return profile;
  }

  updateStudentProfile(email, updates) {
    const clean = this.normalizeEmail(email);
    const idx = this.studentProfiles.findIndex(p => this.normalizeEmail(p.email) === clean);
    if (idx === -1) return null;

    // Do NOT allow changing verified email
    const safeUpdates = { ...updates };
    delete safeUpdates.email;
    delete safeUpdates.userId;
    delete safeUpdates.passportId;

    this.studentProfiles[idx] = {
      ...this.studentProfiles[idx],
      ...safeUpdates,
      updatedAt: new Date().toISOString()
    };

    this.studentProfiles[idx].completionPercentage = this.calculateProfileCompletion(this.studentProfiles[idx]);
    
    // Also keep user name and avatar synchronized if updated
    const user = this.findUserByEmail(email);
    if (user) {
      if (safeUpdates.fullName) user.name = safeUpdates.fullName;
      if (safeUpdates.profileImage !== undefined) user.avatar = safeUpdates.profileImage;
      if (safeUpdates.headline) user.title = safeUpdates.headline;
    }

    return this.studentProfiles[idx];
  }

  addStudentSkill(email, skill) {
    const profile = this.getStudentProfile(email);
    if (!profile) return null;

    const newSkill = {
      id: `skl-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: skill.name.trim(),
      category: skill.category || 'Technical',
      level: skill.level || 'Intermediate',
      yearsOfExperience: skill.yearsOfExperience || '1 year',
      isVerified: false, // IMPORTANT: Self-reported skills are NOT verified automatically!
      verifiedDate: '',
      verifiedBy: ''
    };

    if (!profile.skills) profile.skills = [];
    profile.skills.push(newSkill);
    profile.completionPercentage = this.calculateProfileCompletion(profile);
    return newSkill;
  }

  updateStudentSkill(email, skillId, skillUpdates) {
    const profile = this.getStudentProfile(email);
    if (!profile || !profile.skills) return null;

    const idx = profile.skills.findIndex(s => s.id === skillId);
    if (idx === -1) return null;

    profile.skills[idx] = {
      ...profile.skills[idx],
      name: skillUpdates.name ? skillUpdates.name.trim() : profile.skills[idx].name,
      category: skillUpdates.category || profile.skills[idx].category,
      level: skillUpdates.level || profile.skills[idx].level,
      yearsOfExperience: skillUpdates.yearsOfExperience || profile.skills[idx].yearsOfExperience,
      // Cannot self-verify via edit!
    };

    return profile.skills[idx];
  }

  deleteStudentSkill(email, skillId) {
    const profile = this.getStudentProfile(email);
    if (!profile || !profile.skills) return false;

    const initialLen = profile.skills.length;
    profile.skills = profile.skills.filter(s => s.id !== skillId);
    profile.completionPercentage = this.calculateProfileCompletion(profile);
    return profile.skills.length < initialLen;
  }

  // --- Certificates ---
  getAllCertificates() {
    return this.certificates;
  }

  findCertificatesByStudentEmail(email) {
    const clean = this.normalizeEmail(email);
    if (!clean) return [];
    return this.certificates.filter(c => this.normalizeEmail(c.studentEmail) === clean);
  }

  findCertificateById(id) {
    return this.certificates.find(c => c.id === id || c.verificationHash === id);
  }

  addCertificate(cert) {
    this.certificates.unshift(cert);
    return cert;
  }

  updateCertificate(id, updates) {
    const idx = this.certificates.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.certificates[idx] = { ...this.certificates[idx], ...updates };
    return this.certificates[idx];
  }

  // --- Verification Requests ---
  getAllRequests() {
    return this.verificationRequests;
  }

  findRequestsByCompanyId(companyId) {
    return this.verificationRequests.filter(r => r.targetCompanyId === companyId);
  }

  findRequestsByCompanyName(companyName) {
    if (!companyName) return [];
    const clean = companyName.toLowerCase().trim();
    return this.verificationRequests.filter(r => 
      r.targetCompanyName?.toLowerCase().trim() === clean ||
      r.issuingOrg?.toLowerCase().includes(clean) ||
      clean.includes(r.targetCompanyName?.toLowerCase().trim())
    );
  }

  findRequestById(id) {
    return this.verificationRequests.find(r => r.id === id);
  }

  addRequest(req) {
    this.verificationRequests.unshift(req);
    return req;
  }

  updateRequest(id, updates) {
    const idx = this.verificationRequests.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.verificationRequests[idx] = { ...this.verificationRequests[idx], ...updates };
    return this.verificationRequests[idx];
  }

  updateRequestStatus(id, status, decisionNotes = '') {
    const req = this.verificationRequests.find(r => r.id === id);
    if (req) {
      req.status = status;
      req.companyDecisionNotes = decisionNotes;
      req.respondedAt = new Date().toISOString();
      return req;
    }
    return null;
  }

  // --- Issuers ---
  getAllIssuers() {
    return this.issuers;
  }

  updateIssuerStatus(id, status) {
    const iss = this.issuers.find(i => i.id === id);
    if (iss) {
      iss.status = status;
      return iss;
    }
    return null;
  }

  // --- Candidates ---
  getAllCandidates() {
    return this.candidates;
  }

  findCandidateByPassportId(passportId) {
    return this.candidates.find(c => c.passportId === passportId);
  }

  toggleShortlist(candidateId) {
    const cand = this.candidates.find(c => c.id === candidateId);
    if (cand) {
      cand.shortlisted = !cand.shortlisted;
      return cand;
    }
    return null;
  }
}

export const storeService = new StoreService();
