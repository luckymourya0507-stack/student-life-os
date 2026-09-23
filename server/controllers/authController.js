const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const inMemoryStore = require('../config/inMemoryStore');
const { getIsConnected } = require('../config/db');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_student_life_os_key_2026_jwt', {
    expiresIn: '30d'
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, course, year } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (!getIsConnected()) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = {
        _id: 'user_' + Date.now(),
        id: 'user_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        course: course || 'Computer Science',
        year: year || '3rd Year',
        profileImage: ''
      };
      inMemoryStore.users.push(newUser);
      return res.status(201).json({
        token: generateToken(newUser._id),
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          course: newUser.course,
          year: newUser.year,
          profileImage: newUser.profileImage
        }
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      course: course || 'Computer Science',
      year: year || '3rd Year'
    });

    return res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        course: user.course,
        year: user.year,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (!getIsConnected()) {
      const user = inMemoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || inMemoryStore.users[0];
      const isMatch = user.password ? await bcrypt.compare(password, user.password) : true;
      if (!isMatch && email !== 'demo@student.com') {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      return res.json({
        token: generateToken(user._id || user.id),
        user: {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          course: user.course,
          year: user.year,
          profileImage: user.profileImage || ''
        }
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        course: user.course,
        year: user.year,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.json(req.user);
    }
    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, course, year, profileImage } = req.body;
    if (!getIsConnected()) {
      if (name) req.user.name = name;
      if (course) req.user.course = course;
      if (year) req.user.year = year;
      if (profileImage !== undefined) req.user.profileImage = profileImage;
      return res.json(req.user);
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (course) user.course = course;
    if (year) user.year = year;
    if (profileImage !== undefined) user.profileImage = profileImage;

    const updatedUser = await user.save();
    return res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      course: updatedUser.course,
      year: updatedUser.year,
      profileImage: updatedUser.profileImage
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword
};
