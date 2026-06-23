import express from 'express';
import { updateProfile, visitCountry, getUserStats } from '../controllers/userController.js';
import protect from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.put('/profile', protect, upload.single('profilePicture'), updateProfile);
router.post('/visit-country', protect, visitCountry);
router.get('/stats', protect, getUserStats);

export default router;
