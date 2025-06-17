// routes/postRoutes.js
const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

router.route('/:clubId/posts')
  .post(
    postController.uploadPostImage,
    postController.resizePostImage,
    postController.createPost
  )
  .get(postController.getClubPosts);

router.route('/posts/:postId/like')
  .patch(postController.toggleLike);

router.route('/posts/:postId/comment')
  .post(postController.addComment);

router.route('/posts/:postId')
  .delete(postController.deletePost);

module.exports = router;