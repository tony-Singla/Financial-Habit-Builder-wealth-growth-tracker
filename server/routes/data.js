const router = require('express').Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const sanitize = require('../utils/sanitize');

router.use(auth);

// Returns the logged-in user's data, or null for a brand new account.
router.get('/', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('data');
    res.json({ data: user.data });
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const data = sanitize((req.body || {}).data);
    await User.updateOne({ _id: req.user._id }, { data });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
