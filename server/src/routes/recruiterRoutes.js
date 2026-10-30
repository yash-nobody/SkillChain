import express from 'express';
import {
  searchCandidates,
  toggleShortlist
} from '../controllers/recruiterController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('recruiter'));

router.get('/candidates', searchCandidates);
router.post('/candidates/:id/shortlist', toggleShortlist);

export default router;

