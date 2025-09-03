const express = require("express");
const router = express.Router();
const {
    generateOutline,
    generateIntroductions,
    improveContent,
    generateSEOData,
    generateSummary,
    generatePostAIMetadata,
    suggestContentIdeas,
    updateAISettings
} = require("../Controllers/aiController");
const { verifyToken } = require("../Middleware/authMiddleware");

// AI Writing Assistant Routes
router.post("/generate-outline", verifyToken, generateOutline);
router.post("/generate-introductions", verifyToken, generateIntroductions);
router.post("/improve-content", verifyToken, improveContent);

// SEO & Metadata Routes
router.post("/generate-seo", verifyToken, generateSEOData);
router.post("/generate-summary", verifyToken, generateSummary);
router.post("/posts/:id/generate-metadata", verifyToken, generatePostAIMetadata);

// Content Suggestion Routes
router.get("/suggest-content", verifyToken, suggestContentIdeas);

// User AI Settings Routes
router.put("/settings", verifyToken, updateAISettings);

// Summary generation for specific post
router.post("/posts/:postId/summary", verifyToken, generateSummary);

module.exports = router;
