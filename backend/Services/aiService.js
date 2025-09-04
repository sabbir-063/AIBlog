const Groq = require("groq-sdk");

class AIService {
    constructor() {
        this.groq = new Groq({
            apiKey: process.env.GROQ_API_TOKEN,
        });
    }

    async generateBlogOutline(topic, userTone = 'neutral') {
        try {
            const prompt = `Create a detailed blog outline for the topic: "${topic}". 
            Use a ${userTone} tone. Provide:
            1. A compelling title
            2. 3-5 main sections with brief descriptions
            3. Key points for each section
            
            Format as JSON with structure:
            {
                "title": "Blog Title",
                "sections": [
                    {
                        "heading": "Section Title",
                        "description": "Brief description",
                        "keyPoints": ["point1", "point2", "point3"]
                    }
                ]
            }`;

            const completion = await this.groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
            });

            return JSON.parse(completion.choices[0]?.message?.content);
        } catch (error) {
            console.error("Error generating blog outline:", error);
            throw new Error("Failed to generate blog outline");
        }
    }

    async generateIntroductions(topic, count = 3, userTone = 'neutral') {
        try {
            const prompt = `Generate ${count} different introductory paragraphs for a blog post about: "${topic}".
            Use a ${userTone} tone. Each introduction should be engaging, unique, and 2-3 sentences long.
            
            Format as JSON array:
            [
                "Introduction 1 text...",
                "Introduction 2 text...",
                "Introduction 3 text..."
            ]`;

            const completion = await this.groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.8,
            });

            return JSON.parse(completion.choices[0]?.message?.content);
        } catch (error) {
            console.error("Error generating introductions:", error);
            throw new Error("Failed to generate introductions");
        }
    }

    async improveContent(content, improvementType = 'readability', userTone = 'neutral') {
        try {
            let prompt;

            switch (improvementType) {
                case 'grammar':
                    prompt = `Fix grammar, spelling, and punctuation errors in this text while maintaining the original meaning and ${userTone} tone:\n\n${content}`;
                    break;
                case 'readability':
                    prompt = `Improve the readability and flow of this text while maintaining a ${userTone} tone. Make it more engaging and easier to understand:\n\n${content}`;
                    break;
                case 'expand':
                    prompt = `Expand this text with more details, examples, and explanations while maintaining a ${userTone} tone:\n\n${content}`;
                    break;
                case 'summarize':
                    prompt = `Summarize this text into a concise version while keeping the key points and maintaining a ${userTone} tone:\n\n${content}`;
                    break;
                default:
                    prompt = `Improve this text for better clarity and engagement with a ${userTone} tone:\n\n${content}`;
            }

            const completion = await this.groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.5,
            });

            return completion.choices[0]?.message?.content;
        } catch (error) {
            console.error("Error improving content:", error);
            throw new Error("Failed to improve content");
        }
    }

    async generateSEOMetadata(title, content) {
        try {
            const prompt = `Analyze this blog post and generate SEO metadata:
            
            Title: ${title}
            Content: ${content.substring(0, 1000)}...
            Just give me the JSON, no preamble or explanation.
            Provide JSON response with:
            {
                "seoTitle": "SEO-optimized title (max 60 chars)",
                "seoDescription": "Meta description (max 160 chars)",
                "suggestedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
            }`;

            const completion = await this.groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3,
            });
            console.log("SEO Metadata Response:", completion.choices[0]?.message?.content);
            return JSON.parse(completion.choices[0]?.message?.content);
        } catch (error) {
            console.error("Error generating SEO metadata:", error);
            throw new Error("Failed to generate SEO metadata");
        }
    }

    async generateSummary(content, maxLength = 150) {
        try {
            const prompt = `Create a concise summary (TL;DR) of this blog post in maximum ${maxLength} characters. Make it engaging and highlight the key takeaways:
            
            ${content}
            
            Return only the summary text, no additional formatting.`;

            const completion = await this.groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.4,
            });

            return completion.choices[0]?.message?.content.trim();
        } catch (error) {
            console.error("Error generating summary:", error);
            throw new Error("Failed to generate summary");
        }
    }

    async suggestContentIdeas(userInterests = [], existingTags = []) {
        try {
            const prompt = `Suggest 5 blog post ideas based on:
            User interests: ${userInterests.join(', ') || 'general topics'}
            Existing blog tags: ${existingTags.slice(0, 10).join(', ') || 'none'}
            
            Just give me the JSON, no preamble or explanation.
            Format as JSON array:
            [
                {
                    "title": "Blog post title",
                    "description": "Brief description of the post",
                    "suggestedTags": ["tag1", "tag2", "tag3"],
                }
            ]`;

            const completion = await this.groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.8,
            });

            return JSON.parse(completion.choices[0]?.message?.content);
        } catch (error) {
            console.error("Error suggesting content ideas:", error);
            throw new Error("Failed to suggest content ideas");
        }
    }
}

module.exports = new AIService();

// async generateBlogOutline(topic, userTone = 'neutral')
// async generateIntroductions(topic, count = 3, userTone = 'neutral')
// async improveContent(content, improvementType = 'readability', userTone = 'neutral')
// async generateSEOMetadata(title, content)
// async generateSummary(content, maxLength = 150)
// async suggestContentIdeas(userInterests = [], existingTags = [])
// async generateBlogOutline(topic, userTone = 'neutral')
// async generateIntroductions(topic, count = 3, userTone = 'neutral')
// async suggestContentIdeas(userInterests = [], existingTags = []) 