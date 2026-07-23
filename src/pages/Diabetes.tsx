import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Activity, Info, ShieldCheck } from 'lucide-react';

export default function Diabetes() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      
      {/* Global Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#17409c] hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-[#17409c] rounded-xl flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight font-serif">Healus</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 font-normal text-gray-600">
            <Link to="/diabetes" className="hover:text-[#17409c] transition-colors">당뇨병의 이해</Link>
            <Link to="/diet" className="hover:text-[#1cb085] transition-colors">식단 관리</Link>
            <Link to="/pump-guide" className="hover:text-orange-600 transition-colors">펌프 가이드</Link>
            <Link to="/complications" className="hover:text-red-600 transition-colors">합병증 예방</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/signup" className="px-6 py-2 rounded-full border border-gray-300 bg-white text-gray-700 font-normal hover:border-[#17409c] hover:text-[#17409c] transition-all shadow-sm">
              회원가입
            </Link>
            <Link to="/login" className="px-6 py-2 rounded-full border border-gray-300 bg-white text-gray-700 font-normal hover:border-[#17409c] hover:text-[#17409c] transition-all shadow-sm">
              로그인
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=2000&auto=format&fit=crop" 
          alt="혈당 측정하는 모습" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-[#17409c]/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#17409c]/30">
            <Activity className="w-8 h-8 text-blue-300" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight font-serif">당뇨병, 제대로 이해하기</h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed">
            지피지기면 백전백승. 1형, 2형, 임신 당뇨의 차이점부터 발생 원인까지, 막연한 두려움을 넘어 올바른 관리를 시작하는 첫걸음을 안내합니다.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#17409c] transition-colors font-bold">
            <ArrowLeft className="w-5 h-5" /> 메인으로 돌아가기
          </Link>
        </div>

        {/* Article 1 */}
        <article className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-12 flex flex-col justify-center">
              <span className="text-[#17409c] font-bold tracking-widest text-sm mb-4">TYPE 1 DIABETES</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">1형 당뇨병 (제1형 당뇨)</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                주로 소아나 청소년기에 발병하여 '소아 당뇨'로 불리기도 했으나, 성인에게도 발병할 수 있습니다. 췌장의 베타세포가 자가면역 반응 등으로 파괴되어 인슐린이 전혀 분비되지 않는 상태를 말합니다.
              </p>
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-[#17409c] mb-2 flex items-center gap-2"><Info className="w-5 h-5"/> 핵심 관리법</h4>
                <p className="text-gray-700 text-sm leading-relaxed">평생 외부에서 인슐린을 공급받아야 하므로, 인슐린 주사나 인슐린 펌프 사용이 필수적입니다. 탄수화물 계량과 인슐린 용량 조절 교육이 매우 중요합니다.</p>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop" alt="인슐린 펌프" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </article>

        {/* Article 2 */}
        <article className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-auto order-2 md:order-1">
              <img src="https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=1000&auto=format&fit=crop" alt="성인 당뇨" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="p-12 flex flex-col justify-center order-1 md:order-2">
              <span className="text-[#1cb085] font-bold tracking-widest text-sm mb-4">TYPE 2 DIABETES</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">2형 당뇨병 (제2형 당뇨)</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                전체 당뇨병의 90% 이상을 차지합니다. 인슐린은 분비되지만 그 기능이 떨어지는 '인슐린 저항성'이 특징입니다. 유전적 요인 외에도 비만, 서구화된 식습관, 스트레스, 운동 부족 등 환경적 요인이 크게 작용합니다.
              </p>
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <h4 className="font-bold text-[#1cb085] mb-2 flex items-center gap-2"><Activity className="w-5 h-5"/> 핵심 관리법</h4>
                <p className="text-gray-700 text-sm leading-relaxed">식이요법과 규칙적인 운동을 통한 체중 감량이 최우선입니다. 경구용 혈당강하제로 조절하며, 병이 진행되면 인슐린 주사가 필요할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </article>

        {/* Grid of extra info */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck className="w-24 h-24 text-[#17409c]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">임신 당뇨병</h3>
            <p className="text-gray-600 leading-relaxed mb-6 relative z-10">
              임신 중 처음 발견되거나 발생한 당내성 이상입니다. 임신 중 태아에서 분비되는 호르몬에 의해 인슐린 저항성이 커져 발생하며, 출산 후 대부분 정상으로 돌아오지만 차후 2형 당뇨 발병 위험이 매우 높습니다.
            </p>
            <img src="https://images.unsplash.com/photo-1581594549595-35f6edc7b762?q=80&w=800&auto=format&fit=crop" alt="임산부" className="w-full h-48 object-cover rounded-xl mt-4" />
          </div>

          <div className="bg-gray-900 p-10 rounded-[2rem] shadow-sm border border-gray-800 text-white flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-6 font-serif">당뇨병의 대표적인 3대 증상</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">💧</div>
                <div>
                  <h4 className="font-bold text-blue-300 text-lg">다뇨 (Polyuria)</h4>
                  <p className="text-gray-400 text-sm mt-1">혈당이 높아지면 신장이 당을 소변으로 배출하기 위해 수분을 함께 끌고 나가 소변량이 급격히 늘어납니다.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">🚰</div>
                <div>
                  <h4 className="font-bold text-blue-300 text-lg">다음 (Polydipsia)</h4>
                  <p className="text-gray-400 text-sm mt-1">소변량이 많아짐에 따라 체내 수분이 부족해져 심한 갈증을 느끼게 됩니다.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">🍽️</div>
                <div>
                  <h4 className="font-bold text-blue-300 text-lg">다식 (Polyphagia)</h4>
                  <p className="text-gray-400 text-sm mt-1">섭취한 포도당이 소변으로 빠져나가 에너지로 쓰이지 못해 공복감이 심해집니다.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </main>
    </div>
  );
}
