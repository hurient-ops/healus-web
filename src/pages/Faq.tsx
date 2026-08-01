import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const faqs = [
  {
    question: "인슐린 펌프 연동은 어떻게 하나요?",
    answer: "HealUs 모바일 앱에서 블루투스를 켜고 펌프 기기와 페어링을 진행합니다. 앱 설정의 '기기 연동' 메뉴에서 안내에 따라 연결할 수 있습니다."
  },
  {
    question: "데이터는 어떻게 동기화되나요?",
    answer: "앱이 백그라운드에 있거나 강제 종료되더라도 설정된 간격(기본 3분)마다 펌프 기기로부터 데이터를 수신하여 자동으로 클라우드에 안전하게 동기화합니다."
  },
  {
    question: "회원 탈퇴 시 내 건강 데이터는 어떻게 되나요?",
    answer: "회원 탈퇴 시 귀하의 로그인 계정 정보(이름, 연락처 등)는 영구 삭제됩니다. 다만, 당뇨 연구 및 AI 통계 분석 목적을 위해 기존의 혈당 기록 및 인슐린 주입 데이터는 누구의 것인지 알 수 없도록 완벽하게 익명화(비식별 조치)되어 보관됩니다."
  },
  {
    question: "웹사이트 대시보드에서는 무엇을 볼 수 있나요?",
    answer: "웹사이트 대시보드에서는 모바일 앱에서 동기화된 최근 혈당 수치, 일일 인슐린 주입량 추이, 식단 기록 등을 큰 화면에서 직관적인 그래프로 확인할 수 있습니다."
  },
  {
    question: "기기 PID(Pump ID)는 어디서 확인할 수 있나요?",
    answer: "사용하시는 인슐린 펌프 기기의 뒷면 라벨이나 기기 자체의 설정 메뉴(시스템 정보)에서 16자리의 영문/숫자 조합으로 된 PID를 확인하실 수 있습니다."
  }
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-bold font-serif mb-8 text-gray-900">자주 묻는 질문 (FAQ)</h1>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200 bg-white"
              >
                <button
                  className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="font-bold text-gray-800 text-lg pr-4">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-[#17409c] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-5 text-gray-600 border-t border-gray-100 pt-4 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-2xl text-center">
            <h3 className="text-lg font-bold text-[#17409c] mb-2">원하시는 답변을 찾지 못하셨나요?</h3>
            <p className="text-sm text-gray-600 mb-4">고객센터를 통해 1:1 문의를 남겨주시면 친절하게 답변해 드리겠습니다.</p>
            <a href="/support" className="inline-block px-6 py-2.5 bg-[#17409c] text-white font-bold rounded-xl hover:bg-blue-800 transition-colors">
              고객센터 바로가기
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
