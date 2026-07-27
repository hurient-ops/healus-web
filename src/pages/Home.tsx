import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Brain, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import Header from '../components/Header';

const slides = [
  {
    image: "/images/hero_home_1.jpg",
    title: "스마트 당뇨 관리 솔루션",
    heading: <>나만의 혈당 리듬,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Healus</span>와 함께 완벽하게.</>,
    desc: "인슐린 펌프 데이터와 AI 통찰력이 만나, 당신의 하루를 더 안전하고 자유롭게 만듭니다. 지금 바로 과학적인 혈당 관리를 시작하세요."
  },
  {
    image: "/images/hero_home_2.jpg",
    title: "100% 데이터 분석",
    heading: <>모든 라이프로그를,<br/>하나의 <span className="text-blue-400">대시보드</span>에서.</>,
    desc: "혈당 수치(CGM), 식사량, 수면 시간, 스트레스, 운동 기록까지. 흩어져 있던 당신의 모든 생체 데이터를 Healus가 하나로 모아 분석합니다."
  },
  {
    image: "/images/hero_home_3.jpg",
    title: "초개인화 AI 주치의",
    heading: <>분석 과정을 <span className="text-emerald-400">투명하게</span>,<br/>결과는 더 정확하게.</>,
    desc: "주말 회식 패턴, 수면 부족에 따른 인슐린 저항성 증가 등 숨겨진 원인을 인공지능이 찾아내고, 추론 과정을 투명하게 시각화하여 제공합니다."
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5초마다 자동 슬라이드
    
    // 로그인 상태 확인
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col font-sans">
      
      {/* Global Header */}
      <Header />

      {/* Hero Section (Carousel) */}
      <section className="relative w-full h-[850px] flex items-center bg-gray-900 overflow-hidden group">
        
        {/* Carousel Backgrounds */}
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={slide.image} alt="배경 이미지" className="w-full h-full object-cover" />
            <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
          </div>
        ))}
        
        {/* Navigation Arrows */}
        <button onClick={prevSlide} className="absolute left-6 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button onClick={nextSlide} className="absolute right-6 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all">
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all rounded-full ${index === currentSlide ? 'w-8 h-2 bg-blue-500' : 'w-2 h-2 bg-white/50 hover:bg-white'}`}
            />
          ))}
        </div>
        
        {/* Carousel Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-16 w-full flex items-center">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={`absolute top-1/2 -translate-y-1/2 w-full max-w-2xl transition-all duration-700 ease-in-out transform ${
                index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'
              }`}
            >
              <span className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 font-bold tracking-widest rounded-full mb-6 border border-blue-500/30 backdrop-blur-sm shadow-lg">
                {slide.title}
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.2] mb-6 tracking-tight drop-shadow-lg break-keep">
                {slide.heading}
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed font-light drop-shadow-md break-keep">
                {slide.desc}
              </p>
              <Link to={isLoggedIn ? "/dashboard" : "/login"} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#17409c] font-bold rounded-full hover:bg-gray-100 transition-all shadow-2xl hover:scale-105">
                나만의 당뇨관리 <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Section 1: AI Insight */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4"></div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="w-full md:w-1/2">
            <img src="/images/ai_doctor_v2.jpg" alt="AI 주치의" className="w-full aspect-square object-cover rounded-[2rem] shadow-2xl hover:scale-[1.02] transition-transform duration-500" />
          </div>
          <div className="w-full md:w-1/2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <Brain className="w-8 h-8 text-[#17409c]" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight font-serif">24시간 나와 함께하는<br />초개인화 AI 주치의</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              단순히 수치만 보여주지 않습니다. Healus의 인공지능은 100일간의 식사, 수면, 운동 데이터를 입체적으로 분석하여 주말의 과식 패턴이나 운동 부족 여부를 스스로 찾아냅니다. 
              그리고 <strong>'어떻게 이런 결론이 나왔는지'</strong> 추론 과정을 명확히 보여주어 100% 신뢰할 수 있습니다.
            </p>
            <Link to="/sample-dashboard" className="text-[#17409c] font-bold flex items-center gap-1 hover:gap-2 transition-all text-lg">
              Healus AI 대시보드 체험하기 <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section 2: Seamless Data Integration */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/4"></div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-16 relative z-10">
          <div className="w-full md:w-1/2">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <Activity className="w-8 h-8 text-[#1cb085]" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight font-serif">흩어진 나의 건강 기록,<br />단 하나의 플랫폼으로</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              연속혈당측정기(CGM)의 실시간 혈당 수치와 인슐린 펌프의 주입량은 물론, 수면, 스트레스, 식단 기록까지. 
              <strong>모든 라이프로그를 Healus 한 곳에 모아</strong> 직관적인 차트와 트렌드로 한눈에 파악하세요. 복잡한 연동 과정 없이 내 몸의 변화를 가장 정확하게 추적할 수 있습니다.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <img src="/images/platform.jpg" alt="플랫폼" className="w-full aspect-square object-cover rounded-[2rem] shadow-2xl hover:scale-[1.02] transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* Non-member Services Grid */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight font-serif">당뇨 관리를 위한 완벽 가이드</h2>
            <p className="text-lg text-gray-500">Healus가 제공하는 4가지 전문 의학 콘텐츠를 만나보세요.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <Link to="/diabetes" className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#17409c] transition-colors shadow-sm">
                <Activity className="w-7 h-7 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#17409c] transition-colors">당뇨병의 이해</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                1형, 2형, 임신 당뇨 등 자신의 유형에 맞는 정확한 관리법을 확인하세요.
              </p>
            </Link>

            <Link to="/diet" className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1cb085] transition-colors shadow-sm">
                <span className="text-3xl group-hover:scale-110 transition-transform">🥗</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#1cb085] transition-colors">올바른 식단 관리</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                혈당 스파이크를 막는 거꾸로 식사법과 필수 영양소 조합을 알려드립니다.
              </p>
            </Link>

            <Link to="/pump-guide" className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors shadow-sm">
                <span className="text-3xl group-hover:scale-110 transition-transform">💉</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">인슐린 펌프 가이드</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                기초 및 식사 주입량의 개념과 기기 알람 대처법을 완벽히 숙지하세요.
              </p>
            </Link>

            <Link to="/complications" className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-500 transition-colors shadow-sm">
                <ShieldCheck className="w-7 h-7 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">합병증 예방 가이드</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                망막병증, 신증, 당뇨발 등 무서운 합병증을 막는 필수 검진 수칙입니다.
              </p>
            </Link>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between border-b border-gray-800 pb-10 mb-10">
          <div className="mb-6 md:mb-0">
            <span className="text-3xl font-bold text-white tracking-tight">Healus</span>
            <p className="text-gray-400 mt-2 text-sm max-w-sm">
              우리는 인공지능과 데이터 분석을 통해 모든 당뇨인들이 합병증의 두려움 없이 안전하고 자유로운 삶을 누릴 수 있도록 돕습니다.
            </p>
          </div>
          <div className="flex gap-12 text-sm text-gray-400">
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-bold mb-1">Company</h4>
              <a href="#" className="hover:text-white transition-colors">Healus 소개</a>
              <a href="#" className="hover:text-white transition-colors">블로그</a>
              <a href="#" className="hover:text-white transition-colors">채용안내</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-bold mb-1">Legal</h4>
              <a href="#" className="hover:text-white transition-colors">이용약관</a>
              <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-bold mb-1">Support</h4>
              <a href="#" className="hover:text-white transition-colors">고객센터</a>
              <a href="#" className="hover:text-white transition-colors">FAQ</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 text-xs font-mono">
          © 2026 Healus Inc. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
