import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-bold font-serif mb-8 text-gray-900">개인정보처리방침</h1>
          
          <div className="prose max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. 개인정보의 수집 및 이용 목적</h2>
              <p>㈜힐어스는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>회원 가입 및 의사 확인, 본인 식별 및 인증</li>
                <li>인슐린 펌프 데이터 연동 및 혈당 관리 서비스 제공</li>
                <li>고객 문의 사항 및 민원 처리</li>
                <li>서비스 개선을 위한 통계 데이터 확보</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. 수집하는 개인정보의 항목</h2>
              <p>회사는 원활한 서비스 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>필수항목:</strong> 이메일 주소, 비밀번호, 이름, 생년월일, 펌프 고유 식별 번호(PID)</li>
                <li><strong>선택항목:</strong> 휴대전화번호, 추가 프로필 정보</li>
                <li><strong>자동수집항목:</strong> 혈당 기록, 인슐린 주입 기록, 서비스 이용 기록, 접속 로그, 쿠키</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. 개인정보의 보유 및 이용기간</h2>
              <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
              <p className="mt-2">회원 탈퇴 시 로그인 계정 정보는 즉시 파기되나, <strong>혈당 기록 및 인슐린 주입 기록 등 건강 관련 데이터는 통계 및 연구 목적으로 식별할 수 없는 익명화 상태(비식별 조치)로 영구 보관</strong>됩니다.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. 개인정보 보호책임자</h2>
              <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
              <ul className="list-none mt-2 bg-gray-50 p-4 rounded-lg">
                <li>▶ 개인정보 보호책임자: 서재은 (대표이사)</li>
                <li>▶ 연락처: support@healus.com</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
