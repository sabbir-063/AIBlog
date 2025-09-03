const aiService = require("../Services/aiService");
const { Post } = require("../Models/Post");
const { User } = require("../Models/userSchema");

// Generate blog outline based on topic
const generateOutline = async (req, res) => {
    try {
        const { topic } = req.body;
        const { id: userId } = req.user;

        if (!topic) {
            return res.status(400).json({ error: "Topic is required" });
        }

        // Get user's AI preferences
        const user = await User.findById(userId);
        const userTone = user?.aiSettings?.preferredTone || 'neutral';

        const outline = await aiService.generateBlogOutline(topic, userTone);

        res.json({
            success: true,
            data: outline
        });
    } catch (error) {
        console.error("Error generating outline:", error);
        res.status(500).json({ error: "Failed to generate outline" });
    }
};

// Generate introduction suggestions
const generateIntroductions = async (req, res) => {
    try {
        const { topic, count = 3 } = req.body;
        const { id: userId } = req.user;

        if (!topic) {
            return res.status(400).json({ error: "Topic is required" });
        }

        // Get user's AI preferences
        const user = await User.findById(userId);
        const userTone = user?.aiSettings?.preferredTone || 'neutral';

        const introductions = await aiService.generateIntroductions(topic, count, userTone);

        res.json({
            success: true,
            data: introductions
        });
    } catch (error) {
        console.error("Error generating introductions:", error);
        res.status(500).json({ error: "Failed to generate introductions" });
    }
};

// Improve existing content
const improveContent = async (req, res) => {
    try {
        const { content, improvementType = 'readability' } = req.body;
        const { id: userId } = req.user;

        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }

        // Get user's AI preferences
        const user = await User.findById(userId);
        const userTone = user?.aiSettings?.preferredTone || 'neutral';

        const improvedContent = await aiService.improveContent(content, improvementType, userTone);

        res.json({
            success: true,
            data: {
                originalContent: content,
                improvedContent,
                improvementType
            }
        });
    } catch (error) {
        console.error("Error improving content:", error);
        res.status(500).json({ error: "Failed to improve content" });
    }
};

// Generate SEO metadata for a post
const generateSEOData = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        const seoData = await aiService.generateSEOMetadata(title, content);

        res.json({
            success: true,
            data: seoData
        });
    } catch (error) {
        console.error("Error generating SEO data:", error);
        res.status(500).json({ error: "Failed to generate SEO data" });
    }
};

// Generate post summary
const generateSummary = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        let postContent = content;

        // If postId is provided, fetch the post
        if (postId && !content) {
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }
            postContent = post.content;
        }

        if (!postContent) {
            return res.status(400).json({ error: "Content is required" });
        }

        const summary = await aiService.generateSummary(postContent);

        // If postId provided, update the post with AI metadata
        if (postId) {
            await Post.findByIdAndUpdate(postId, {
                $set: {
                    'aiMeta.summary': summary,
                    'aiMeta.generatedAt': new Date()
                }
            });
        }

        res.json({
            success: true,
            data: { summary }
        });
    } catch (error) {
        console.error("Error generating summary:", error);
        res.status(500).json({ error: "Failed to generate summary" });
    }
};

// Auto-generate AI metadata for existing post
const generatePostAIMetadata = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if user owns the post or is admin
        if (post.author.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: "Not authorized" });
        }

        // Generate all AI metadata
        const [seoData, summary] = await Promise.all([
            aiService.generateSEOMetadata(post.title, post.content),
            aiService.generateSummary(post.content)
        ]);

        // Update post with AI metadata
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {
                $set: {
                    'aiMeta.summary': summary,
                    'aiMeta.seoTitle': seoData.seoTitle,
                    'aiMeta.seoDescription': seoData.seoDescription,
                    'aiMeta.suggestedTags': seoData.suggestedTags,
                    'aiMeta.generatedAt': new Date()
                }
            },
            { new: true }
        ).populate("author", "firstname lastname username role profilePicture profileImage");

        res.json({
            success: true,
            data: updatedPost
        });
    } catch (error) {
        console.error("Error generating post AI metadata:", error);
        res.status(500).json({ error: "Failed to generate AI metadata" });
    }
};

// Suggest content ideas for user
const suggestContentIdeas = async (req, res) => {
    try {
        const { id: userId } = req.user;

        // Get user's existing posts to analyze their interests
        const userPosts = await Post.find({ author: userId })
            .select('tags')
            .limit(20);

        const existingTags = [...new Set(userPosts.flatMap(post => post.tags))];

        const contentIdeas = await aiService.suggestContentIdeas([], existingTags);

        res.json({
            success: true,
            data: contentIdeas
        });
    } catch (error) {
        console.error("Error suggesting content ideas:", error);
        res.status(500).json({ error: "Failed to suggest content ideas" });
    }
};

// Update user AI settings
const updateAISettings = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { aiAssistantEnabled, preferredTone, contentSuggestions } = req.body;

        const updateData = {};
        if (typeof aiAssistantEnabled === 'boolean') {
            updateData['aiSettings.aiAssistantEnabled'] = aiAssistantEnabled;
        }
        if (['formal', 'casual', 'neutral'].includes(preferredTone)) {
            updateData['aiSettings.preferredTone'] = preferredTone;
        }
        if (typeof contentSuggestions === 'boolean') {
            updateData['aiSettings.contentSuggestions'] = contentSuggestions;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select('-password');

        res.json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        console.error("Error updating AI settings:", error);
        res.status(500).json({ error: "Failed to update AI settings" });
    }
};

module.exports = {
    generateOutline,
    generateIntroductions,
    improveContent,
    generateSEOData,
    generateSummary,
    generatePostAIMetadata,
    suggestContentIdeas,
    updateAISettings
};
