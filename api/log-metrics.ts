import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
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

    const { type, value, tag } = req.body;

    if (type === 'bg') {
      const { error } = await supabase
        .from('blood_glucose_logs')
        .insert({
          user_id: user.id,
          glucose_value: value,
          tag: tag,
          recorded_at: new Date().toISOString()
        });

      if (error) throw error;

    } else if (type === 'sleep' || type === 'stress') {
      // 가장 최근 pump_logs를 찾아서 업데이트 (오늘 날짜의 로그)
      const { data: latestLogs, error: fetchError } = await supabase
        .from('pump_logs')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      if (latestLogs && latestLogs.length > 0) {
        const updateData: any = {};
        if (type === 'sleep') updateData.sleep_hours = value;
        if (type === 'stress') updateData.stress_level = value;

        const { error: updateError } = await supabase
          .from('pump_logs')
          .update(updateData)
          .eq('id', latestLogs[0].id);

        if (updateError) throw updateError;
      }
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    return res.status(200).json({ status: "success", message: "기록이 저장되었습니다." });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
