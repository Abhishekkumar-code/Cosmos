import mongoose from "mongoose";

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    RESEND_API_KEY: process.env.RESEND_API_KEY,

    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    COHERE_API_KEY: process.env.COHERE_API_KEY,

    GROQ_API_KEY: process.env.GROQ_API_KEY,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY,
    IMAGEKIT_API_KEY: process.env.IMAGEKIT_API_KEY,

    CHROMA_KEY: process.env.CHROMA_KEY,
    CHROMA_TENANT: process.env.CHROMA_TENANT,
    CHROMA_DATABASE: process.env.CHROMA_DATABASE,

    OPENAI_API_KEY: process.env.OPENAI_API_KEY
};

if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is missing");
if (!process.env.CHROMA_KEY) throw new Error("CHROMA_KEY is missing");
if (!process.env.CHROMA_TENANT) throw new Error("CHROMA_TENANT is missing");
if (!process.env.CHROMA_DATABASE) throw new Error("CHROMA_DATABASE is missing");
if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing");
if (!process.env.IMAGEKIT_API_KEY) throw new Error("IMAGEKIT_API_KEY is missing");
if (!process.env.TAVILY_API_KEY) throw new Error("TAVILY_API_KEY is missing");
if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing");
if (!process.env.COHERE_API_KEY) throw new Error("COHERE_API_KEY is missing");
if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY is missing"); 