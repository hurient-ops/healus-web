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
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gray-900">
        <img 
          src="/images/comp_hero_original.jpg" 
          alt="?�사?� ?�담?�는 ?�자" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-red-600/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30">
            <ShieldCheck className="w-8 h-8 text-red-300" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight font-serif">?�뇨 ?�병�??�방 가?�드</h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed">
            ?�뇨병이 무서??진짜 ?�유???�병�??�문?�니?? ?��?�??�기?�인 검진과 ?�당 관리�? 병행?�다�? 건강???�반?�과 ?�름?�는 ?�을 ?�릴 ???�습?�다.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-bold">
            <ArrowLeft className="w-5 h-5" /> 메인?�로 ?�아가�?
          </Link>
        </div>

        {/* 3?� 미세?��? ?�병�?*/}
        <h2 className="text-3xl font-bold text-gray-900 mb-8 font-serif">반드??챙겨????3?� 미세?��? ?�병�?검??/h2>
        
        <div className="space-y-8 mb-16">
          
          {/* Eye */}
          <article className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3 relative h-64 md:h-auto">
               <img src="/images/comp_eye.jpg" className="absolute inset-0 w-full h-full object-cover" alt="?�과 검�?/>
            </div>
            <div className="p-10 md:w-2/3 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><Eye className="text-blue-500"/></div>
                ?�뇨병성 망막병증 (??
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                고혈?�이 지?�되�?망막??미세 ?��???막히거나 ?�져 ?�력???�?�되�??�하�??�명???��? ???�습?�다. 초기?�는 증상???��? ?�기 ?�문???�각 증상???�더?�도 <strong>최소 1?�에 ??�??��?검??/strong>�?받아???�니??
              </p>
            </div>
          </article>

          {/* Kidney */}
          <article className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3 relative h-64 md:h-auto md:order-2">
               <img src="/images/comp_kidney.jpg" className="absolute inset-0 w-full h-full object-cover" alt="?�장 검??/>
            </div>
            <div className="p-10 md:w-2/3 flex flex-col justify-center md:order-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center"><Activity className="text-emerald-500"/></div>
                ?�뇨병성 ?�증 (콩팥)
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                ?�장???�과 기능??망�????�백질이 ?��??�로 빠져?��?�? ?�폐물이 몸에 ?�이�??�니?? 진행?�면 ?�석???�요?????�습?�다. <strong>1?�에 ??�??��? 미세?��?�?검?��? ?�액 검???�레?�티??</strong>가 ?�수?�니??
              </p>
            </div>
          </article>

          {/* Foot / Nerves */}
          <article className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3 relative h-64 md:h-auto">
               <img src="/images/comp_nerve.jpg" className="absolute inset-0 w-full h-full object-cover" alt="?�경 검??/>
            </div>
            <div className="p-10 md:w-2/3 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center"><Heart className="text-purple-500"/></div>
                ?�뇨병성 ?�경병증 (�??�경)
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                ?�발 ?�이 ?�리거??무감각해지�? ?�하�??�처가 ?�도 ?�증???�끼지 못해 조직??괴사?�는 '?�뇨�?�?진행?�니?? 매일 ?�워 ??발에 ?�처가 ?�는지 맨눈?�로 직접 ?�인?�고 보습?��? 바르???��???중요?�니??
              </p>
            </div>
          </article>

        </div>

      </main>
    </div>
  );
}

