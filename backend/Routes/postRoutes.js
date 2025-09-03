const express = require("express");
const router = express.Router();
const {
    createPost,
    getAllPosts,
    searchPosts,
    getPostById,
    updatePost,
    deletePost,
    toggleLike
} = require("../Controllers/postController");
const { verifyToken } = require("../Middleware/authMiddleware");
const { upload, uploadPostImageLocal } = require("../Middleware/upload");

// Post CRUD routes
router.post("/create", verifyToken, upload.single("coverImage"), uploadPostImageLocal, createPost);
router.get("/all", getAllPosts);
router.get('/search', searchPosts);
router.get('/:id', getPostById);
router.put("/:id", verifyToken, upload.single("coverImage"), uploadPostImageLocal, updatePost);
router.delete("/:id", verifyToken, deletePost);

// Like routes
router.post("/:id/like", verifyToken, toggleLike);

module.exports = router;
