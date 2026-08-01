import { Link, useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Footer() {
  const location = useLocation();
  const currentPath = location.pathname;

  const linkClass = (path: string) => {
    return currentPath === path
      ? "text-[#17409c] font-bold transition-colors"
      : "hover:text-[#17409c] transition-colors";
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-[#17409c] transition-colors">
            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight font-serif text-gray-500">HealUs</span>
          </Link>
          
          <nav className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium text-gray-600">
            <Link to="/terms" className={linkClass('/terms')}>이용약관</Link>
            <Link to="/privacy" className={linkClass('/privacy')}>개인정보처리방침</Link>
            <Link to="/faq" className={linkClass('/faq')}>자주 묻는 질문(FAQ)</Link>
            <Link to="/support" className={linkClass('/support')}>고객센터</Link>
          </nav>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-sm text-gray-500">
            <p className="mb-1">㈜힐어스 | 대표: 김당뇨 | 사업자등록번호: 123-45-67890</p>
            <p>서울특별시 강남구 테헤란로 123, 힐어스빌딩 4층</p>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} HealUs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
