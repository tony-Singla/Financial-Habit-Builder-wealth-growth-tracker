const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 40 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    // Transactions, habits, goals, assets and net worth history for this user.
    data: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true, minimize: false }
);

module.exports = model('User', userSchema);
