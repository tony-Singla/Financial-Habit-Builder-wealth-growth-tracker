const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { auth, admin } = require('../middleware/auth');

router.use(auth, admin);

router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().sort('createdAt');
    res.json({
      users: users.map((u) => {
        const d = u.data || {};
        const netWorth = (d.assets || []).reduce((sum, a) => sum + (a.kind === 'Liability' ? -a.val : a.val), 0);
        return { id: u._id, name: u.name, email: u.email, role: u.role, txCount: (d.tx || []).length, netWorth };
      }),
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ error: 'Invalid user id.' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    if (user.role === 'admin') return res.status(400).json({ error: 'Admin accounts cannot be deleted.' });
    await user.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
