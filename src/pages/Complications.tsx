import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Eye, Heart, Activity } from 'lucide-react';
import Header from '../components/Header';

export default function Complications() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      
      {/* Global Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <img 
          src="/images/comp_hero_original.jpg" 
          alt="의사와 상담하는 환자" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-red-600/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30">
            <ShieldCheck className="w-8 h-8 text-red-300" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight font-serif">당뇨 합병증 예방 가이드</h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed">
            당뇨병이 무서운 진짜 이유는 합병증 때문입니다. 하지만 정기적인 검진과 혈당 관리가 병행된다면, 건강한 일반인과 다름없는 삶을 누릴 수 있습니다.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-bold">
            <ArrowLeft className="w-5 h-5" /> 메인으로 돌아가기
          </Link>
        </div>

        {/* 3대 미세혈관 합병증 */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8 font-serif">반드시 챙겨야 할 3대 미세혈관 합병증 검사</h2>
        
        <div className="space-y-8 mb-16">
          
          {/* Eye */}
          <article className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3 relative h-64 md:h-auto">
               <img src="/images/comp_eye.jpg" className="absolute inset-0 w-full h-full object-cover" alt="안과 검진"/>
            </div>
            <div className="p-10 md:w-2/3 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><Eye className="text-blue-500"/></div>
                당뇨병성 망막병증 (눈)
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                고혈당이 지속되면 망막의 미세 혈관이 막히거나 터져 시력이 저하되고 심하면 실명에 이를 수 있습니다. 초기에는 증상이 전혀 없기 때문에 자각 증상이 없더라도 <strong>최소 1년에 한 번 안저검사</strong>를 받아야 합니다.
              </p>
            </div>
          </article>

          {/* Kidney */}
          <article className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3 relative h-64 md:h-auto md:order-2">
               <img src="/images/comp_kidney.jpg" className="absolute inset-0 w-full h-full object-cover" alt="신장 검사"/>
            </div>
            <div className="p-10 md:w-2/3 flex flex-col justify-center md:order-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center"><Activity className="text-emerald-500"/></div>
                당뇨병성 신증 (콩팥)
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                신장의 여과 기능이 망가져 단백질이 소변으로 빠져나가고, 노폐물이 몸에 쌓이게 됩니다. 진행되면 투석이 필요할 수 있습니다. <strong>1년에 한 번 소변 미세알부민 검사와 혈액 검사(크레아티닌)</strong>가 필수입니다.
              </p>
            </div>
          </article>

          {/* Foot / Nerves */}
          <article className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3 relative h-64 md:h-auto">
               <img src="/images/comp_nerve.jpg" className="absolute inset-0 w-full h-full object-cover" alt="신경 검사"/>
            </div>
            <div className="p-10 md:w-2/3 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center"><Heart className="text-purple-500"/></div>
                당뇨병성 신경병증 (발/신경)
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                손발 끝이 저리거나 무감각해지며, 심하면 상처가 나도 통증을 느끼지 못해 조직이 괴사하는 '당뇨발'로 진행됩니다. 매일 샤워 후 발에 상처가 없는지 맨눈으로 직접 확인하고 보습제를 바르는 습관이 중요합니다.
              </p>
            </div>
          </article>

        </div>

      </main>
    </div>
  );
}
