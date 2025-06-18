// server/controllers/postController.js
const Post = require('../models/Post');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Ensure posts directory exists
const postsDir = path.join(__dirname, '../public/img/posts');
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

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
  const filePath = path.join(postsDir, filename);

  await sharp(req.file.buffer)
    .resize(800, 800)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(filePath);

  req.body.image = `img/posts/${filename}`;
  next();
});

// Get all posts
exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find()
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

// Create a new post
exports.createPost = catchAsync(async (req, res, next) => {
  const { text } = req.body;
  
  const post = await Post.create({
    text,
    image: req.body.image,
    author: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: {
      post
    }
  });
});

// Toggle like on a post
exports.toggleLike = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  const likeIndex = post.likes.indexOf(req.user.id);
  if (likeIndex === -1) {
    post.likes.push(req.user.id);
  } else {
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
  const { text } = req.body;
  
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  post.comments.push({
    user: req.user.id,
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