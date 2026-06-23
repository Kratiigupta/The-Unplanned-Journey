import mongoose from 'mongoose';

const scrapbookEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: 100,
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    maxlength: 5000,
  },
  country: {
    type: String,
    trim: true,
  },
  countryCode: {
    type: String,
    trim: true,
  },
  images: [{
    type: String,
  }],
  mood: {
    type: String,
    enum: ['excited', 'happy', 'amazed', 'peaceful', 'adventurous'],
    default: 'happy',
  },
}, {
  timestamps: true,
});

const ScrapbookEntry = mongoose.model('ScrapbookEntry', scrapbookEntrySchema);
export default ScrapbookEntry;
