import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    minlength: 6,
    select: false,
  },
  age: {
    type: Number,
    min: 1,
    max: 150,
  },
  favoriteAnimal: {
    type: String,
    trim: true,
  },
  dreamDestination: {
    type: String,
    trim: true,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  passportId: {
    type: String,
    unique: true,
  },
  explorerPoints: {
    type: Number,
    default: 0,
  },
  visitedCountries: [{
    type: String,
  }],
  stamps: [{
    country: String,
    countryCode: String,
    earnedAt: { type: Date, default: Date.now },
  }],
  achievements: [{
    type: String,
  }],
  googleId: {
    type: String,
    sparse: true,
  },
  scrapbookEntries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ScrapbookEntry',
  }],
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate passport ID
userSchema.pre('save', async function () {
  if (this.passportId) return;
  const year = new Date().getFullYear();
  const count = await mongoose.model('User').countDocuments();
  this.passportId = `VEXP-${year}-${String(count + 1).padStart(3, '0')}`;
});

const User = mongoose.model('User', userSchema);
export default User;
