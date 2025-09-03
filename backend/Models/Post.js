const mongoose = require("mongoose");

const coverImageSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    path: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
    size: { type: Number },
    mimetype: { type: String }
}, { _id: false });

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    coverImage: { type: coverImageSchema, required: true },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    viewCount: {
        type: Number,
        default: 0
    },
    tags: [{ type: String, trim: true }]
},
    { timestamps: true });

// Virtual for like count
postSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

// Ensure virtuals are serialized
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

// Create proper indexes
// Text index on title and content (but not on tags array)
postSchema.index({ title: 'text', content: 'text' }, { name: 'title_content_text' });

// Regular index on tags for efficient tag-based searches
postSchema.index({ tags: 1 }, { name: 'tags_1' });

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };