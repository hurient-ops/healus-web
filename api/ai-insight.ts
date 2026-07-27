import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }
    const token = authHeader.split(' ')[1];

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // 최근 7일 치 펌프 로그 조회
    const { data: logs, error: pumpError } = await supabase
      .from('pump_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(7);

    if (pumpError || !logs || logs.length === 0) {
      return res.status(200).json({
        status: "success",
        insight: "아직 충분한 데이터가 수집되지 않았습니다. 매일 데이터를 꾸준히 기록해주세요.",
        reasoning: [],
        model: "llama-3.3-70b-versatile",
        prompt_used: ""
      });
    }

    const reversedLogs = [...logs].reverse();

    const recent_logs_text = reversedLogs.map(log => {
      let text = `- ${log.month}/${log.day}: 식사 주입(Bolus) ${log.eat_total}U, 수면 ${log.sleep_hours}h, 스트레스 ${log.stress_level}/10, 운동 ${log.exercise_hours}h, 평균혈당 ${log.avg_cgm}mg/dL`;
      if (log.event_tags) {
        text += `, 이벤트 [${log.event_tags}]`;
      }
      return text;
    }).join("\n");

    const prompt = `당신은 당뇨병 환자의 라이프로그(Lifelog) 데이터를 분석하는 전문 AI 주치의입니다.
아래는 최근 7일간의 심층 데이터입니다 (인슐린 주입량, 수면, 스트레스, 운동, 이벤트 태그, 연속혈당(CGM) 평균치).

환자 데이터 요약 (최근 7일):
${recent_logs_text}

지시사항:
1. 위 데이터를 종합적으로 분석하여 회식, 수면 부족, 스트레스, 운동 등이 혈당과 인슐린 요구량에 미친 영향을 '추론(Reasoning)' 과정을 포함하여 상세히 분석해 주세요.
2. 결과는 JSON 형식으로 반환해야 합니다.
3. JSON 스키마는 다음과 같아야 합니다:
{
    "reasoning_process": ["첫 번째 추론 단계", "두 번째 추론 단계", ...],
    "insight": "환자를 위한 따뜻하고 전문적인 최종 조언 (3줄 이내)"
}
절대 마크다운(\`\`\`json) 텍스트 블록으로 감싸지 말고 순수 JSON 문자열만 출력하세요.`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a helpful, professional medical AI assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.statusText}`);
    }

    const groqData = await groqResponse.json();
    let ai_response = groqData.choices[0].message.content;

    // Remove markdown formatting if present
    if (ai_response.startsWith("```")) {
      const parts = ai_response.split("```");
      if (parts.length > 1) {
        ai_response = parts[1];
        if (ai_response.startsWith("json\n")) {
          ai_response = ai_response.substring(5);
        }
      }
    }

    let parsed_json;
    try {
      parsed_json = JSON.parse(ai_response);
    } catch (e) {
      parsed_json = {
        reasoning_process: ["AI 응답 파싱 중 오류가 발생했습니다.", ai_response],
        insight: "분석 결과를 불러오는 중 문제가 발생했습니다."
      };
    }

    return res.status(200).json({
      status: "success",
      insight: parsed_json.insight || "",
      reasoning: parsed_json.reasoning_process || [],
      model: "llama-3.3-70b-versatile",
      prompt_used: prompt
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
