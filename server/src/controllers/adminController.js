import { Certificate } from '../models/Certificate.js';
import { VerificationRequest } from '../models/VerificationRequest.js';
import { IssuerCompany } from '../models/IssuerCompany.js';
import { getIsMongoConnected } from '../config/db.js';
import { storeService } from '../services/storeService.js';

export const getGovernanceStats = async (req, res, next) => {
  try {
    const certs = getIsMongoConnected()
      ? await Certificate.find()
      : storeService.getAllCertificates();

    const requests = getIsMongoConnected()
      ? await VerificationRequest.find()
      : storeService.getAllRequests();

    const issuers = getIsMongoConnected()
      ? await IssuerCompany.find()
      : storeService.getAllIssuers();

    const pendingRequests = requests.filter(r => r.status === 'Pending').length;
    const accreditedIssuers = issuers.filter(i => i.status === 'Accredited').length;

    res.json({
      success: true,
      data: {
        totalVerifiedCertificates: 14820 + certs.filter(c => c.status === 'Verified').length,
        pendingQueueCount: pendingRequests,
        fraudDetectionRatePercent: 99.8,
        accreditedIssuersCount: accreditedIssuers,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getVerificationQueue = async (req, res, next) => {
  try {
    const requests = getIsMongoConnected()
      ? await VerificationRequest.find()
      : storeService.getAllRequests();

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (err) {
    next(err);
  }
};

export const getIssuers = async (req, res, next) => {
  try {
    const issuers = getIsMongoConnected()
      ? await IssuerCompany.find()
      : storeService.getAllIssuers();

    res.json({
      success: true,
      count: issuers.length,
      data: issuers,
    });
  } catch (err) {
    next(err);
  }
};

export const toggleIssuerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Accredited' | 'Suspended'

    if (getIsMongoConnected()) {
      const updated = await IssuerCompany.findOneAndUpdate(
        { id },
        { status },
        { new: true }
      );
      if (!updated) return res.status(404).json({ success: false, message: 'Issuer not found.' });
      return res.json({ success: true, data: updated });
    } else {
      const updated = storeService.updateIssuerStatus(id, status);
      if (!updated) return res.status(404).json({ success: false, message: 'Issuer not found.' });
      return res.json({ success: true, data: updated });
    }
  } catch (err) {
    next(err);
  }
};

