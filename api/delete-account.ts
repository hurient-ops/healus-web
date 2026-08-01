import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS 처리
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Server configuration error (Missing Supabase Keys)' });
  }

  // Create admin client with Service Role Key
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // 1. 넘어온 JWT 토큰으로 현재 요청한 사용자 식별
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token or user not found' });
    }

    const userId = user.id;

    // 2. public.users 테이블의 정보를 익명화 처리 (이름, 연락처 등 삭제)
    // - 건강 기록 데이터(pump_logs 등)는 user_id로 연결되어 있으므로 남겨둠
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        name: null,
        email: `deleted_${userId}@deleted.com`,
        phone_number: null,
        birth_date: null
      })
      .eq('id', userId);

    if (updateError) {
      console.error("Error anonymizing user:", updateError);
      return res.status(500).json({ error: 'Failed to anonymize user data' });
    }

    // 3. Supabase Auth에서 사용자 계정 영구 삭제
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (deleteError) {
      console.error("Error deleting auth user:", deleteError);
      return res.status(500).json({ error: 'Failed to delete auth user' });
    }

    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error: any) {
    console.error("Delete account error:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
