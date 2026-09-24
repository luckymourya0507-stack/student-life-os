const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const inMemoryStore = require('../config/inMemoryStore');
const { getIsConnected } = require('../config/db');

const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : 'local_student_life_os_secret');

const toPublicUser = (user) => ({
  id: user._id || user.id,
  name: user.name,
  email: user.email,
  course: user.course,
  year: user.year,
  profileImage: user.profileImage || ''
});

const generateToken = (id) => {
  if (!jwtSecret) throw new Error('JWT_SECRET is required');
  return jwt.sign({ id }, jwtSecret, {
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
      const userId = 'user_' + Date.now();
      const newUser = {
        _id: userId,
        id: userId,
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
      await inMemoryStore.ready;
      const user = inMemoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      return res.json({
        token: generateToken(user._id || user.id),
        user: toPublicUser(user)
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
      return res.json(toPublicUser(req.user));
    }
    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, course, year, profileImage } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (normalizedEmail && !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (!getIsConnected()) {
      if (normalizedEmail && inMemoryStore.users.some((item) => item.email === normalizedEmail && item.id !== req.user.id)) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
      if (name) req.user.name = name;
      if (normalizedEmail) req.user.email = normalizedEmail;
      if (course) req.user.course = course;
      if (year) req.user.year = year;
      if (profileImage !== undefined) req.user.profileImage = profileImage;
      return res.json(toPublicUser(req.user));
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (normalizedEmail && normalizedEmail !== user.email) {
      const emailInUse = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
      if (emailInUse) return res.status(400).json({ message: 'User already exists with this email' });
      user.email = normalizedEmail;
    }

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
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new passwords' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    if (!getIsConnected()) {
      await inMemoryStore.ready;
      const user = inMemoryStore.users.find((item) => item._id === req.user.id || item.id === req.user.id);
      if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
      return res.json({ message: 'Password updated successfully' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
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
