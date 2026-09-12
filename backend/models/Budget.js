const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  category: String,
  budgetedAmount: Number,
  spentAmount: { type: Number, default: 0 },
  period: { type: String, enum: ['weekly', 'monthly', 'quarterly', 'yearly'] },
  startDate: Date,
  endDate: Date,
  alertThreshold: Number,
  isActive: { type: Boolean, default: true },
  color: String,
  description: String,
  tags: [String],
  rollover: Boolean,
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);
