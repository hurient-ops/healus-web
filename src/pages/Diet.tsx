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
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gray-900">
        <img 
          src="/images/diet.png" 
          alt="?�선???�러?��? 건강???�단" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-[#1cb085]/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#1cb085]/30">
            <Utensils className="w-8 h-8 text-emerald-300" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight font-serif">?�바�??�단 관�?/h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed">
            먹는 즐거?�???�기???�요???�습?�다. ?�당 ?�파?�크�?막는 거꾸�??�사법과 ?�수?�물 계량법을 ?�해 맛있�?건강???�루�??�계?�세??
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1cb085] transition-colors font-bold">
            <ArrowLeft className="w-5 h-5" /> 메인?�로 ?�아가�?
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Item 1 */}
          <article className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group">
            <div className="relative h-64 overflow-hidden">
              <img src="/images/diet_1.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="거꾸�??�사�? />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-sm font-bold text-[#1cb085]">
                RULE 1
              </div>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">거꾸�??�사�?(�?????</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                ?�이?�유가 ?��???채소�?먼�? 먹고, �??�음 ?�백�?고기/?�선), 마�?막으�??�수?�물(�?�?????��?�세?? ?�이?�유가 ?�벽??코팅?�여 ?�의 ?�수�???��줍니??
              </p>
            </div>
          </article>

          {/* Item 2 */}
          <article className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group">
            <div className="relative h-64 overflow-hidden">
              <img src="/images/diet_2.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="복합 ?�수?�물" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-sm font-bold text-orange-600">
                RULE 2
              </div>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">?�순???�하�?복합 ?�수?�물�?/h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                ?�탕, 과일주스, ??�????�당??롤러코스?�처???�리???�순???�?? ?��?, 귀�? 고구마처??천천???�화?�는 복합 ?�수?�물???�택?�세??
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
            <h3 className="text-3xl font-bold mb-4 font-serif">?�후 가벼운 ?�책??기적</h3>
            <p className="text-emerald-100 text-lg leading-relaxed mb-6">
              ?�사 ??가만히 ?�아?�거???�워?�으�??�당??급격???�승?�니?? ?�후 15�? 가볍게 �??�을 걷거???�자�?걷기�??�는 것만?�로???�후 ?�당 ?�치�?최�? 30%까�? ??�� ???�습?�다. ?�슐린의 ?�용???�는 근육???�직여주세??
            </p>
            <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-colors shadow-lg">
              ??많�? ???�아보기
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}

