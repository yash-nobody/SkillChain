import express from 'express';
import {
  getStudentProfile,
  updateStudentProfile,
  uploadProfileImage,
  deleteProfileImage,
  getStudentTrustIndex,
  addSkill,
  updateSkill,
  deleteSkill,
  getCertificates,
  getSingleCertificate,
  uploadCertificate,
  sendToCompany,
  getVerificationHistory,
  getKnownIssuersEndpoint
} from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All student routes are protected and role-guarded
router.use(protect);
router.use(authorize('student'));

// Profile management
router.get('/profile', getStudentProfile);
router.get('/me', getStudentProfile); // Alias for /me
router.get('/trust-index', getStudentTrustIndex);
router.put('/profile', updateStudentProfile);
router.put('/me', updateStudentProfile); // Alias for /me
router.post('/profile/image', uploadProfileImage);
router.delete('/profile/image', deleteProfileImage);

// Skills management
router.post('/skills', addSkill);
router.put('/skills/:skillId', updateSkill);
router.delete('/skills/:skillId', deleteSkill);

// Certificates & Verification
router.get('/certificates', getCertificates);
router.get('/certificates/:id', getSingleCertificate);
router.post('/certificates/upload', uploadCertificate);
router.post('/certificates/:id/send-to-company', sendToCompany);
router.get('/certificates/:id/verification-history', getVerificationHistory);
router.get('/known-issuers', getKnownIssuersEndpoint);

export default router;
