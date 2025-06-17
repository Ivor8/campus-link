const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  url: {
    type: String,
    required: true
  },
  caption: String,
  type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  }
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
