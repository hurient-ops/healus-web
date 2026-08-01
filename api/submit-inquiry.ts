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

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Server configuration error (Missing Supabase Keys)' });
  }

  const { email, title, content } = req.body;
  if (!email || !title || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create admin client with Service Role Key
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Extract user ID from token if provided
  let userId = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    if (user) {
      userId = user.id;
    }
  }

  try {
    const { error: insertError } = await supabaseAdmin
      .from('inquiries')
      .insert([
        {
          user_id: userId,
          email,
          title,
          content
        }
      ]);

    if (insertError) {
      console.error("Error inserting inquiry:", insertError);
      return res.status(500).json({ error: 'Failed to submit inquiry' });
    }

    return res.status(200).json({ message: 'Inquiry submitted successfully' });
  } catch (error: any) {
    console.error("Submit inquiry error:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
