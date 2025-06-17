const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Club name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Club name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [50, 'Description should be at least 50 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['Academic', 'Cultural', 'Sports', 'Technology', 'Arts', 'Social', 'Volunteer', 'Political', 'Religious']
  },
  tags: [String],
  isPublic: {
    type: Boolean,
    default: true
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },
  meetingSchedule: String,
  coverImage: {
    type: String,
    default: 'default-cover.jpg'
  },
  logoImage: {
    type: String,
    default: 'default-logo.jpg'
  },
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

clubSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;