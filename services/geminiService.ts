import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Ensure API Key is available
const apiKey = process.env.API_KEY || '';

// Initialize client
// Note: In a real production app, we might handle key rotation or user-provided keys differently.
const ai = new GoogleGenAI({ apiKey });

export const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Creates a new chat session with the provided system instruction (knowledge base).
 */
export const createChatSession = (knowledgeBase: string): Chat => {
  const systemInstruction = `
Bạn là một trợ lý AI thông minh và hữu ích.
Nhiệm vụ của bạn là hỗ trợ người dùng dựa trên thông tin được cung cấp trong phần KIẾN THỨC NỀN TẢNG dưới đây.

QUY TẮC QUAN TRỌNG:
1. Chỉ trả lời dựa trên thông tin trong KIẾN THỨC NỀN TẢNG nếu có liên quan.
2. Nếu thông tin không có trong kiến thức nền tảng, hãy sử dụng kiến thức chung của bạn nhưng hãy ưu tiên kiến thức được cung cấp.
3. Trả lời bằng tiếng Việt, giọng điệu chuyên nghiệp, thân thiện.

---
KIẾN THỨC NỀN TẢNG:
${knowledgeBase || '(Chưa có dữ liệu kiến thức nào được tải lên. Hãy trả lời như một trợ lý chung.)'}
---
  `;

  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: systemInstruction.trim(),
      temperature: 0.7,
      maxOutputTokens: 2000,
    },
  });
};

/**
 * Sends a message to the chat session and returns a stream.
 */
export const sendMessageStream = async (
  chat: Chat,
  message: string
): Promise<AsyncIterable<GenerateContentResponse>> => {
  return await chat.sendMessageStream({ message });
};