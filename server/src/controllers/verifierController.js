import { Certificate } from '../models/Certificate.js';
import { getIsMongoConnected } from '../config/db.js';
import { storeService } from '../services/storeService.js';

export const verifyCredential = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Certificate ID or verification hash is required.',
      });
    }

    let cert;

    if (getIsMongoConnected()) {
      cert = await Certificate.findOne({
        $or: [{ id: id.trim() }, { verificationHash: id.trim() }]
      });
    } else {
      cert = storeService.findCertificateById(id.trim());
    }

    if (!cert) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: `No cryptographic credential found matching identifier: ${id}`,
      });
    }

    res.json({
      success: true,
      verified: cert.status === 'Verified',
      data: cert,
    });
  } catch (err) {
    next(err);
  }
};

