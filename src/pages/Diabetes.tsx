import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Activity, Info, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';

export default function Diabetes() {
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
          src="/images/diabetes_hero_final.png" 
          alt="?�당 측정?�는 모습" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-[#17409c]/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#17409c]/30">
            <Activity className="w-8 h-8 text-blue-300" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight font-serif">?�뇨�? ?��?�??�해?�기</h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed">
            지?��?기면 백전백승. 1?? 2?? ?�신 ?�뇨??차이?��???발생 ?�인까�?, 막연???�려?�???�어 ?�바�?관리�? ?�작?�는 첫걸?�을 ?�내?�니??
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#17409c] transition-colors font-bold">
            <ArrowLeft className="w-5 h-5" /> 메인?�로 ?�아가�?
          </Link>
        </div>

        {/* Article 1 */}
        <article className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-12 flex flex-col justify-center">
              <span className="text-[#17409c] font-bold tracking-widest text-sm mb-4">TYPE 1 DIABETES</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">1???�뇨�?(?????�뇨)</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                주로 ?�아??�?��?�기??발병?�여 '?�아 ?�뇨'�?불리기도 ?�으?? ?�인?�게??발병?????�습?�다. 췌장??베�??�포가 ?��?면역 반응 ?�으�??�괴?�어 ?�슐린이 ?��? 분비?��? ?�는 ?�태�?말합?�다.
              </p>
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-[#17409c] mb-2 flex items-center gap-2"><Info className="w-5 h-5"/> ?�심 관리법</h4>
                <p className="text-gray-700 text-sm leading-relaxed">?�생 ?��??�서 ?�슐린을 공급받아???��?�? ?�슐�?주사???�슐�??�프 ?�용???�수?�입?�다. ?�수?�물 계량�??�슐�??�량 조절 교육??매우 중요?�니??</p>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <img src="/images/type1.jpg" alt="?�슐�??�프" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </article>

        {/* Article 2 */}
        <article className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-auto order-2 md:order-1">
              <img src="/images/type2.jpg" alt="?�인 ?�뇨" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="p-12 flex flex-col justify-center order-1 md:order-2">
              <span className="text-[#1cb085] font-bold tracking-widest text-sm mb-4">TYPE 2 DIABETES</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">2???�뇨�?(?????�뇨)</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                ?�체 ?�뇨병의 90% ?�상??차�??�니?? ?�슐린�? 분비?��?�?�?기능???�어지??'?�슐�??�??��'???�징?�니?? ?�전???�인 ?�에??비만, ?�구?�된 ?�습관, ?�트?�스, ?�동 부�????�경???�인???�게 ?�용?�니??
              </p>
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <h4 className="font-bold text-[#1cb085] mb-2 flex items-center gap-2"><Activity className="w-5 h-5"/> ?�심 관리법</h4>
                <p className="text-gray-700 text-sm leading-relaxed">?�이?�법�?규칙?�인 ?�동???�한 체중 감량??최우?�입?�다. 경구???�당강하?�로 조절?�며, 병이 진행?�면 ?�슐�?주사가 ?�요?????�습?�다.</p>
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">?�신 ?�뇨�?/h3>
            <p className="text-gray-600 leading-relaxed mb-6 relative z-10">
              ?�신 �?처음 발견?�거??발생???�내???�상?�니?? ?�신 �??�아?�서 분비?�는 ?�르몬에 ?�해 ?�슐�??�??��??커져 발생?�며, 출산 ???�부�??�상?�로 ?�아?��?�?차후 2???�뇨 발병 ?�험??매우 ?�습?�다.
            </p>
            <img src="/images/gestational.jpg" alt="?�산부" className="w-full h-48 object-cover rounded-xl mt-4" />
          </div>

          <div className="bg-gray-900 p-10 rounded-[2rem] shadow-sm border border-gray-800 text-white flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-6 font-serif">?�뇨병의 ?�?�적??3?� 증상</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">?��</div>
                <div>
                  <h4 className="font-bold text-blue-300 text-lg">?�뇨 (Polyuria)</h4>
                  <p className="text-gray-400 text-sm mt-1">?�당???�아지�??�장???�을 ?��??�로 배출?�기 ?�해 ?�분???�께 ?�고 ?��? ?��??�이 급격???�어?�니??</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">?��</div>
                <div>
                  <h4 className="font-bold text-blue-300 text-lg">?�음 (Polydipsia)</h4>
                  <p className="text-gray-400 text-sm mt-1">?��??�이 많아짐에 ?�라 체내 ?�분??부족해???�한 갈증???�끼�??�니??</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">?���?/div>
                <div>
                  <h4 className="font-bold text-blue-300 text-lg">?�식 (Polyphagia)</h4>
                  <p className="text-gray-400 text-sm mt-1">??��???�도?�이 ?��??�로 빠져?��? ?�너지�??�이지 못해 공복감이 ?�해집니??</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </main>
    </div>
  );
}

