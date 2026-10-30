import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
import { ChatOpenAI } from '@langchain/openai';
import { ChatCohere } from "@langchain/cohere";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain";
import * as z from "zod";
import { config } from "../config/config.js";
import { sendEmail as sendEmailService } from "./email.service.js";
import { searchinternet } from "./internet.service.js";
import { queryVectorStore } from "./vector.service.js";

const groqmodel = new ChatGroq({
  apiKey: config.GROQ_API_KEY,
  model: "qwen/qwen3.8-27b",
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
});

const openaimodel = new ChatOpenAI({
  apiKey: config.OPENAI_API_KEY,
  model: "gpt-4o-mini",
  temperature: 0,
  maxTokens: undefined,
  timeout: undefined,
  maxRetries: 2,
});

const geminimodel = new ChatGoogleGenerativeAI({
  apiKey: config.GEMINI_API_KEY,
  model: "gemini-3.8-flash",
  timeout: 60000,
});

const cohoremodel = new ChatCohere({
  apiKey: config.COHERE_API_KEY,
  model: "command-a-03-2025",
  temperature: 0,
  maxRetries: 2,
});

const SYSTEM_PROMPT = `You are Cosmos AI, a helpful, accurate developer assistant created by Abhishek Kumar.
Today's date and time is provided in brackets.

You have 3 tools:
1. searchDocument: Use whenever the user asks about an uploaded document, PDF, resume, candidate details, skills, projects, email, phone number, or file content in this chat.
2. searchInternet: Use for current events, latest news, weather, stock prices, or live facts.
3. sendEmail: Use when the user explicitly asks to send an email to a recipient.

Rules:
- If a document is uploaded or the user refers to "this PDF", "my resume", "the file", always refer to the uploaded document content or call searchDocument.
- Answer accurately from the document content or tool results. Do not invent facts.
- Answer in the user's language. Keep responses clear and structured.`;

const searchInternetTool = tool(searchinternet, {
  name: "searchInternet",
  description: "Search the web for latest news, weather, live stock/crypto prices, or current events.",
  schema: z.object({
    query: z.string().describe("Search query for the internet"),
  }),
});

const sendemail = tool(sendEmailService, {
  name: "sendEmail",
  description: "Send an email to a recipient when requested by the user.",
  schema: z.object({
    to: z.string().email().describe("Recipient email address"),
    subject: z.string().describe("Subject of the email"),
    html: z.string().describe("HTML content of the email"),
    text: z.string().describe("Plain text content of the email"),
  }),
});

function createSearchDocumentTool(chatId) {
  return tool(
    async ({ query }) => {
      try {
        const results = await queryVectorStore(chatId, query, 8);
        if (!results || !results.length) {
          return "No relevant information found in the uploaded document.";
        }
        return results.map((r) => r.text).join("\n---\n");
      } catch (err) {
        return "Error searching document: " + err.message;
      }
    },
    {
      name: "searchDocument",
      description: "Search inside the uploaded PDF document for information like email, phone number, skills, projects, work experience, or general document content.",
      schema: z.object({
        query: z.string().describe("Search query to look up in the uploaded document"),
      }),
    }
  );
}

const agentCache = new Map();

function getAgentForChat(chatId) {
  const key = chatId?.toString() || "no-chat";
  if (agentCache.has(key)) return agentCache.get(key);

  const searchDocument = createSearchDocumentTool(chatId?.toString());
  const tools = [searchInternetTool, sendemail, searchDocument];

  const agent = createAgent({
    model: groqmodel,
    tools,
    systemPrompt: SYSTEM_PROMPT,
  });

  agentCache.set(key, agent);
  return agent;
}

export function invalidateAgentCache(chatId) {
  agentCache.delete(chatId?.toString());
}

export async function generateresponse(messages, chatId) {
  const formattedMessages = await Promise.all(
    messages.map(async (msg) => {
      if (msg.role === "user") {
        if (msg.imageurl) {
          const imageResponse = await fetch(msg.imageurl);
          const buffer = await imageResponse.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";
          const dataUrl = `data:${mimeType};base64,${base64}`;

          return new HumanMessage({
            content: [
              { type: "text", text: msg.content || "Describe the Image." },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          });
        }
        return new HumanMessage(msg.content);
      } else if (msg.role === "ai") {
        return new AIMessage(msg.content);
      }
    })
  );

  const nowIST = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });
  const dateLine = "[Current date and time in India: " + nowIST + "]";

  let docContext = "";
  if (chatId) {
    try {
      const lastUserMsg = messages.filter((m) => m.role === "user").pop()?.content || "";
      const docResults = await queryVectorStore(chatId, lastUserMsg, 8);
      if (docResults && docResults.length > 0) {
        docContext = docResults.map((r) => r.text).join("\n---\n");
      }
    } catch (innerErr) {
      console.error("Doc context error:", innerErr.message);
    }
  }

  const cleanMessages = formattedMessages.filter(Boolean);
  for (let i = cleanMessages.length - 1; i >= 0; i--) {
    const m = cleanMessages[i];
    if (m instanceof HumanMessage) {
      let extra = dateLine;
      if (docContext) {
        extra += `\n\n[Uploaded Document Content]:\n${docContext}\n[End of Document Content]\nAnswer accurately using the uploaded document content above.`;
      }
      if (typeof m.content === "string") {
        cleanMessages[i] = new HumanMessage(extra + "\n\n" + m.content);
      } else if (Array.isArray(m.content)) {
        cleanMessages[i] = new HumanMessage({
          content: [{ type: "text", text: extra }, ...m.content],
        });
      }
      break;
    }
  }

  try {
    const agent = getAgentForChat(chatId);
    const response = await agent.invoke({
      messages: [...cleanMessages],
    });

    let finalContent = response.messages[response.messages.length - 1].content;
    if (typeof finalContent === "string") {
      finalContent = finalContent.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
    }
    return finalContent;
  } catch (err) {
    if (chatId) {
      const lastUserMsg = messages.filter((m) => m.role === "user").pop()?.content || "";
      try {
        const docResults = await queryVectorStore(chatId, lastUserMsg, 8);
        if (docResults && docResults.length > 0) {
          const docFallbackContext = docResults.map((r) => r.text).join("\n---\n");
          const fallbackRes = await groqmodel.invoke([
            new SystemMessage(
              "You are Cosmos AI. Answer the user's question accurately based on this uploaded document context:\n\n" +
                docFallbackContext
            ),
            new HumanMessage(lastUserMsg),
          ]);
          return fallbackRes.content.toString().replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
        }
      } catch (innerErr) {
        console.error("Vector fallback error:", innerErr.message);
      }
    }
    throw err;
  }
}

export async function genratechattitle(message) {
  const response = await groqmodel.invoke([
    new SystemMessage(`
      Generate a concise and descriptive title for the conversation.

      Rules:
      - Return ONLY the title.
      - Use 2-4 words.
      - Do not explain anything.
      - Do not include reasoning.
      - Do not include <think> tags.
    `),
    new HumanMessage(`Generate a title based on this first message: "${message}"`),
  ]);

  let title = response.content.toString();
  title = title.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  return title;
}
