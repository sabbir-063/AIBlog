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


// AI-generated metadata for posts
const aiMetaSchema = new mongoose.Schema({
  summary: { type: String },              // AI-generated short summary (TL;DR)
  seoTitle: { type: String },             // AI-suggested SEO-friendly title
  seoDescription: { type: String },       // AI meta description
  suggestedTags: [{ type: String }],      // AI-suggested tags
  generatedAt: { type: Date },            // When AI generated this
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
  tags: [{ type: String, trim: true }],

  // AI features
  aiMeta: aiMetaSchema, // Store all AI-generated metadata here

}, { timestamps: true });

// Virtual for like count
postSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// Ensure virtuals are serialized
postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

// Indexes
postSchema.index({ title: "text", content: "text" }, { name: "title_content_text" });
postSchema.index({ tags: 1 }, { name: "tags_1" });

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
