import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Activity, Battery, Zap, AlertCircle, Utensils } from 'lucide-react';
import Header from '../components/Header';

export default function PumpGuide() {
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
          src="/images/user_pump_hero.png"
          alt="?�슐�??�프" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-orange-600/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-orange-500/30">
            <Activity className="w-8 h-8 text-orange-300" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight font-serif">?�마?�한 ?�슐�??�프 ?�용�?/h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed">
            ?�공 췌장???�한 첫걸?? 기초 주입�??�사 주입??차이�??�해?�고, 발생 가?�한 기기 ?�람???�황?��? ?�고 ?�처하??방법???��?보세??
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors font-bold">
            <ArrowLeft className="w-5 h-5" /> 메인?�로 ?�아가�?
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Basal */}
          <article className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group">
            <div className="p-10 flex flex-col h-full">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">기초 주입??(Basal)</h2>
              <p className="text-gray-600 leading-relaxed mb-6 flex-1">
                24?�간 ?�안 지?�적?�로 조금???�어가???�슐린입?�다. ?�사�??��? ?�을 ?�도 ?�리 몸�? ?�너지�??�요�??�며, ?�때 발생?�는 ?�당 ?�승??막아줍니?? 
                개인???�활 ?�턴(?�간, ?�동 ???????�라 ?�간?�별로 촘촘?�게 ?�정?????�는 것이 ?�프??최�? ?�점?�니??
              </p>
            </div>
          </article>

          {/* Bolus */}
          <article className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group">
            <div className="p-10 flex flex-col h-full">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                <Utensils className="w-6 h-6 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">?�사 주입??(Bolus)</h2>
              <p className="text-gray-600 leading-relaxed mb-6 flex-1">
                ?�사�??�거??간식??먹을 ???�어???�수?�물??처리?�기 ?�해 ??번에 주입?�는 ?�슐린입?�다. 
                먹을 ?�식???�수?�물 ?�을 계산?�고, ?�재 ?�당 ?�치�?고려?�여 ?�프??'?�사 주입 계산�?�??�용?�면 ?�씬 ?��????�여가 가?�합?�다.
              </p>
            </div>
          </article>
        </div>

        {/* Warning Section */}
        <div className="bg-red-50 p-12 rounded-[2rem] shadow-sm border border-red-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <AlertCircle className="w-64 h-64 text-red-900" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-8 font-serif text-red-900 flex items-center gap-3">
              <AlertCircle className="w-8 h-8"/> ?�프 ?�람, ?�황?��? 마세??
            </h3>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <span className="text-red-600 font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-red-900 mb-2">막힘(Occlusion) ?�람</h4>
                  <p className="text-gray-700 leading-relaxed">
                    주사 바늘(캐뉼????꺾이거나 ?�액/조직???�으�?막�? ?�슐린이 ?��?�??�어가지 못할 ??발생?�니?? 즉시 ?�로??주사 부?�로 교체?�야 ?�니?? 
                    방치 ??급성 케?�산?�증?�로 ?�어�????�어 가??주의?�야 ?�니??
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                  <Battery className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-red-900 mb-2">배터�?부�??�람</h4>
                  <p className="text-gray-700 leading-relaxed">
                    ?�순???�람?��?�? 무시?�고 ?�다가 ?�프가 꺼�?�?밤새 ?�슐린이 주입?��? ?�아 ?�침??고혈???�크가 ?????�습?�다. ?�람???�리�?즉시 충전?�거??건전지�?교체?�세??
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

