import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-bold font-serif mb-8 text-gray-900">이용약관</h1>
          
          <div className="prose max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제 1 조 (목적)</h2>
              <p>본 약관은 ㈜힐어스(이하 "회사"라 합니다)가 제공하는 HealUs 앱 및 웹 서비스(이하 "서비스"라 합니다)의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제 2 조 (용어의 정의)</h2>
              <p>1. "서비스"란 구현되는 단말기(PC, 휴대형 단말기 등의 각종 유무선 장치를 포함)와 상관없이 회원이 이용할 수 있는 HealUs 관련 제반 서비스를 의미합니다.</p>
              <p>2. "회원"이란 회사의 서비스에 접속하여 본 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제 3 조 (약관의 게시와 개정)</h2>
              <p>1. 회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</p>
              <p>2. 회사는 "약관의 규제에 관한 법률", "정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 "정보통신망법")" 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제 4 조 (서비스의 제공 및 변경)</h2>
              <p>1. 회사는 인슐린 펌프 데이터 연동, 혈당 기록 관리, 식단 기록 및 대시보드 제공 등의 서비스를 제공합니다.</p>
              <p>2. 회사는 서비스의 내용, 운영상, 기술상 필요에 따라 제공하고 있는 전부 또는 일부 서비스를 변경할 수 있습니다.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">제 5 조 (의료적 책임 한계 고지)</h2>
              <p className="font-bold text-red-600 bg-red-50 p-4 rounded-lg">HealUs 서비스는 데이터 기록 및 분석을 보조하는 도구일 뿐, 전문적인 의료 기기나 의사의 진료를 대체할 수 없습니다. 서비스에서 제공되는 모든 수치와 분석 결과는 참고용이며, 정확한 의학적 판단과 치료 결정은 반드시 전문 의료진과 상의하여야 합니다.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
