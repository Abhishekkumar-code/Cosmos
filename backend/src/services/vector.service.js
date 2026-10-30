import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
import { CloudClient } from "chromadb";
import { GoogleGeminiEmbeddingFunction } from "@chroma-core/google-gemini";
import { config } from "../config/config.js";

const client = new CloudClient({
  apiKey: config.CHROMA_KEY,
  tenant: config.CHROMA_TENANT,
  database: config.CHROMA_DATABASE,
});

const embedder = new GoogleGeminiEmbeddingFunction({
  apiKey: config.GEMINI_API_KEY,
  modelName: "gemini-embedding-001",
});

function collectionName(chatId) {
  return `chat_${chatId}`;
}

export async function getOrCreateCollection(chatId) {
  return client.getOrCreateCollection({
    name: collectionName(chatId),
    embeddingFunction: embedder,
  });
}

export async function addChunksToVectorStore(chatId, chunks, sourceName) {
  const collection = await getOrCreateCollection(chatId);

  const ids = chunks.map((_, i) => `${sourceName}_${Date.now()}_${i}`);
  const metadatas = chunks.map((_, i) => ({
    source: sourceName,
    chunkIndex: i,
  }));

  await collection.add({ ids, documents: chunks, metadatas });
  return { added: chunks.length };
}

export async function queryVectorStore(chatId, query, k = 8) {
  const collection = await getOrCreateCollection(chatId);
  const count = await collection.count();
  if (count === 0) return [];

  if (count <= 15) {
    const all = await collection.get();
    const docs = all.documents || [];
    const metas = all.metadatas || [];
    return docs
      .map((text, i) => ({
        text,
        source: metas[i]?.source,
        chunkIndex: metas[i]?.chunkIndex ?? i,
      }))
      .sort((a, b) => a.chunkIndex - b.chunkIndex)
      .filter((d) => d.text && d.text.trim().length > 0);
  }

  const nResults = Math.min(count, Math.max(k, 8));
  const results = await collection.query({
    queryTexts: [query],
    nResults,
  });

  const docs = results.documents?.[0] || [];
  const metas = results.metadatas?.[0] || [];

  return docs
    .map((text, i) => ({ text, source: metas[i]?.source }))
    .filter((d) => d.text && d.text.trim().length > 0);
}

export async function deleteChatCollection(chatId) {
  try {
    await client.deleteCollection({ name: collectionName(chatId) });
  } catch {}
}
