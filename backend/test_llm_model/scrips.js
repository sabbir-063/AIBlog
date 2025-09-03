import Groq from "groq-sdk";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the backend .env file
dotenv.config({ path: path.join(__dirname, "../.env") });

// Initialize Groq with API key from environment
const groq = new Groq({
    apiKey: process.env.GROQ_API_TOKEN,
});

async function main() {
    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "user",
                    content: "can you tell me about chaldal?",
                },
            ],
        });

        console.log(completion.choices[0]?.message?.content);
    } catch (error) {
        console.error("Error testing LLaMA model:", error.message);
    }
}

main().catch(console.error);