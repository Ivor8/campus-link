const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  title: String,
  description: String,
  date: Date,
  location: String,
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Event', eventSchema);
