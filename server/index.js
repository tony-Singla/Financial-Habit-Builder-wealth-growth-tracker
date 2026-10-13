require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');

const { MONGO_URI, JWT_SECRET, CLIENT_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI || !JWT_SECRET) {
  console.error('Missing MONGO_URI or JWT_SECRET. Copy .env.example to .env and fill in the values.');
  process.exit(1);
}

const app = express();
app.set('trust proxy', 1);
app.use(helmet());

// CLIENT_URL can hold one origin or several separated by commas.
const origins = (CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim().replace(/\/$/, ''));
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || origins.includes(origin)) return cb(null, true);
    const err = new Error('Origin not allowed');
    err.status = 403;
    cb(err);
  },
}));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/data', require('./routes/data'));
app.use('/api/admin', require('./routes/admin'));

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => {
  const status = err.status || (err.type === 'entity.too.large' ? 413 : 500);
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status < 500 ? err.message : 'Server error' });
});

async function seedAdmin() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;
  if (await User.findOne({ role: 'admin' })) return;
  await User.create({
    name: 'Admin',
    email: ADMIN_EMAIL,
    password: await bcrypt.hash(ADMIN_PASSWORD, 12),
    role: 'admin',
  });
  console.log('Admin account created for', ADMIN_EMAIL);
}

mongoose.connect(MONGO_URI)
  .then(seedAdmin)
  .then(() => app.listen(PORT, () => console.log('FinHabit API running on port ' + PORT)))
  .catch((e) => {
    console.error('Startup failed:', e.message);
    process.exit(1);
  });
