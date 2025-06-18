const Request = require('../models/Request');
const Club = require('../models/Club');
const Member = require('../models/Member');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.submitApplication = catchAsync(async (req, res, next) => {
  const { clubId } = req.params;
  const userId = req.user._id;
  
  // Verify club exists
  const club = await Club.findById(clubId);
  if (!club) return next(new AppError('Club not found', 404));

  // Check existing membership
  const isMember = await Member.exists({ clubId, userId });
  if (isMember) return next(new AppError('Already a member', 400));

  // Check pending applications
  const hasPending = await Request.exists({ 
    clubId, 
    userId, 
    status: 'pending' 
  });
  if (hasPending) return next(new AppError('Pending application exists', 400));

  // Create application with user data
  const user = await User.findById(userId);
  const application = await Request.create({
    clubId,
    userId,
    userDetails: {
      name: user.name,
      email: user.email,
      matricule: user.matricule,
      department: user.department
    },
    ...req.body
  });

  res.status(201).json({
    status: 'success',
    data: { application }
  });
});

// ... (keep other controller methods but update paths to match new routes)

// Approve application (for club admins)
exports.approveApplication = catchAsync(async (req, res, next) => {
  const { requestId } = req.params;
  const adminId = req.user._id;

  // Find the request
  const request = await Request.findById(requestId).populate('clubId');
  if (!request) {
    return next(new AppError('Application not found', 404));
  }

  // Check if user is admin of the club
  const isAdmin = request.clubId.admins.includes(adminId);
  if (!isAdmin) {
    return next(new AppError('You are not authorized to approve applications for this club', 403));
  }

  // Update request status
  request.status = 'approved';
  await request.save();

  // Add user to members
  await Member.create({
    clubId: request.clubId._id,
    userId: request.userId,
    role: 'member'
  });

  // Add user to club's members array
  await Club.findByIdAndUpdate(request.clubId._id, {
    $addToSet: { members: request.userId }
  });

  res.status(200).json({
    status: 'success',
    data: {
      request
    }
  });
});

// Reject application (for club admins)
exports.rejectApplication = catchAsync(async (req, res, next) => {
  const { requestId } = req.params;
  const adminId = req.user._id;

  const request = await Request.findById(requestId).populate('clubId');
  if (!request) {
    return next(new AppError('Application not found', 404));
  }

  // Check if user is admin of the club
  const isAdmin = request.clubId.admins.includes(adminId);
  if (!isAdmin) {
    return next(new AppError('You are not authorized to reject applications for this club', 403));
  }

  request.status = 'rejected';
  await request.save();

  res.status(200).json({
    status: 'success',
    data: {
      request
    }
  });
});

// Get applications for a club (for admins)
exports.getClubApplications = catchAsync(async (req, res, next) => {
  const { clubId } = req.params;
  const adminId = req.user._id;

  // Check if user is admin of the club
  const club = await Club.findById(clubId);
  if (!club.admins.includes(adminId)) {
    return next(new AppError('You are not authorized to view applications for this club', 403));
  }

  const applications = await Request.find({ clubId })
    .populate('userId', 'name email profilePicture')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: applications.length,
    data: {
      applications
    }
  });
});