import { useState, useEffect } from 'react';
import { Mail, Phone, Clock, Send } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Support() {
  const [formData, setFormData] = useState({
    email: '',
    title: '',
    content: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.email) {
        setFormData(prev => ({ ...prev, email: userData.email }));
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "문의 접수 중 오류가 발생했습니다.");
      }

      setSuccess(true);
      setFormData(prev => ({ ...prev, title: '', content: '' }));
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-bold font-serif mb-8 text-gray-900">고객센터</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-blue-50 rounded-2xl p-6 text-center flex flex-col items-center">
              <Phone className="w-8 h-8 text-[#17409c] mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">전화 상담</h3>
              <p className="text-[#17409c] font-bold text-lg mb-1">1588-0000</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6 text-center flex flex-col items-center">
              <Clock className="w-8 h-8 text-[#17409c] mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">운영 시간</h3>
              <p className="text-gray-600 text-sm">평일 09:00 - 18:00</p>
              <p className="text-gray-500 text-xs mt-1">(점심시간 12:00 - 13:00)</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6 text-center flex flex-col items-center">
              <Mail className="w-8 h-8 text-[#17409c] mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">이메일 문의</h3>
              <p className="text-gray-600 text-sm">support@healus.com</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1:1 문의하기</h2>
            
            {success ? (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600 ml-1" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">문의가 성공적으로 접수되었습니다.</h3>
                <p className="text-green-600">입력하신 이메일로 빠른 시일 내에 답변 드리겠습니다.</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-6 px-6 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
                >
                  새로운 문의 남기기
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{errorMsg}</div>}
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">답변 받을 이메일</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email} 
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#17409c] focus:ring-1 focus:ring-[#17409c]" 
                    placeholder="example@healus.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">문의 제목</label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title} 
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#17409c] focus:ring-1 focus:ring-[#17409c]" 
                    placeholder="문의하실 내용의 제목을 입력해주세요"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">문의 내용</label>
                  <textarea 
                    name="content"
                    value={formData.content} 
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#17409c] focus:ring-1 focus:ring-[#17409c] resize-none" 
                    placeholder="문의하실 내용을 상세히 적어주세요."
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 font-bold rounded-xl bg-[#17409c] text-white hover:bg-blue-800 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {loading ? "접수 중..." : "문의 접수하기"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
