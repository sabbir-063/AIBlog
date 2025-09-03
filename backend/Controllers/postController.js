const { Post } = require("../Models/Post");
const { deleteImage } = require("../Middleware/upload");

const createPost = async (req, res) => {
    const { title, content } = req.body;
    const { role, id: userId } = req.user;

    if (!["admin", "author"].includes(role)) {
        return res.status(403).json({ error: "Only authors or admins can create posts" });
    }

    try {
        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        // Debug log to see what's coming in
        console.log("Request file:", req.file);
        console.log("Request localImage:", req.localImage);
        console.log("Tags received:", req.body.tags);

        if (!req.file && !req.localImage) {
            return res.status(400).json({ error: "Cover image is required" });
        }

        // Ensure we have a processed image
        if (!req.localImage) {
            return res.status(400).json({ error: "Image processing failed" });
        }

        // Process tags correctly
        let tags = [];
        if (req.body.tags) {
            // Handle both string and array formats
            if (typeof req.body.tags === 'string') {
                tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            } else if (Array.isArray(req.body.tags)) {
                tags = req.body.tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
            }
        }

        const post = await Post.create({
            title,
            content,
            author: userId,
            coverImage: req.localImage,
            tags: tags
        });

        res.status(201).json(post);
    } catch (err) {
        console.error("Post creation error:", err);
        res.status(500).json({ error: "Post creation failed: " + err.message });
    }
};

const getAllPosts = async (req, res) => {
    try {
        // Fetch all posts sorted by creation date (newest first)
        const posts = await Post.find()
            .populate("author", "firstname lastname username role profilePicture profileImage")
            .sort({ createdAt: -1 });

        // Return just the posts array
        res.json({ posts });
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};

const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id)
            .populate("author", "firstname lastname username role profilePicture profileImage")
            .populate("likes", "firstname lastname username profilePicture profileImage");

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Increment view count
        post.viewCount += 1;
        await post.save();

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch post" });
    }
};

const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const { role, id: userId } = req.user;

    if (!["admin", "author"].includes(role)) {
        return res.status(403).json({ error: "Only authors or admins can update posts" });
    }

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        if (post.author.toString() !== userId) {
            return res.status(403).json({ error: "You are not authorized to update this post" });
        }

        post.title = title || post.title;
        post.content = content || post.content;

        // Handle cover image update
        if (req.localImage) {
            // Delete old cover image
            if (post.coverImage && post.coverImage.path) {
                try {
                    await deleteImage(post.coverImage.path);
                } catch (deleteError) {
                    console.error("Error deleting old cover image:", deleteError);
                }
            }
            post.coverImage = req.localImage;
        }
        
        // Handle tag updates
        if (req.body.tags) {
            // Handle both string and array formats
            if (typeof req.body.tags === 'string') {
                post.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            } else if (Array.isArray(req.body.tags)) {
                post.tags = req.body.tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
            }
        }

        await post.save();
        res.json(post);
    } catch (err) {
        console.error("Error updating post:", err);
        res.status(500).json({ error: "Failed to update post" });
    }
};

const deletePost = async (req, res) => {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    if (!["admin", "author"].includes(role)) {
        return res.status(403).json({ error: "Only authors or admins can delete posts" });
    }

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        if (post.author.toString() !== userId) {
            return res.status(403).json({ error: "You are not authorized to delete this post" });
        }

        // Delete cover image from local storage
        if (post.coverImage && post.coverImage.path) {
            try {
                await deleteImage(post.coverImage.path);
            } catch (deleteError) {
                console.error("Error deleting cover image:", deleteError);
            }
        }

        await Post.findByIdAndDelete(id);
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).json({ error: "Failed to delete post" });
    }
};

// Like/Unlike a post
const toggleLike = async (req, res) => {
    const { id } = req.params;
    const { id: userId } = req.user;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if user has already liked the post
        const likeIndex = post.likes.findIndex(like => like.toString() === userId);

        if (likeIndex === -1) {
            // User hasn't liked the post yet - add like
            post.likes.push(userId);
            await post.save();
            return res.status(200).json({
                liked: true,
                likeCount: post.likes.length,
                message: "Post liked successfully"
            });
        } else {
            // User already liked the post - remove like
            post.likes.splice(likeIndex, 1);
            await post.save();
            return res.status(200).json({
                liked: false,
                likeCount: post.likes.length,
                message: "Post unliked successfully"
            });
        }
    } catch (err) {
        console.error("Error toggling like:", err);
        res.status(500).json({ error: "Failed to toggle like" });
    }
};

// Search posts by text and/or tags
const searchPosts = async (req, res) => {
  try {
    const { q, tags } = req.query;
    let query = {};

    if (q) query.$text = { $search: q };
    if (tags) query.tags = { $in: tags.split(',').map(tag => tag.trim()) };

    const posts = await Post.find(query)
      .populate("author", "firstname lastname username role profilePicture profileImage")
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (err) {
    res.status(500).json({ error: "Failed to search posts" });
  }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    toggleLike,
    searchPosts
};
