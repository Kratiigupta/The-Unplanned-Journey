import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';

dotenv.config({ path: '../.env' });

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, age, favoriteAnimal, dreamDestination } = req.body;
    let profilePicture = '';

    if (req.file) {
      // Assuming uploads/ is served statically, we just need the relative path or filename
      profilePicture = `/uploads/${req.file.filename}`;
    } else if (req.body.profilePicture) {
      // Keep support for base64 if still sent
      profilePicture = req.body.profilePicture;
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      age,
      favoriteAnimal,
      dreamDestination,
      profilePicture,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      favoriteAnimal: user.favoriteAnimal,
      dreamDestination: user.dreamDestination,
      profilePicture: user.profilePicture,
      passportId: user.passportId,
      explorerPoints: user.explorerPoints,
      visitedCountries: user.visitedCountries,
      stamps: user.stamps,
      achievements: user.achievements,
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      favoriteAnimal: user.favoriteAnimal,
      dreamDestination: user.dreamDestination,
      profilePicture: user.profilePicture,
      passportId: user.passportId,
      explorerPoints: user.explorerPoints,
      visitedCountries: user.visitedCountries,
      stamps: user.stamps,
      achievements: user.achievements,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Google OAuth login
// @route   POST /api/auth/google
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        profilePicture: picture || '',
        password: Math.random().toString(36).slice(-8) + 'A1!', // Random password for Google users
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      if (!user.profilePicture) user.profilePicture = picture || '';
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      favoriteAnimal: user.favoriteAnimal,
      dreamDestination: user.dreamDestination,
      profilePicture: user.profilePicture,
      passportId: user.passportId,
      explorerPoints: user.explorerPoints,
      visitedCountries: user.visitedCountries,
      stamps: user.stamps,
      achievements: user.achievements,
      token,
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      favoriteAnimal: user.favoriteAnimal,
      dreamDestination: user.dreamDestination,
      profilePicture: user.profilePicture,
      passportId: user.passportId,
      explorerPoints: user.explorerPoints,
      visitedCountries: user.visitedCountries,
      stamps: user.stamps,
      achievements: user.achievements,
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
