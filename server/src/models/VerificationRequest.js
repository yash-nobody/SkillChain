import mongoose from 'mongoose';

const verificationRequestSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  certificateId: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: true,
  },
  studentAvatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  },
  credentialTitle: {
    type: String,
    required: true,
  },
  targetCompanyId: {
    type: String,
    required: true, // Must match the company's account id/DID
  },
  targetCompanyName: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    default: '',
  },
  submittedDate: {
    type: String,
    default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  },
  status: {
    type: String,
    enum: [
      'Pending Company Review',
      'Company Confirmed',
      'Company Rejected',
      'Additional Information Required'
    ],
    default: 'Pending Company Review',
  },
  evidenceUrl: {
    type: String,
    default: '',
  },
  extractedDetails: {
    holderName: String,
    issuer: String,
    title: String,
    certId: String,
    issueDate: String,
    verificationUrl: String,
    qrPayload: String,
  },
  autoVerificationFailureReason: {
    type: String,
    default: '',
  },
  studentConsent: {
    consented: {
      type: Boolean,
      default: true,
    },
    consentedAt: {
      type: Date,
      default: Date.now,
    },
    consentText: {
      type: String,
      default: 'I grant permission to share this credential and document exclusively with the selected issuing company for verification purposes.',
    },
  },
  skillsClaimed: {
    type: [String],
    default: [],
  },
  studentNotes: {
    type: String,
    default: '',
  },
  companyDecisionNotes: {
    type: String,
    default: '',
  },
  rejectionReason: {
    type: String,
    default: '',
  },
  additionalInfoRequiredNotes: {
    type: String,
    default: '',
  },
  respondedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export const VerificationRequest = mongoose.models.VerificationRequest || mongoose.model('VerificationRequest', verificationRequestSchema);
