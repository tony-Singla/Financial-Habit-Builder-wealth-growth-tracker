const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'Please log in.' });
    const { id } = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    const user = await User.findById(id).select('name email role');
    if (!user) return res.status(401).json({ error: 'Account not found.' });
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
};

exports.admin = (req, res, next) =>
  req.user.role === 'admin' ? next() : res.status(403).json({ error: 'Admin access required.' });
