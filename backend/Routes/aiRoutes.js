const express = require("express");
const router = express.Router();
const {
    generateOutline,
    generateIntroductions,
    improveContent,
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

// SEO & Metadata Routes  //okk
router.post("/posts/:postId/summary", verifyToken, generateSummary); //ok
router.post("/posts/:postId/generate-metadata", verifyToken, generatePostAIMetadata); //ok

// Content Suggestion Routes
router.get("/suggest-content", verifyToken, suggestContentIdeas);

// User AI Settings Routes
router.put("/settings", verifyToken, updateAISettings);


module.exports = router;
