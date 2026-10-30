import express from 'express';
import {
  getCompanyOverview,
  issueCertificate,
  getRequests,
  confirmRequest,
  rejectRequest,
  requestAdditionalInfo
} from '../controllers/companyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('company'));

router.get('/overview', getCompanyOverview);
router.post('/issue', issueCertificate);
router.get('/requests', getRequests);
router.patch('/requests/:id/confirm', confirmRequest);
router.patch('/requests/:id/reject', rejectRequest);
router.patch('/requests/:id/request-info', requestAdditionalInfo);

export default router;
