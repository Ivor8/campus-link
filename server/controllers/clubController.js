const Club = require('../models/Club');
const User = require('../models/User');
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Multer config
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Only image files are allowed!', 400), false);
    }
  }
});

const uploadClubImages = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'logoImage', maxCount: 1 }
]);

const resizeClubImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  if (req.files.coverImage) {
    const coverFilename = `club-${req.user.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.coverImage[0].buffer)
      .resize(2000, 1000)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/clubs/${coverFilename}`);
    req.body.coverImage = `img/clubs/${coverFilename}`; // ✅ Save full relative path
  }

  if (req.files.logoImage) {
    const logoFilename = `club-${req.user.id}-${Date.now()}-logo.jpeg`;
    await sharp(req.files.logoImage[0].buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/clubs/${logoFilename}`);
    req.body.logoImage = `img/clubs/${logoFilename}`; // ✅ Save full relative path
  }

  next();
});


const createClub = catchAsync(async (req, res, next) => {
  const {
    name,
    description,
    category,
    tags,
    isPublic,
    requiresApproval,
    meetingSchedule
  } = req.body;

// 1. Create the new club
const newClub = await Club.create({
  name,
  description,
  category,
  tags: tags ? tags.split(',') : [],
  isPublic: isPublic === 'true',
  requiresApproval: requiresApproval === 'true',
  meetingSchedule,
  coverImage: req.body.coverImage,
  logoImage: req.body.logoImage,
  admins: [req.user.id],
  members: [req.user.id] // ✅ Add user as initial member
});

// 2. Update the user's `clubs` array
await User.findByIdAndUpdate(
  req.user.id,
  { $addToSet: { clubs: newClub._id } }, // ✅ Use $addToSet to avoid duplicates
  { new: true }
);



  res.status(201).json({
    status: 'success',
    data: { club: newClub }
  });
});
// get club by id
const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('members', 'name email')   // Optional
      .populate('admins', 'name email');   // Optional

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { club }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// get all clubs
const getAllClubs = catchAsync(async (req, res, next) => {
  const clubs = await Club.find();
  res.status(200).json({
    status: 'success',
    results: clubs.length,
    data: { clubs }
  });
});


// Export all functions in one object
module.exports = {
  uploadClubImages,
  resizeClubImages,
  createClub,
  getClubById,
  getAllClubs
};
