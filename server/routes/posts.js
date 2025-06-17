const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createPost } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware'); // ✅ Add this line


// Image upload setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.post('/', authMiddleware, upload.single('image'), createPost);

module.exports = router;
