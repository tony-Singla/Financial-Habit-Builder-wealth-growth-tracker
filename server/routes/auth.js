const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Try again in a few minutes.' },
});
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const pub = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });
const fail = (res, code, error) => res.status(code).json({ error });

router.post('/register', limiter, async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 40) {
      return fail(res, 400, 'Enter your full name (2-40 characters).');
    }
    if (typeof email !== 'string' || !EMAIL.test(email.trim())) return fail(res, 400, 'Enter a valid email address.');
    if (typeof password !== 'string' || password.length < 8 || password.length > 72 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      return fail(res, 400, 'Password needs 8+ characters with letters and a number.');
    }
    const e = email.trim().toLowerCase();
    if (await User.findOne({ email: e })) return fail(res, 409, 'This email is already registered. Log in instead.');
    const user = await User.create({ name: name.trim(), email: e, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: sign(user), user: pub(user) });
  } catch (err) {
    if (err.code === 11000) return fail(res, 409, 'This email is already registered. Log in instead.');
    next(err);
  }
});

router.post('/login', limiter, async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string') return fail(res, 400, 'Enter your email and password.');
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) return fail(res, 401, 'Email or password is incorrect.');
    res.json({ token: sign(user), user: pub(user) });
  } catch (err) {
    next(err);
  }
});

router.get('/me', auth, (req, res) => res.json({ user: pub(req.user) }));

module.exports = router;
