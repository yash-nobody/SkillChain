import { Certificate } from '../models/Certificate.js';
import { VerificationRequest } from '../models/VerificationRequest.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { User } from '../models/User.js';
import { getIsMongoConnected } from '../config/db.js';
import { storeService } from '../services/storeService.js';
import { generateCertificateHash, generateLedgerBlock } from '../utils/cryptoHash.js';
import { runAutoVerification, getKnownIssuers, extractCertificateDetails } from '../services/verificationService.js';
import { calculateTrustIndex } from '../services/trustIndexService.js';

/**
 * GET /api/student/profile
 * Get authenticated student's personalized profile and real statistics
 */
export const getStudentProfile = async (req, res, next) => {
  try {
    const studentUser = req.user;
    const cleanEmail = studentUser.email.toLowerCase();

    // Fetch student's real certificates
    const certs = getIsMongoConnected()
      ? await Certificate.find({ studentEmail: cleanEmail })
      : storeService.findCertificatesByStudentEmail(cleanEmail);

    const verifiedCount = certs.filter(c => c.status === 'Verified' || c.status === 'Company Confirmed').length;
    const pendingCount = certs.filter(c => 
      c.status === 'Pending Automatic Verification' || 
      c.status === 'Pending Company Review' || 
      c.status === 'Pending'
    ).length;

    let profileData;
    if (getIsMongoConnected()) {
      profileData = await StudentProfile.findOne({ email: cleanEmail });
    } else {
      profileData = storeService.getStudentProfile(cleanEmail);
    }

    // Default fallback if profile record has not been initialized
    if (!profileData) {
      profileData = {
        fullName: studentUser.name,
        email: cleanEmail,
        headline: studentUser.title || 'Student',
        aboutMe: '',
        phone: '',
        location: '',
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: '',
        education: studentUser.institution ? [{
          school: studentUser.institution,
          degree: 'Undergraduate Program',
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
        passportId: `SKC-PASSPORT-${Math.floor(10000 + Math.random() * 90000)}-ST`,
      };
    }

    // Dynamic Evidence-Based Trust Index Calculation
    const trustResult = calculateTrustIndex({
      certificates: certs,
      experience: profileData.experience || [],
      projects: profileData.projects || [],
      education: profileData.education || []
    });

    profileData.trustScore = trustResult.score;
    profileData.trustBreakdown = trustResult.breakdown;

    res.json({
      success: true,
      data: {
        user: studentUser,
        profile: profileData,
        stats: {
          totalCerts: certs.length,
          verifiedCerts: verifiedCount,
          pendingCerts: pendingCount,
          projectsCount: profileData.projects?.length || 0,
          skillsCount: profileData.skills?.length || 0,
        },
        passportId: profileData.passportId,
        trustScore: trustResult.score,
        trustBreakdown: trustResult.breakdown,
        completionPercentage: profileData.completionPercentage || 30,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/student/trust-index
 * Get detailed Trust Index calculation and breakdown based strictly on verified evidence
 */
export const getStudentTrustIndex = async (req, res, next) => {
  try {
    const studentUser = req.user;
    const cleanEmail = studentUser.email.toLowerCase();

    const certs = getIsMongoConnected()
      ? await Certificate.find({ studentEmail: cleanEmail })
      : storeService.findCertificatesByStudentEmail(cleanEmail);

    let profileData;
    if (getIsMongoConnected()) {
      profileData = await StudentProfile.findOne({ email: cleanEmail });
    } else {
      profileData = storeService.getStudentProfile(cleanEmail);
    }

    const trustResult = calculateTrustIndex({
      certificates: certs,
      experience: profileData?.experience || [],
      projects: profileData?.projects || [],
      education: profileData?.education || []
    });

    res.json({
      success: true,
      data: {
        email: cleanEmail,
        score: trustResult.score,
        breakdown: trustResult.breakdown,
        calculatedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/student/profile
 * Update authenticated student's profile information
 */
export const updateStudentProfile = async (req, res, next) => {
  try {
    const cleanEmail = req.user.email.toLowerCase();
    const {
      fullName,
      headline,
      aboutMe,
      phone,
      location,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      education,
      experience,
      profileImage
    } = req.body;

    const updates = {};
    if (fullName !== undefined) updates.fullName = fullName.trim();
    if (headline !== undefined) updates.headline = headline.trim();
    if (aboutMe !== undefined) updates.aboutMe = aboutMe.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (location !== undefined) updates.location = location.trim();
    if (linkedinUrl !== undefined) updates.linkedinUrl = linkedinUrl.trim();
    if (githubUrl !== undefined) updates.githubUrl = githubUrl.trim();
    if (portfolioUrl !== undefined) updates.portfolioUrl = portfolioUrl.trim();
    if (education !== undefined && Array.isArray(education)) updates.education = education;
    if (experience !== undefined && Array.isArray(experience)) updates.experience = experience;
    if (profileImage !== undefined) updates.profileImage = profileImage;

    let updated;
    if (getIsMongoConnected()) {
      let profile = await StudentProfile.findOne({ email: cleanEmail });
      if (!profile) {
        profile = new StudentProfile({
          userId: req.user._id,
          email: cleanEmail,
          fullName: req.user.name,
          passportId: `SKC-PASSPORT-${Math.floor(10000 + Math.random() * 90000)}-ST`,
        });
      }
      Object.assign(profile, updates);
      profile.completionPercentage = profile.calculateCompletion();
      profile.updatedAt = new Date();
      await profile.save();
      updated = profile;

      if (updates.fullName || updates.profileImage !== undefined) {
        await User.findByIdAndUpdate(req.user._id, {
          ...(updates.fullName ? { name: updates.fullName } : {}),
          ...(updates.profileImage !== undefined ? { avatar: updates.profileImage } : {})
        });
      }
    } else {
      updated = storeService.updateStudentProfile(cleanEmail, updates);
    }

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/student/profile/image
 * Upload or replace student profile photo
 */
export const uploadProfileImage = async (req, res, next) => {
  try {
    const cleanEmail = req.user.email.toLowerCase();
    const { imageBase64, imageUrl } = req.body;

    const finalImage = imageBase64 || imageUrl;
    if (!finalImage) {
      return res.status(400).json({ success: false, message: 'Image data is required.' });
    }

    let updated;
    if (getIsMongoConnected()) {
      updated = await StudentProfile.findOneAndUpdate(
        { email: cleanEmail },
        { profileImage: finalImage, updatedAt: new Date() },
        { new: true }
      );
      await User.findByIdAndUpdate(req.user._id, { avatar: finalImage });
    } else {
      updated = storeService.updateStudentProfile(cleanEmail, { profileImage: finalImage });
    }

    res.json({
      success: true,
      message: 'Profile photo updated.',
      data: { profileImage: finalImage }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/student/profile/image
 * Remove profile photo
 */
export const deleteProfileImage = async (req, res, next) => {
  try {
    const cleanEmail = req.user.email.toLowerCase();

    if (getIsMongoConnected()) {
      await StudentProfile.findOneAndUpdate(
        { email: cleanEmail },
        { profileImage: '', updatedAt: new Date() }
      );
      await User.findByIdAndUpdate(req.user._id, { avatar: '' });
    } else {
      storeService.updateStudentProfile(cleanEmail, { profileImage: '' });
    }

    res.json({
      success: true,
      message: 'Profile photo removed.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/student/skills
 * Add skill - marked as self-reported until evidence is verified
 */
export const addSkill = async (req, res, next) => {
  try {
    const cleanEmail = req.user.email.toLowerCase();
    const { name, category, level, yearsOfExperience } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Skill name is required.' });
    }

    const newSkill = {
      id: `skl-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      category: category || 'Technical',
      level: level || 'Intermediate',
      yearsOfExperience: yearsOfExperience || '1 year',
      isVerified: false, // ALWAYS false for self-reported skills
      verifiedDate: '',
      verifiedBy: '',
    };

    if (getIsMongoConnected()) {
      const profile = await StudentProfile.findOne({ email: cleanEmail });
      if (!profile) return res.status(404).json({ success: false, message: 'Student profile not found.' });
      profile.skills.push(newSkill);
      profile.completionPercentage = profile.calculateCompletion();
      await profile.save();
    } else {
      storeService.addStudentSkill(cleanEmail, newSkill);
    }

    res.status(201).json({
      success: true,
      message: 'Skill added to profile (Self-Reported).',
      data: newSkill,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/student/skills/:skillId
 * Update an existing self-reported skill
 */
export const updateSkill = async (req, res, next) => {
  try {
    const cleanEmail = req.user.email.toLowerCase();
    const { skillId } = req.params;
    const { name, category, level, yearsOfExperience } = req.body;

    let updated;
    if (getIsMongoConnected()) {
      const profile = await StudentProfile.findOne({ email: cleanEmail });
      if (!profile) return res.status(404).json({ success: false, message: 'Profile not found.' });

      const skill = profile.skills.find(s => s.id === skillId);
      if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });

      if (name) skill.name = name.trim();
      if (category) skill.category = category;
      if (level) skill.level = level;
      if (yearsOfExperience) skill.yearsOfExperience = yearsOfExperience;

      await profile.save();
      updated = skill;
    } else {
      updated = storeService.updateStudentSkill(cleanEmail, skillId, { name, category, level, yearsOfExperience });
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }

    res.json({
      success: true,
      message: 'Skill updated.',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/student/skills/:skillId
 * Remove a skill from the student profile
 */
export const deleteSkill = async (req, res, next) => {
  try {
    const cleanEmail = req.user.email.toLowerCase();
    const { skillId } = req.params;

    if (getIsMongoConnected()) {
      const profile = await StudentProfile.findOne({ email: cleanEmail });
      if (!profile) return res.status(404).json({ success: false, message: 'Profile not found.' });

      profile.skills = profile.skills.filter(s => s.id !== skillId);
      profile.completionPercentage = profile.calculateCompletion();
      await profile.save();
    } else {
      const ok = storeService.deleteStudentSkill(cleanEmail, skillId);
      if (!ok) return res.status(404).json({ success: false, message: 'Skill not found.' });
    }

    res.json({
      success: true,
      message: 'Skill removed from profile.',
    });
  } catch (err) {
    next(err);
  }
};

export const getCertificates = async (req, res, next) => {
  try {
    const certs = getIsMongoConnected()
      ? await Certificate.find({ studentEmail: req.user.email.toLowerCase() })
      : storeService.findCertificatesByStudentEmail(req.user.email);

    res.json({
      success: true,
      count: certs.length,
      data: certs,
    });
  } catch (err) {
    next(err);
  }
};

export const getSingleCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cert = getIsMongoConnected()
      ? await Certificate.findOne({ id })
      : storeService.findCertificateById(id);

    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found.' });
    }

    if (cert.studentEmail && cert.studentEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({ success: false, message: 'Access denied. You do not own this credential.' });
    }

    res.json({ success: true, data: cert });
  } catch (err) {
    next(err);
  }
};

export const uploadCertificate = async (req, res, next) => {
  try {
    const {
      title,
      issuer,
      issuerCategory,
      skills,
      grade,
      evidenceUrl,
      notes,
      issueDate,
      expiryDate,
      certId: customCertId,
      verificationUrl,
      qrPayload,
      forceReject,
      rejectionReason
    } = req.body;

    if (!title || !issuer) {
      return res.status(400).json({
        success: false,
        message: 'Certificate title and issuing organization are required.',
      });
    }

    const certId = customCertId || `SKC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}-P`;
    
    const extracted = extractCertificateDetails({
      title,
      issuer,
      certId,
      holderName: req.user.name,
      issueDate,
      expiryDate,
      verificationUrl,
      qrPayload
    });

    const autoResult = await runAutoVerification({
      ...extracted,
      forceReject,
      rejectionReason
    });

    const hash = generateCertificateHash({
      title,
      issuer,
      recipientName: req.user.name,
      studentEmail: req.user.email,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : [])
    });

    const isVerified = autoResult.status === 'Verified';

    const newCert = {
      id: certId,
      title,
      issuer,
      issuerCategory: issuerCategory || 'Specialized Academy',
      issuerLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80',
      issueDate: extracted.issueDate,
      expiryDate: extracted.expiryDate,
      status: autoResult.status,
      verificationHash: hash,
      grade: grade || 'Under Review',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : ['Verified Industry Competence']),
      credentialType: 'Student Uploaded Claim',
      verifiedBy: isVerified ? autoResult.evidence.sourceChecked : 'Pending Verification Protocol',
      ledgerBlock: isVerified ? generateLedgerBlock() : 0,
      description: notes || 'Student submitted certificate for automated cryptographic audit.',
      evidenceUrl: evidenceUrl || '',
      studentId: req.user.id || req.user._id,
      studentName: req.user.name,
      studentEmail: req.user.email.toLowerCase(),
      extractedDetails: autoResult.extractedDetails,
      autoVerificationEvidence: {
        sourceChecked: autoResult.evidence.sourceChecked,
        checkDate: autoResult.evidence.timestamp,
        evidenceNotes: autoResult.evidence.evidenceNotes,
        rejectionReason: autoResult.evidence.rejectionReason,
        adapterName: autoResult.evidence.adapterType,
        isOfficialCheck: autoResult.evidence.isOfficialCheck,
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
          timestamp: new Date().toISOString(),
          engineVersion: 'SkillChain-VerifEngine-v2.1',
          sourceChecked: autoResult.evidence.sourceChecked,
          isOfficialCheck: autoResult.evidence.isOfficialCheck,
          resultStatus: autoResult.status,
          evidenceNotes: autoResult.evidence.evidenceNotes,
          rejectionReason: autoResult.evidence.rejectionReason,
          adapterType: autoResult.evidence.adapterType,
          ocrExtracted: autoResult.extractedDetails
        }
      ]
    };

    if (getIsMongoConnected()) {
      await Certificate.create(newCert);
    } else {
      storeService.addCertificate(newCert);
    }

    res.status(201).json({
      success: true,
      message: `Certificate uploaded and processed. Status: ${newCert.status}`,
      data: newCert,
    });
  } catch (err) {
    next(err);
  }
};

export const sendToCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { targetCompanyId, targetCompanyName, consentStatement, studentNotes } = req.body;

    if (!targetCompanyName) {
      return res.status(400).json({
        success: false,
        message: 'Target company name is required to initiate company verification.',
      });
    }

    const cert = getIsMongoConnected()
      ? await Certificate.findOne({ id })
      : storeService.findCertificateById(id);

    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found.' });
    }

    if (cert.studentEmail && cert.studentEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({ success: false, message: 'Access denied. You do not own this credential.' });
    }

    const allowedStatuses = ['Unable to Verify', 'Rejected', 'Additional Information Required', 'Pending Automatic Verification'];
    if (!allowedStatuses.includes(cert.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot send certificate with status "${cert.status}" to company review.`,
      });
    }

    const consentTime = new Date().toISOString();
    const failureReason = cert.autoVerificationEvidence?.rejectionReason || cert.autoVerificationEvidence?.evidenceNotes || 'Automatic verification could not be completed.';

    const historyEntry = {
      timestamp: consentTime,
      engineVersion: 'SkillChain-CompanyBridge-v1.0',
      sourceChecked: `Sent to ${targetCompanyName} with student cryptographic consent`,
      isOfficialCheck: false,
      resultStatus: 'Pending Company Review',
      evidenceNotes: `Student explicitly consented to share credential with ${targetCompanyName}.`,
      adapterType: 'STUDENT_AUTHORIZED_DISPATCH'
    };

    const companySharingUpdate = {
      sharedWithCompany: true,
      targetCompanyId: targetCompanyId || 'usr-company-01',
      targetCompanyName,
      consentedAt: consentTime,
      consentStatement: consentStatement || 'I hereby authorize SkillChain to transmit this certificate document and extracted claims to the designated issuer for manual auditing.',
      companyResponseNotes: '',
      respondedAt: null,
      infoRequestedDetails: '',
    };

    const updatedCertFields = {
      status: 'Pending Company Review',
      companySharing: companySharingUpdate,
      verificationHistory: [...(cert.verificationHistory || []), historyEntry]
    };

    const requestId = `req-${Date.now().toString().slice(-6)}`;
    const newRequest = {
      id: requestId,
      certificateId: cert.id,
      studentId: req.user.id || req.user._id,
      studentName: req.user.name,
      studentEmail: req.user.email.toLowerCase(),
      studentAvatar: req.user.avatar || '',
      credentialTitle: cert.title,
      targetCompanyId: targetCompanyId || 'usr-company-01',
      targetCompanyName,
      courseId: cert.id,
      submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending Company Review',
      evidenceUrl: cert.evidenceUrl || '',
      extractedDetails: cert.extractedDetails,
      autoVerificationFailureReason: failureReason,
      studentConsent: {
        consented: true,
        consentedAt: consentTime,
        consentText: companySharingUpdate.consentStatement,
      },
      skillsClaimed: cert.skills || [],
      studentNotes: studentNotes || '',
      companyDecisionNotes: '',
      rejectionReason: '',
      additionalInfoRequiredNotes: '',
      respondedAt: null,
    };

    if (getIsMongoConnected()) {
      await Certificate.findOneAndUpdate({ id }, updatedCertFields);
      await VerificationRequest.create(newRequest);
    } else {
      storeService.updateCertificate(id, updatedCertFields);
      storeService.addRequest(newRequest);
    }

    res.json({
      success: true,
      message: `Certificate successfully transmitted to ${targetCompanyName} for official verification.`,
      data: {
        certificateId: cert.id,
        requestId,
        targetCompanyName,
        status: 'Pending Company Review'
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getVerificationHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cert = getIsMongoConnected()
      ? await Certificate.findOne({ id })
      : storeService.findCertificateById(id);

    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found.' });
    }

    if (cert.studentEmail && cert.studentEmail.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({
      success: true,
      data: {
        certificateId: cert.id,
        status: cert.status,
        companySharing: cert.companySharing,
        history: cert.verificationHistory || []
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getKnownIssuersEndpoint = (req, res) => {
  res.json({
    success: true,
    data: getKnownIssuers()
  });
};
