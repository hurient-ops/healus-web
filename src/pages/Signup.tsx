
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, Smartphone, Activity } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 z-0">
         <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-10 mix-blend-overlay" />
      </div>

      <div className="w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-2xl bg-white relative z-10 border border-gray-100">
        
        {/* Left Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative bg-[#17409c]">
          <img 
            src="https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=1000&auto=format&fit=crop" 
            alt="건강한 라이프스타일" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17409c]/90 to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="text-4xl font-bold font-serif mb-4 leading-tight">나만의 혈당 리듬,<br />지금부터 시작하세요</h2>
            <p className="text-blue-200 text-lg font-light">Healus와 인슐린 펌프를 연동하여 스마트한 관리를 시작하세요.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-12 md:p-16 flex flex-col justify-center max-h-[90vh] overflow-y-auto custom-scrollbar">
          
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 text-[#17409c] hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-[#17409c] rounded-xl flex items-center justify-center shadow-sm">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold tracking-tight font-serif">Healus</span>
            </Link>
            <h2 className="text-3xl font-bold mb-2 font-serif text-gray-900">회원가입</h2>
            <p className="text-gray-500">Healus 서비스 이용을 위해 계정을 생성해 주세요.</p>
          </div>



          <form onSubmit={(e) => { e.preventDefault(); navigate('/login'); }} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">이름</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#17409c] focus:ring-1 focus:ring-[#17409c] transition-all"
                  placeholder="홍길동"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">이메일</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#17409c] focus:ring-1 focus:ring-[#17409c] transition-all"
                  placeholder="name@healus.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">비밀번호</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#17409c] focus:ring-1 focus:ring-[#17409c] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                 <Smartphone className="w-4 h-4 text-[#17409c]"/> Healus 인슐린 펌프 기기 연동
              </label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#17409c] focus:ring-1 focus:ring-[#17409c] transition-all text-gray-700 font-medium placeholder-gray-400"
                placeholder="기기 뒷면의 S/N 또는 MAC 주소 입력 (예: 00:1A:2B:3C:4D:5E)"
              />
              <p className="text-xs text-gray-400 mt-2 ml-1 whitespace-nowrap tracking-tighter">* Healus 펌프의 기기 고유 번호를 입력하시면 가입 후 즉시 연동됩니다.</p>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-[#17409c] text-white font-bold rounded-xl hover:bg-blue-800 transform active:scale-[0.98] transition-all shadow-lg mt-6"
            >
              계정 만들기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
