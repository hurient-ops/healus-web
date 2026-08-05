import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 처리
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

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

    // 100일 치 펌프 로그 조회
    const { data: pumpLogs, error: pumpError } = await supabase
      .from('pump_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(100);

    if (pumpError) {
      console.error("Pump DB Error:", pumpError);
    }

    // 최신 혈당 기록 20개 조회
    const { data: bgLogs, error: bgError } = await supabase
      .from('blood_glucose_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false })
      .limit(20);

    if (bgError) {
      console.error("BG DB Error:", bgError);
    }

    // 역순(과거->최신) 정렬 필요 (차트에 렌더링하기 위함)
    const reversedPumpLogs = pumpLogs ? [...pumpLogs].reverse() : [];
    
    const processed_pump_logs = reversedPumpLogs.map(log => {
      let m = log.month;
      let d = log.day;
      
      // month, day가 null이거나 없으면 created_at 혹은 recorded_at(있다면) 기반으로 추출
      if (!m || !d) {
        if (log.created_at) {
          const dt = new Date(log.created_at);
          // 한국 시간(KST, UTC+9) 기준으로 날짜를 맞추는 것이 더 정확할 수 있으나, 
          // 기본적인 로컬 시간(서버 기준) 혹은 명시적으로 KST 적용
          dt.setHours(dt.getHours() + 9);
          m = dt.getUTCMonth() + 1;
          d = dt.getUTCDate();
        }
      }
      
      return {
        date: `${m}/${d}`,
        basal: log.base_total,
        bolus: log.eat_total,
      append: log.append_total,
      avg_cgm: log.avg_cgm,
      sleep_hours: log.sleep_hours,
      stress_level: log.stress_level,
      exercise_hours: log.exercise_hours,
      reception_hours: log.reception_hours,
      event_tags: log.event_tags,
      notes: log.notes,
      error_count: log.error_count,
      error_types: log.error_types
      };
    });

    const userName = user.user_metadata?.name || user.email?.split('@')[0] || "사용자";

    // Fetch custom user data to get pump status
    const { data: customUser, error: customUserError } = await supabase
      .from('users')
      .select('pump_battery_level, pump_insulin_remaining')
      .eq('id', user.id)
      .maybeSingle();

    if (customUserError) {
      console.error("User DB Error:", customUserError);
    }

    return res.status(200).json({
      status: "success",
      data: {
        user_name: userName,
        pump_battery_level: customUser?.pump_battery_level,
        pump_insulin_remaining: customUser?.pump_insulin_remaining,
        pump_logs: processed_pump_logs,
        bg_logs: bgLogs ? bgLogs.map(bg => ({
          value: bg.glucose_value,
          tag: bg.tag,
          time: bg.recorded_at
        })) : []
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
