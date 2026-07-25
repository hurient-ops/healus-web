import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

// Initialize Groq client with the API key from environment variables
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;
    
    // Construct conversation history for the LLM
    const messages = [];
    
    // System prompt
    messages.push({
      role: 'system',
      content: '당신은 Healus의 AI 주치의입니다. 친절하고 전문적으로 사용자의 당뇨 관리와 혈당 관련 질문에 답변해 주세요. 대답은 한국어로 짧고 명확하게 작성해 주세요.'
    });

    // Add previous history
    if (history && Array.isArray(history)) {
      history.forEach((msg) => {
        messages.push({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text });
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: message
    });

    // Call Groq API using Llama 3.3
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 1024,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "죄송합니다, 답변을 생성하지 못했습니다.";

    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error('Groq API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
