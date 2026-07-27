import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-[#17409c] hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-[#17409c] rounded-xl flex items-center justify-center shadow-sm">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight font-serif">Healus</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 font-normal text-gray-600">
          <Link to="/diabetes" className={`${isActive('/diabetes') ? 'text-[#17409c] font-bold' : 'hover:text-[#17409c]'} transition-colors`}>당뇨병의 이해</Link>
          <Link to="/diet" className={`${isActive('/diet') ? 'text-[#1cb085] font-bold' : 'hover:text-[#1cb085]'} transition-colors`}>식단 관리</Link>
          <Link to="/pump-guide" className={`${isActive('/pump-guide') ? 'text-orange-600 font-bold' : 'hover:text-orange-600'} transition-colors`}>펌프 가이드</Link>
          <Link to="/complications" className={`${isActive('/complications') ? 'text-red-600 font-bold' : 'hover:text-red-600'} transition-colors`}>합병증 예방</Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-gray-700 font-medium hover:text-[#17409c] transition-colors flex items-center">
                <span className="font-bold text-[#17409c]">{user?.name || user?.email || '회원'}</span>님
              </Link>
              <button 
                onClick={handleLogout} 
                className="px-3 py-1.5 md:px-6 md:py-2 text-sm md:text-base rounded-full border border-gray-300 bg-white text-gray-700 font-normal hover:border-red-500 hover:text-red-500 transition-all shadow-sm whitespace-nowrap"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="px-3 py-1.5 md:px-6 md:py-2 text-sm md:text-base rounded-full border border-gray-300 bg-white text-gray-700 font-normal hover:border-[#17409c] hover:text-[#17409c] transition-all shadow-sm whitespace-nowrap">
                회원가입
              </Link>
              <Link to="/login" className="px-3 py-1.5 md:px-6 md:py-2 text-sm md:text-base rounded-full border border-gray-300 bg-white text-gray-700 font-normal hover:border-[#17409c] hover:text-[#17409c] transition-all shadow-sm whitespace-nowrap">
                로그인
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
