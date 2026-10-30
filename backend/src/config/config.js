import mongoose from "mongoose";

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    RESEND_API_KEY:process.env.RESEND_API_KEY,
    GEMINI_API_KEY:process.env.GEMINI_API_KEY,
    COHERE_API_KEY:process.env.COHERE_API_KEY,
    GROQ_API_KEY:process.env.GROQ_API_KEY,
    TAVILY_API_KEY:process.env.TAVILY_API_KEY,
    IMAGEKIT_API_KEY:process.env.IMAGEKIT_API_KEY,
    CHROMA_KEY:process.env.CHROMA_KEY,
    CHROMA_TENANT:process.env.CHROMA_TENANT,
    CHROMA_DATABASE:process.env.CHROMA_DATABASE,
     OPENAI_API_KEY:process.env.OPENAI_API_KEY
}



if (!process.env. OPENAI_API_KEY) {
    throw new Error("  OPENAI_API_KEY nhi hia bhai log ")
}
if (!process.env.CHROMA_KEY) {
    throw new Error(" CHROMA_KEY nhi hia bhai log ")
}
if (!process.env.CHROMA_TENANT) {
    throw new Error("CHROMA_TENANT nhi hia bhai log ")
}
if (!process.env.CHROMA_DATABASE) {
    throw new Error(" CHROMA_DATABASE nhi hia bhai log ")
}
if (!process.env.MONGO_URI) {
    throw new Error("mongour nhi hia bhai log ")
}
if (!process.env.IMAGEKIT_API_KEY) {
    throw new Error("IMAGWKIT nhi hia bhai log ")
}
if (!process.env.TAVILY_API_KEY) {
    throw new Error(" tavily nhi hia bhai log ")
}
if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY nhi hia bhai log ")
}
if (!process.env.COHERE_API_KEY) {
    throw new Error("COHORE_API_KEY nhi hia bhai log ")
}
if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY hia bhai log ")
}

