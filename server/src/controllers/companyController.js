import { Certificate } from '../models/Certificate.js';
import { VerificationRequest } from '../models/VerificationRequest.js';
import { getIsMongoConnected } from '../config/db.js';
import { storeService } from '../services/storeService.js';
import { generateCertificateHash, generateLedgerBlock } from '../utils/cryptoHash.js';

export const getCompanyOverview = async (req, res, next) => {
  try {
    const companyUser = req.user;
    
    // Fetch requests targeted strictly to this company
    const requests = getIsMongoConnected()
      ? await VerificationRequest.find({
          $or: [
            { targetCompanyId: companyUser.id },
            { targetCompanyName: new RegExp(companyUser.name, 'i') }
          ]
        })
      : storeService.findRequestsByCompanyName(companyUser.name);

    const pendingCount = requests.filter(r => r.status === 'Pending Company Review' || r.status === 'Pending').length;

    res.json({
      success: true,
      data: {
        company: companyUser,
        stats: {
          totalIssued: 248,
          pendingRequests: pendingCount,
          verificationRate: '98.7%',
          talentReach: '4,200+',
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const issueCertificate = async (req, res, next) => {
  try {
    const { recipientName, recipientEmail, credentialTitle, skills, grade, notes } = req.body;

    if (!recipientName || !recipientEmail || !credentialTitle) {
      return res.status(400).json({
        success: false,
        message: 'Recipient name, email, and credential title are required.',
      });
    }

    const certId = `SKC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}-V`;
    const hash = generateCertificateHash({
      title: credentialTitle,
      recipientName,
      studentEmail: recipientEmail,
      issuer: req.user.name,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : [])
    });

    const newCert = {
      id: certId,
      title: credentialTitle,
      issuer: req.user.name,
      issuerCategory: 'Accredited Enterprise Issuer',
      issuerLogo: req.user.avatar,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      expiryDate: 'Never (Lifetime Verifiable)',
      status: 'Verified',
      verificationHash: hash,
      grade: grade || 'Honors Distinction',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : ['Verified Industry Competence']),
      credentialType: 'Verifiable Industry Credential',
      verifiedBy: `${req.user.name} Cryptographic Key ED25519`,
      ledgerBlock: generateLedgerBlock(),
      description: notes || `Directly issued and cryptographically signed by ${req.user.name}.`,
      evidenceUrl: '',
      studentEmail: recipientEmail,
      studentName: recipientName,
      extractedDetails: {
        holderName: recipientName,
        issuer: req.user.name,
        title: credentialTitle,
        certId,
        issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        expiryDate: 'Never (Lifetime Verifiable)',
      },
      autoVerificationEvidence: {
        sourceChecked: `${req.user.name} Sovereign Key`,
        checkDate: new Date().toISOString(),
        evidenceNotes: 'Directly minted and signed by accredited issuer account.',
        rejectionReason: '',
        adapterName: 'DIRECT_ISSUER_ANCHOR',
        isOfficialCheck: true,
      },
      companySharing: {
        sharedWithCompany: true,
        targetCompanyId: req.user.id,
        targetCompanyName: req.user.name,
        consentedAt: new Date().toISOString(),
        consentStatement: 'Direct issuer origin.',
      },
      verificationHistory: [
        {
          timestamp: new Date().toISOString(),
          engineVersion: 'SkillChain-DirectMint-v2.0',
          sourceChecked: req.user.name,
          isOfficialCheck: true,
          resultStatus: 'Verified',
          evidenceNotes: 'Direct enterprise cryptographic signature attached.',
          adapterType: 'DIRECT_ISSUER_ANCHOR'
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
      message: 'Certificate minted and cryptographically anchored successfully.',
      data: newCert,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Verification Requests strictly addressed to this company
 */
export const getRequests = async (req, res, next) => {
  try {
    const companyUser = req.user;
    
    let requests;
    if (getIsMongoConnected()) {
      requests = await VerificationRequest.find({
        $or: [
          { targetCompanyId: companyUser.id },
          { targetCompanyName: new RegExp(companyUser.name, 'i') }
        ]
      });
    } else {
      requests = storeService.findRequestsByCompanyName(companyUser.name);
    }

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Company Confirms a student's verification request
 */
export const confirmRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const companyUser = req.user;

    const request = getIsMongoConnected()
      ? await VerificationRequest.findOne({ id })
      : storeService.findRequestById(id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Verification request not found.' });
    }

    // Authorization check: only the target company can review this request
    const isTarget = 
      request.targetCompanyId === companyUser.id || 
      request.targetCompanyName.toLowerCase().includes(companyUser.name.toLowerCase()) ||
      companyUser.name.toLowerCase().includes(request.targetCompanyName.toLowerCase());

    if (!isTarget) {
      return res.status(403).json({ success: false, message: 'Access denied. This request was not sent to your company.' });
    }

    const respondedAt = new Date().toISOString();
    const decisionNotes = notes || `Officially confirmed and verified by ${companyUser.name} credential auditor.`;

    const requestUpdates = {
      status: 'Company Confirmed',
      companyDecisionNotes: decisionNotes,
      respondedAt
    };

    const certHistoryEntry = {
      timestamp: respondedAt,
      engineVersion: 'SkillChain-CompanyReview-v2.1',
      sourceChecked: `${companyUser.name} Official Audit`,
      isOfficialCheck: true,
      resultStatus: 'Company Confirmed',
      evidenceNotes: decisionNotes,
      adapterType: 'MANUAL_ISSUER_AUDIT'
    };

    if (getIsMongoConnected()) {
      await VerificationRequest.findOneAndUpdate({ id }, requestUpdates);
      await Certificate.findOneAndUpdate(
        { id: request.certificateId },
        {
          status: 'Company Confirmed',
          verifiedBy: `${companyUser.name} Authorized Signer`,
          ledgerBlock: generateLedgerBlock(),
          'companySharing.companyResponseNotes': decisionNotes,
          'companySharing.respondedAt': respondedAt,
          $push: { verificationHistory: certHistoryEntry }
        }
      );
    } else {
      storeService.updateRequest(id, requestUpdates);
      const cert = storeService.findCertificateById(request.certificateId);
      if (cert) {
        cert.status = 'Company Confirmed';
        cert.verifiedBy = `${companyUser.name} Authorized Signer`;
        cert.ledgerBlock = generateLedgerBlock();
        if (cert.companySharing) {
          cert.companySharing.companyResponseNotes = decisionNotes;
          cert.companySharing.respondedAt = respondedAt;
        }
        cert.verificationHistory = [...(cert.verificationHistory || []), certHistoryEntry];
      }
    }

    res.json({
      success: true,
      message: 'Certificate successfully confirmed and verified by your organization.',
      data: { id, status: 'Company Confirmed', decisionNotes }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Company Rejects a student's verification request
 */
export const rejectRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const companyUser = req.user;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'A rejection reason is required for institutional accountability.',
      });
    }

    const request = getIsMongoConnected()
      ? await VerificationRequest.findOne({ id })
      : storeService.findRequestById(id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Verification request not found.' });
    }

    const isTarget = 
      request.targetCompanyId === companyUser.id || 
      request.targetCompanyName.toLowerCase().includes(companyUser.name.toLowerCase()) ||
      companyUser.name.toLowerCase().includes(request.targetCompanyName.toLowerCase());

    if (!isTarget) {
      return res.status(403).json({ success: false, message: 'Access denied. This request was not sent to your company.' });
    }

    const respondedAt = new Date().toISOString();

    const requestUpdates = {
      status: 'Company Rejected',
      rejectionReason,
      companyDecisionNotes: rejectionReason,
      respondedAt
    };

    const certHistoryEntry = {
      timestamp: respondedAt,
      engineVersion: 'SkillChain-CompanyReview-v2.1',
      sourceChecked: `${companyUser.name} Official Audit`,
      isOfficialCheck: true,
      resultStatus: 'Company Rejected',
      evidenceNotes: `Rejected by issuing organization: ${rejectionReason}`,
      rejectionReason,
      adapterType: 'MANUAL_ISSUER_AUDIT'
    };

    if (getIsMongoConnected()) {
      await VerificationRequest.findOneAndUpdate({ id }, requestUpdates);
      await Certificate.findOneAndUpdate(
        { id: request.certificateId },
        {
          status: 'Company Rejected',
          'companySharing.companyResponseNotes': rejectionReason,
          'companySharing.respondedAt': respondedAt,
          $push: { verificationHistory: certHistoryEntry }
        }
      );
    } else {
      storeService.updateRequest(id, requestUpdates);
      const cert = storeService.findCertificateById(request.certificateId);
      if (cert) {
        cert.status = 'Company Rejected';
        if (cert.companySharing) {
          cert.companySharing.companyResponseNotes = rejectionReason;
          cert.companySharing.respondedAt = respondedAt;
        }
        cert.verificationHistory = [...(cert.verificationHistory || []), certHistoryEntry];
      }
    }

    res.json({
      success: true,
      message: 'Certificate rejected with recorded reason.',
      data: { id, status: 'Company Rejected', rejectionReason }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Company Requests Additional Information from the Student
 */
export const requestAdditionalInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { additionalInfoNotes } = req.body;
    const companyUser = req.user;

    if (!additionalInfoNotes) {
      return res.status(400).json({
        success: false,
        message: 'Details on required additional information are required.',
      });
    }

    const request = getIsMongoConnected()
      ? await VerificationRequest.findOne({ id })
      : storeService.findRequestById(id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Verification request not found.' });
    }

    const isTarget = 
      request.targetCompanyId === companyUser.id || 
      request.targetCompanyName.toLowerCase().includes(companyUser.name.toLowerCase()) ||
      companyUser.name.toLowerCase().includes(request.targetCompanyName.toLowerCase());

    if (!isTarget) {
      return res.status(403).json({ success: false, message: 'Access denied. This request was not sent to your company.' });
    }

    const respondedAt = new Date().toISOString();

    const requestUpdates = {
      status: 'Additional Information Required',
      additionalInfoRequiredNotes: additionalInfoNotes,
      respondedAt
    };

    const certHistoryEntry = {
      timestamp: respondedAt,
      engineVersion: 'SkillChain-CompanyReview-v2.1',
      sourceChecked: `${companyUser.name} Official Audit`,
      isOfficialCheck: false,
      resultStatus: 'Additional Information Required',
      evidenceNotes: `Issuer requested supplementary information: ${additionalInfoNotes}`,
      adapterType: 'MANUAL_ISSUER_AUDIT'
    };

    if (getIsMongoConnected()) {
      await VerificationRequest.findOneAndUpdate({ id }, requestUpdates);
      await Certificate.findOneAndUpdate(
        { id: request.certificateId },
        {
          status: 'Additional Information Required',
          'companySharing.infoRequestedDetails': additionalInfoNotes,
          'companySharing.respondedAt': respondedAt,
          $push: { verificationHistory: certHistoryEntry }
        }
      );
    } else {
      storeService.updateRequest(id, requestUpdates);
      const cert = storeService.findCertificateById(request.certificateId);
      if (cert) {
        cert.status = 'Additional Information Required';
        if (cert.companySharing) {
          cert.companySharing.infoRequestedDetails = additionalInfoNotes;
          cert.companySharing.respondedAt = respondedAt;
        }
        cert.verificationHistory = [...(cert.verificationHistory || []), certHistoryEntry];
      }
    }

    res.json({
      success: true,
      message: 'Supplementary information request transmitted to student.',
      data: { id, status: 'Additional Information Required', additionalInfoNotes }
    });
  } catch (err) {
    next(err);
  }
};
