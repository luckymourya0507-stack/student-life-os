const jwt = require('jsonwebtoken');
const User = require('../models/User');
const inMemoryStore = require('../config/inMemoryStore');
const { getIsConnected } = require('../config/db');

const jwtSecret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? null : 'local_student_life_os_secret');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!jwtSecret) throw new Error('JWT_SECRET is required');
      const decoded = jwt.verify(token, jwtSecret);

      if (getIsConnected()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        await inMemoryStore.ready;
        req.user = inMemoryStore.users.find((u) => u._id === decoded.id || u.id === decoded.id);
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
