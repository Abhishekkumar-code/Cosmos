import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function extractTextFromPdf(buffer) {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
}

export async function chunkText(text, chunkSize = 800, chunkOverlap = 100) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });
  const chunks = await splitter.splitText(text);
  return chunks
    .map((c) => c.trim())
    .filter((c) => c.length > 15 && !/^--\s*\d+\s*of\s*\d+\s*--$/i.test(c));
}
