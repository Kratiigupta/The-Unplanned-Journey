import express from 'express';
import { register, login, googleLogin, getMe } from '../controllers/authController.js';
import protect from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/register', upload.single('profilePicture'), register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);

export default router;
