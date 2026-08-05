import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!GROQ_API_KEY) {
    return res.status(200).json({ reply: '시스템 설정 오류: AI API 키(GROQ_API_KEY)가 등록되지 않았습니다.' });
  }

  const groq = new Groq({ apiKey: GROQ_API_KEY });

  try {
    const { message, history, contextData } = req.body;
    
    // Construct conversation history for the LLM
    const messages: any[] = [];
    
    let systemPrompt = '당신은 Healus의 AI 주치의입니다. 친절하고 전문적으로 사용자의 당뇨 관리와 혈당 관련 질문에 답변해 주세요. 대답은 한국어로 짧고 명확하게 작성해 주세요. 불필요한 인사는 생략하세요.';
    if (contextData) {
      systemPrompt += `\n\n현재 사용자의 건강 데이터 요약입니다:\n${contextData}\n이 데이터를 바탕으로 사용자의 질문에 정확한 수치로 답변하세요. 데이터에 없는 내용은 임의로 지어내지 마세요.`;
    }

    // System prompt
    messages.push({
      role: 'system',
      content: systemPrompt
    });

    // Add previous history
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        messages.push({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text });
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: message
    });

    const modelsToTry = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'mixtral-8x7b-32768'
    ];

    let reply = null;
    let errorText = "";

    for (const model of modelsToTry) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: messages,
          model: model,
          temperature: 0.5,
          max_tokens: 1024,
        });
        reply = chatCompletion.choices[0]?.message?.content;
        if (reply) break;
      } catch (err: any) {
        console.error(`Groq Model Error (${model}):`, err.message);
        errorText = err.message;
      }
    }

    if (!reply) {
      return res.status(200).json({ reply: `죄송합니다, AI 모델 응답을 생성하지 못했습니다. (${errorText})` });
    }

    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error('Groq API Error:', error);
    return res.status(200).json({ reply: `오류가 발생했습니다: ${error.message || 'Internal Server Error'}` });
  }
}
