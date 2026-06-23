import express from 'express';
import { createEntry, getEntries, updateEntry, deleteEntry } from '../controllers/scrapbookController.js';
import protect from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, upload.array('images', 5), createEntry);
router.get('/', protect, getEntries);
router.put('/:id', protect, upload.array('images', 5), updateEntry);
router.delete('/:id', protect, deleteEntry);

export default router;
