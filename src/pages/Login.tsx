import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Lock, Mail, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.redirect || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          throw new Error('이메일 인증이 완료되지 않았습니다. 가입하신 이메일함에서 인증 링크를 먼저 클릭해주세요!');
        }
        throw error;
      }

      if (data.session && data.user) {
        // 기존 코드 호환성을 위해 localStorage에도 임시 저장 (추후 전역 상태나 Context API로 변경 권장)
        localStorage.setItem('access_token', data.session.access_token);
        
        // users 테이블에서 추가 정보 가져오기
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          localStorage.setItem('user', JSON.stringify({ email: data.user.email, id: data.user.id }));
        }
        
        localStorage.setItem('isLoggedIn', 'true');
        navigate(redirectPath);
      }
    } catch (error: any) {
      setErrorMsg(error.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-6 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[var(--color-secondary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-2xl bg-white relative z-10">
        
        {/* Left Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative bg-[var(--color-primary)]">
          <img 
            src="/images/hero.png" 
            alt="건강한 라이프스타일" 
            className="w-full h-full object-cover opacity-80 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/80 to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="text-4xl font-bold font-serif mb-4 leading-tight">건강한 내일을 위한<br />오늘의 기록</h2>
            <p className="text-[var(--color-secondary-light)] text-lg">HealUs AI 주치의와 함께 당신의 혈당 리듬을 완벽하게 관리하세요.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-12 md:p-16 flex flex-col justify-center">
          
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 text-[#17409c] hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-[#17409c] rounded-xl flex items-center justify-center shadow-sm">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold tracking-tight font-serif">HealUs</span>
            </Link>
            <h2 className="text-2xl font-bold mb-2">다시 오신 것을 환영합니다!</h2>
            <p className="text-[var(--color-text-muted)]">서비스 이용을 위해 로그인해 주세요. <br/><span className="text-blue-500 font-medium">(테스트용 계정: testuser@healus.com / password123)</span></p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                {errorMsg}
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-[var(--color-text)] mb-2">이메일</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                  placeholder="name@healus.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--color-text)] mb-2">비밀번호</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-[var(--color-primary)] rounded border-gray-300 focus:ring-[var(--color-primary)]" />
                <span className="text-[var(--color-text-muted)]">로그인 유지</span>
              </label>
              <a href="#" className="font-bold text-[var(--color-primary)] hover:underline">비밀번호 찾기</a>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary-light)] transform active:scale-[0.98] transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
            아직 계정이 없으신가요? <Link to="/signup" className="font-bold text-[var(--color-primary)] hover:underline">회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
