import { ChatGoogle } from "@langchain/google";
import { ChatCohere } from "@langchain/cohere";
import { ChatGroq } from "@langchain/groq";
import { config } from "../config/config.js";

export const groqModel = new ChatGroq({
  apiKey: config.GROQ_API_KEY,
  model: "qwen/qwen3.6-27b",
  temperature: 0.7,
  maxRetries: 1,
});

export const judgeModel = new ChatGroq({
  apiKey: config.GROQ_API_KEY,
  model: "llama-3.1-70b-versatile",
  temperature: 0,
  maxRetries: 1,
});

export const cohereModel = new ChatCohere({
  model: "command-a-03-2025",
  apiKey: config.COHERE_API_KEY,
});

export const googlemodel = new ChatGoogle({
  model: "gemini-2.0-flash",
  apiKey: config.GEMINI_API_KEY,
});
