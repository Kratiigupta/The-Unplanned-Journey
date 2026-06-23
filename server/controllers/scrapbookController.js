import ScrapbookEntry from '../models/ScrapbookEntry.js';
import User from '../models/User.js';

// @desc    Create scrapbook entry
// @route   POST /api/scrapbook
export const createEntry = async (req, res) => {
  try {
    const { title, content, country, countryCode, mood } = req.body;
    
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (req.body.images) {
      // support legacy base64 if needed, but client should send FormData now
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const entry = await ScrapbookEntry.create({
      userId: req.user._id,
      title,
      content,
      country,
      countryCode,
      images,
      mood: mood || 'happy',
    });

    // Add reference to user
    await User.findByIdAndUpdate(req.user._id, {
      $push: { scrapbookEntries: entry._id },
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({ message: 'Error creating scrapbook entry' });
  }
};

// @desc    Get all entries for user
// @route   GET /api/scrapbook
export const getEntries = async (req, res) => {
  try {
    const entries = await ScrapbookEntry.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching entries' });
  }
};

// @desc    Update entry
// @route   PUT /api/scrapbook/:id
export const updateEntry = async (req, res) => {
  try {
    const entry = await ScrapbookEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    if (entry.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content, country, countryCode, mood } = req.body;
    if (title) entry.title = title;
    if (content) entry.content = content;
    if (country) entry.country = country;
    if (countryCode) entry.countryCode = countryCode;
    if (mood) entry.mood = mood;

    if (req.files && req.files.length > 0) {
      // Append new images to existing ones
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      entry.images = [...entry.images, ...newImages];
    } else if (req.body.images) {
      entry.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const updated = await entry.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating entry' });
  }
};

// @desc    Delete entry
// @route   DELETE /api/scrapbook/:id
export const deleteEntry = async (req, res) => {
  try {
    const entry = await ScrapbookEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    if (entry.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await ScrapbookEntry.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { scrapbookEntries: entry._id },
    });

    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting entry' });
  }
};
