import express from 'express';
import {
  getGovernanceStats,
  getVerificationQueue,
  getIssuers,
  toggleIssuerStatus
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getGovernanceStats);
router.get('/queue', getVerificationQueue);
router.get('/issuers', getIssuers);
router.patch('/issuers/:id/status', toggleIssuerStatus);

export default router;

