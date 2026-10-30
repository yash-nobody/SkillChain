import mongoose from 'mongoose';

const issuerCompanySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'Technology Partner',
  },
  status: {
    type: String,
    enum: ['Accredited', 'Pending Review', 'Suspended'],
    default: 'Accredited',
  },
  keyId: {
    type: String,
    required: true,
  },
  certsIssued: {
    type: Number,
    default: 0,
  },
  signingKeyStatus: {
    type: String,
    default: 'ED25519-ACTIVE',
  },
  did: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export const IssuerCompany = mongoose.models.IssuerCompany || mongoose.model('IssuerCompany', issuerCompanySchema);

