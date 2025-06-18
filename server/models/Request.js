const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  matricule: { type: String, required: true },
  department: { type: String, required: true },
  level: { type: String, required: true },
  reason: { type: String, required: true },
  passion: { type: String, required: true },
  goals: { type: String, required: true },
  skills: String,
  commitment: { type: String, required: true },
  previousExperience: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', requestSchema);