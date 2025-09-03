const mongoose = require("mongoose");

const profileImageSchema = new mongoose.Schema({
    filename: { type: String },
    originalName: { type: String },
    url: { type: String, required: true },
    path: { type: String },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
    size: { type: Number },
    mimetype: { type: String }
}, { _id: false });

// AI-related user settings
const aiSettingsSchema = new mongoose.Schema({
    aiAssistantEnabled: { type: Boolean, default: true }, // enable/disable AI assistant
    preferredTone: { type: String, enum: ["formal", "casual", "neutral"], default: "neutral" }, // AI writing style
    contentSuggestions: { type: Boolean, default: true }, // allow AI to suggest posts
}, { _id: false });

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    profilePicture: {
        type: String,
        default: "https://images.unsplash.com/photo-1615911907304-d418c903b058?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    aiSettings: aiSettingsSchema, // User-specific AI settings
    profileImage: { type: profileImageSchema }, // Local profile image
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    role: {
        type: String,
        enum: ["admin", "author", "reader"],
        default: "reader"
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = { User };