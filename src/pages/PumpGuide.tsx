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
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <img 
          src="/images/user_pump_hero.png"
          alt="인슐린 펌프" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-orange-600/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-orange-500/30">
            <Activity className="w-8 h-8 text-orange-300" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight font-serif">스마트한 인슐린 펌프 사용법</h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed">
            인공 췌장을 향한 첫걸음. 기초 주입과 식사 주입의 차이를 이해하고, 발생 가능한 기기 알람에<br className="hidden md:block" />당황하지 않고 대처하는 방법을 익혀보세요.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors font-bold">
            <ArrowLeft className="w-5 h-5" /> 메인으로 돌아가기
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">기초 주입량 (Basal)</h2>
              <p className="text-gray-600 leading-relaxed mb-6 flex-1">
                24시간 동안 지속적으로 조금씩 들어가는 인슐린입니다. 식사를 하지 않을 때도 우리 몸은 에너지를 필요로 하며, 이때 발생하는 혈당 상승을 막아줍니다. 
                개인의 생활 패턴(야간, 운동 시 등)에 따라 시간대별로 촘촘하게 설정할 수 있는 것이 펌프의 최대 장점입니다.
              </p>
            </div>
          </article>

          {/* Bolus */}
          <article className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group">
            <div className="p-10 flex flex-col h-full">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                <Utensils className="w-6 h-6 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">식사 주입량 (Bolus)</h2>
              <p className="text-gray-600 leading-relaxed mb-6 flex-1">
                식사를 하거나 간식을 먹을 때 들어온 탄수화물을 처리하기 위해 한 번에 주입하는 인슐린입니다.<br className="hidden md:block" />
                먹을 음식의 탄수화물 양을 계산하고, 현재 혈당 수치를 고려하여 펌프의 '식사 주입 계산기'를 활용하면<br className="hidden md:block" /> 훨씬 정밀한 투여가 가능합니다.
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
              <AlertCircle className="w-8 h-8"/> 펌프 알람, 당황하지 마세요
            </h3>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <span className="text-red-600 font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-red-900 mb-2">막힘(Occlusion) 알람</h4>
                  <p className="text-gray-700 leading-relaxed">
                    주사 바늘(캐뉼라)이 꺾이거나 혈액/조직액 등으로 막혀 인슐린이 제대로 들어가지 못할 때 발생합니다.<br className="hidden md:block" />즉시 새로운 주사 부위로 교체해야 합니다. 
                    방치 시 급성 케톤산혈증으로 이어질 수 있어 가장 주의해야 합니다.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                  <Battery className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-red-900 mb-2">배터리 부족 알람</h4>
                  <p className="text-gray-700 leading-relaxed">
                    단순한 알람이지만, 무시하고 자다가 펌프가 꺼지면 밤새 인슐린이 주입되지 않아 아침에 고혈당 쇼크가 올 수<br className="hidden md:block" /> 있습니다. 알람이 울리면 즉시 충전하거나 건전지를 교체하세요.
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
