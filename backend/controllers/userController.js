import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      searchHistory: user.searchHistory,
      preferences: user.preferences,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      searchHistory: user.searchHistory,
      preferences: user.preferences,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      searchHistory: user.searchHistory,
      preferences: user.preferences,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    if (req.body.preferences) {
      user.preferences = {
        ...user.preferences,
        ...req.body.preferences,
      };
    }
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      searchHistory: updatedUser.searchHistory,
      preferences: updatedUser.preferences,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add city to search history
// @route   POST /api/users/history
// @access  Private
const addToSearchHistory = asyncHandler(async (req, res) => {
  const { city, country } = req.body;
  
  const user = await User.findById(req.user._id);
  
  if (user) {
    // Add to beginning of array, limit to 10 items
    user.searchHistory.unshift({ city, country });
    
    if (user.searchHistory.length > 5) {
      user.searchHistory = user.searchHistory.slice(0, 5);
    }
    
    await user.save();
    
    res.status(200).json(user.searchHistory);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { 
  authUser, 
  registerUser, 
  getUserProfile, 
  updateUserProfile,
  addToSearchHistory
};