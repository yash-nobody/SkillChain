import mongoose from 'mongoose';

const verificationLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  engineVersion: {
    type: String,
    default: 'SkillChain-VerifEngine-v2.1',
  },
  ocrExtracted: {
    holderName: String,
    issuer: String,
    title: String,
    certId: String,
    issueDate: String,
    expiryDate: String,
    verificationUrl: String,
    qrPayload: String,
  },
  sourceChecked: {
    type: String,
    default: 'None',
  },
  isOfficialCheck: {
    type: Boolean,
    default: false,
  },
  resultStatus: {
    type: String,
    enum: [
      'Pending Automatic Verification',
      'Verified',
      'Unable to Verify',
      'Rejected',
      'Pending Company Review',
      'Company Confirmed',
      'Company Rejected',
      'Additional Information Required'
    ],
    required: true,
  },
  evidenceNotes: String,
  rejectionReason: String,
  adapterType: {
    type: String,
    default: 'DEMO_MODULAR_ADAPTER',
  }
});

const certificateSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
  },
  issuer: {
    type: String,
    required: true,
  },
  issuerCategory: {
    type: String,
    default: 'Technology & Engineering',
  },
  issuerLogo: {
    type: String,
    default: '',
  },
  issueDate: {
    type: String,
    default: () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  },
  expiryDate: {
    type: String,
    default: 'Never (Lifetime Verifiable)',
  },
  status: {
    type: String,
    enum: [
      'Pending Automatic Verification',
      'Verified',
      'Unable to Verify',
      'Rejected',
      'Pending Company Review',
      'Company Confirmed',
      'Company Rejected',
      'Additional Information Required'
    ],
    default: 'Pending Automatic Verification',
  },
  verificationHash: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  credentialType: {
    type: String,
    default: 'Professional Credential',
  },
  verifiedBy: {
    type: String,
    default: 'SkillChain Protocol Notary',
  },
  ledgerBlock: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: '',
  },
  evidenceUrl: {
    type: String,
    default: '',
  },
  studentId: {
    type: String,
    default: '',
  },
  studentName: {
    type: String,
    default: '',
  },
  studentEmail: {
    type: String,
    required: true,
  },
  // Extracted details via OCR/QR
  extractedDetails: {
    holderName: String,
    issuer: String,
    title: String,
    certId: String,
    issueDate: String,
    expiryDate: String,
    verificationUrl: String,
    qrPayload: String,
  },
  // Automatic verification results
  autoVerificationEvidence: {
    sourceChecked: String,
    checkDate: String,
    evidenceNotes: String,
    rejectionReason: String,
    adapterName: String,
    isOfficialCheck: Boolean,
  },
  // Student-controlled company sharing consent
  companySharing: {
    sharedWithCompany: {
      type: Boolean,
      default: false,
    },
    targetCompanyId: String,
    targetCompanyName: String,
    consentedAt: Date,
    consentStatement: String,
    companyResponseNotes: String,
    respondedAt: Date,
    infoRequestedDetails: String,
  },
  // Verification history log
  verificationHistory: [verificationLogSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);
