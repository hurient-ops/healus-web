import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Smartphone, Activity, Calendar, Phone, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Signup() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    phone_number: '',
    email: '',
    password: '',
    pump_id: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    setErrorMsg('');

    try {
      if (formData.pump_id.length !== 16) {
        throw new Error("기기 PID(Pump ID)는 반드시 16자리 문자여야 합니다.");
      }

      // 1. Supabase Auth 계정 생성
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password.trim(),
      });

      if (authError) throw authError;

      // 2. public.users 테이블에 추가 정보 저장
      if (authData.user) {
        const { error: dbError } = await supabase.from('users').insert([
          {
            id: authData.user.id,
            email: formData.email,
            name: formData.name,
            birth_date: formData.birth_date,
            phone_number: formData.phone_number,
            pump_id: formData.pump_id,
            terms_agreed: true
          }
        ]);

        if (dbError) {
          console.error("DB Insert Error:", dbError);
          throw new Error("사용자 정보를 저장하는데 실패했습니다.");
        }
      }

      // 성공 시 로그인 페이지로
      alert("회원가입이 접수되었습니다! 안전한 사용을 위해 이메일함으로 보내드린 인증 링크를 꼭 먼저 클릭하신 후 로그인해주세요.");
      navigate('/login');
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 z-0">
         <img src="/images/signup_1.jpg" className="w-full h-full object-cover opacity-10 mix-blend-overlay" />
      </div>

      <div className="w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-2xl bg-white relative z-10 border border-gray-100">
        
        {/* Left Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative bg-[#17409c]">
          <img
            src="/images/signup_2.jpg"  
            alt="건강한 라이프스타일" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17409c]/90 to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="text-4xl font-bold font-serif mb-4 leading-tight">나만의 혈당 리듬,<br />지금부터 시작하세요</h2>
            <p className="text-blue-200 text-lg font-light">HealUs와 인슐린 펌프를 연동하여 스마트한 관리를 시작하세요.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-12 md:p-16 flex flex-col justify-center max-h-[90vh] overflow-y-auto custom-scrollbar">
          
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 text-[#17409c] hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-[#17409c] rounded-xl flex items-center justify-center shadow-sm">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold tracking-tight font-serif">HealUs</span>
            </Link>
            <h2 className="text-3xl font-bold mb-2 font-serif text-gray-900">회원가입</h2>
            <p className="text-gray-500">HealUs 서비스 이용을 위해 계정을 생성해 주세요.</p>
          </div>



          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                {errorMsg}
              </div>
            )}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-bold text-gray-700 mb-2">이름 *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#17409c] focus:ring-1 focus:ring-[#17409c] transition-all"
                    placeholder="홍길동"
                  />
                </div>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-bold text-gray-700 mb-2">생년월일 *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <input 
                    type="date" 
                    name="birth_date"
                    required
                    value={formData.birth_date}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#17409c] focus:ring-1 focus:ring-[#17409c] transition-all text-gray-700"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-bold text-gray-700 mb-2">핸드폰 번호 *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input 
                    type="tel" 
                    name="phone_number"
                    required
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#17409c] focus:ring-1 focus:ring-[#17409c] transition-all"
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-bold text-gray-700 mb-2">이메일 *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#17409c] focus:ring-1 focus:ring-[#17409c] transition-all"
                    placeholder="name@healus.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">비밀번호 *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#17409c] focus:ring-1 focus:ring-[#17409c] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                 <Smartphone className="w-4 h-4 text-[#17409c]"/> 기기 PID (Pump ID) *
              </label>
              <input 
                type="text" 
                name="pump_id"
                required
                maxLength={16}
                minLength={16}
                value={formData.pump_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#17409c] focus:ring-1 focus:ring-[#17409c] transition-all text-gray-700 font-medium placeholder-gray-400"
                placeholder="16자리 문자(예: 1234567890ABCDEF)"
              />
              <p className="text-xs text-gray-500 mt-2 ml-1 leading-relaxed break-keep">
                * 모바일 앱에서 전송된 데이터를 확인하기 위해 펌프의 고유 식별자를 반드시 입력해 주세요.<br/>
                (모바일 앱 로그인 시 해당 PID와 계정이 안전하게 연동됩니다.)
              </p>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input 
                    type="checkbox" 
                    className="peer sr-only"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-[#17409c] peer-checked:border-[#17409c] transition-colors"></div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm text-gray-700 leading-snug">
                  <span className="font-bold text-[#17409c]">[필수]</span> 개인정보 및 민감정보(건강정보) 수집 및 이용에 동의합니다.
                </span>
              </label>
            </div>

            <button 
              type="submit"
              disabled={!agreed || loading}
              className={`w-full py-4 font-bold rounded-xl transform transition-all shadow-lg mt-6 ${
                agreed && !loading
                  ? "bg-[#17409c] text-white hover:bg-blue-800 active:scale-[0.98]" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              }`}
            >
              {loading ? "계정 생성 중..." : "계정 만들기"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
