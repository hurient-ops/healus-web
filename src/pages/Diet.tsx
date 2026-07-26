import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Utensils, Coffee } from 'lucide-react';
import Header from '../components/Header';

export default function Diet() {
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
          src="/images/diet.png" 
          alt="신선한 샐러드와 건강한 식단" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-[#1cb085]/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#1cb085]/30">
            <Utensils className="w-8 h-8 text-emerald-300" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight font-serif">올바른 식단 관리</h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed">
            먹는 즐거움을 포기할 필요는 없습니다. 혈당 스파이크를 막는 거꾸로 식사법과 탄수화물 계량법을 통해 맛있고 건강한 하루를 설계하세요.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1cb085] transition-colors font-bold">
            <ArrowLeft className="w-5 h-5" /> 메인으로 돌아가기
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Item 1 */}
          <article className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group">
            <div className="relative h-64 overflow-hidden">
              <img src="/images/diet_1.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="거꾸로 식사법" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-sm font-bold text-[#1cb085]">
                RULE 1
              </div>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">거꾸로 식사법 (채.단.탄)</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                식이섬유가 풍부한 채소를 먼저 먹고, 그 다음 단백질(고기/생선), 마지막으로 탄수화물(밥/빵)을 섭취하세요. 식이섬유가 위벽을 코팅하여 당의 흡수를 늦춰줍니다.
              </p>
            </div>
          </article>

          {/* Item 2 */}
          <article className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group">
            <div className="relative h-64 overflow-hidden">
              <img src="/images/diet_2.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="복합 탄수화물" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-sm font-bold text-orange-600">
                RULE 2
              </div>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">단순당 피하고 복합 탄수화물로</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                설탕, 과일주스, 흰 빵 등 혈당을 롤러코스터처럼 올리는 단순당 대신, 현미, 귀리, 고구마처럼 천천히 소화되는 복합 탄수화물을 선택하세요.
              </p>
            </div>
          </article>
        </div>

        {/* Info Banner */}
        <div className="bg-emerald-900 p-12 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="md:w-1/3 relative z-10 shrink-0">
             <div className="w-32 h-32 bg-emerald-800 rounded-full flex items-center justify-center border-4 border-emerald-700 shadow-inner mx-auto">
               <Coffee className="w-12 h-12 text-emerald-300" />
             </div>
          </div>
          
          <div className="md:w-2/3 relative z-10 text-white text-center md:text-left">
            <h3 className="text-3xl font-bold mb-4 font-serif">식후 가벼운 산책의 기적</h3>
            <p className="text-emerald-100 text-lg leading-relaxed mb-6">
              식사 후 가만히 앉아있거나 누워있으면 혈당이 급격히 상승합니다. 식후 15분, 가볍게 집 앞을 걷거나 제자리 걷기를 하는 것만으로도 식후 혈당 수치를 최대 30%까지 낮출 수 있습니다. 인슐린의 작용을 돕는 근육을 움직여주세요.
            </p>
            <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-colors shadow-lg">
              더 많은 팁 알아보기
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
