import express from 'express';
import { verifyCredential } from '../controllers/verifierController.js';

const router = express.Router();

// Public verification endpoint
router.get('/:id', verifyCredential);

export default router;

