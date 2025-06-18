// controllers/postController.js
const Post = require('../models/Post');
const Club = require('../models/Club');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

// Multer config for post images
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

exports.uploadPostImage = upload.single('image');

exports.resizePostImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `post-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(800, 800)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/posts/${filename}`);

  req.body.image = `img/posts/${filename}`;
  next();
});

// Create a new post
exports.createPost = catchAsync(async (req, res, next) => {
  const { clubId } = req.params;
  const { text } = req.body;

  // Check if user is a member of the club
  const club = await Club.findById(clubId);
  if (!club.members.includes(req.user._id)) {
    return next(new AppError('You must be a member to post in this club', 403));
  }

  const post = await Post.create({
    club: clubId,
    author: req.user._id,
    text,
    image: req.body.image
  });

  res.status(201).json({
    status: 'success',
    data: {
      post
    }
  });
});

// Get all posts for a club
exports.getClubPosts = catchAsync(async (req, res, next) => {
  const { clubId } = req.params;
  
  const posts = await Post.find({ club: clubId })
    .populate('author', 'name profilePicture')
    .populate('comments.user', 'name profilePicture')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts
    }
  });
});

// Like/Unlike a post
exports.toggleLike = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  const likeIndex = post.likes.indexOf(userId);
  if (likeIndex === -1) {
    // Like the post
    post.likes.push(userId);
  } else {
    // Unlike the post
    post.likes.splice(likeIndex, 1);
  }

  await post.save();

  res.status(200).json({
    status: 'success',
    data: {
      post
    }
  });
});

// Add comment to a post
exports.addComment = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const { text } = req.body;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  post.comments.push({
    user: req.user._id,
    text
  });

  await post.save();

  res.status(200).json({
    status: 'success',
    data: {
      post
    }
  });
});

// Delete a post
exports.deletePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findOneAndDelete({
    _id: postId,
    $or: [
      { author: req.user._id }, // User is the author
      { 'club.admins': req.user._id } // User is admin of the club
    ]
  });

  if (!post) {
    return next(new AppError('No post found or you are not authorized to delete this post', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get all posts from all clubs (for homepage feed)
exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find()
    .populate('author', 'name profilePicture')
    .populate('club', 'name logoImage')
    .populate('comments.user', 'name profilePicture')
    .sort('-createdAt')
    .limit(50);

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts
    }
  });
});
