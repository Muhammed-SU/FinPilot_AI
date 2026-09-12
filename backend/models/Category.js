const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  name: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense', 'both'], default: 'expense' },
  color: { type: String, default: '#3B82F6' },
  icon: { type: String },
  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
