import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Smartphone, Calendar, Phone, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [userAuth, setUserAuth] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    phone_number: '',
    email: '',
    pump_id: ''
  });

  const [password, setPassword] = useState('');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUserAuth(user);
      
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (userData) {
        setFormData({
          name: userData.name || '',
          birth_date: userData.birth_date || '',
          phone_number: userData.phone_number || '',
          email: userData.email || user.email || '',
          pump_id: userData.pump_id || ''
        });
      }
    };
    fetchUser();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (formData.pump_id && formData.pump_id.length !== 16) {
        throw new Error("기기 PID(Pump ID)는 16자리 문자여야 합니다.");
      }

      if (password) {
        const { error: pwdError } = await supabase.auth.updateUser({ password });
        if (pwdError) throw pwdError;
      }

      const { error: metaError } = await supabase.auth.updateUser({
        data: { name: formData.name }
      });
      if (metaError) throw metaError;

      const { error: dbError } = await supabase
        .from('users')
        .update({
          name: formData.name,
          birth_date: formData.birth_date,
          phone_number: formData.phone_number,
          pump_id: formData.pump_id
        })
        .eq('id', userAuth.id);

      if (dbError) throw dbError;

      const updatedUser = { ...JSON.parse(localStorage.getItem('user') || '{}'), ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccessMsg("정보가 성공적으로 업데이트되었습니다.");
      setPassword('');
    } catch (error: any) {
      setErrorMsg(error.message || "업데이트 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "탈퇴 처리 중 오류가 발생했습니다.");
      }
      
      await supabase.auth.signOut();
      localStorage.clear();
      alert("회원 탈퇴가 완료되었습니다.");
      navigate('/');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold font-serif mb-6 text-gray-900">개인정보 확인 및 수정</h2>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              {errorMsg && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{errorMsg}</div>}
              {successMsg && <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm font-medium">{successMsg}</div>}
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">이름</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><User className="w-5 h-5" /></div>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#17409c] focus:ring-1 focus:ring-[#17409c]" />
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">생년월일</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Calendar className="w-5 h-5" /></div>
                    <input type="date" name="birth_date" value={formData.birth_date} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#17409c] focus:ring-1 focus:ring-[#17409c]" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">핸드폰 번호</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Phone className="w-5 h-5" /></div>
                    <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#17409c] focus:ring-1 focus:ring-[#17409c]" />
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">이메일 (변경 불가)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Mail className="w-5 h-5" /></div>
                    <input type="email" value={formData.email} readOnly className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">기기 PID (Pump ID)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Smartphone className="w-5 h-5" /></div>
                  <input type="text" name="pump_id" maxLength={16} value={formData.pump_id} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#17409c] focus:ring-1 focus:ring-[#17409c]" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-lg font-bold mb-4">보안</h3>
                <label className="block text-sm font-bold text-gray-700 mb-2">새 비밀번호 (변경시에만 입력)</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#17409c] focus:ring-1 focus:ring-[#17409c]" />
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 font-bold rounded-xl bg-[#17409c] text-white hover:bg-blue-800 transition-all shadow-lg mt-6">
                {loading ? "저장 중..." : "변경사항 저장"}
              </button>
            </form>
          </div>
          
          <div className="bg-red-50 p-8 md:p-12 border-t border-red-100 mt-8">
            <h3 className="text-xl font-bold text-red-700 mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Danger Zone</h3>
            <p className="text-red-600/80 mb-6 text-sm break-keep">
              회원 탈퇴 시 로그인 계정이 영구 삭제됩니다. 단, 통계 목적을 위해 주입 및 혈당 기록 데이터는 익명화되어 보관됩니다.
            </p>
            <button onClick={() => setShowDeleteModal(true)} className="px-6 py-2.5 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 transition-colors text-sm">
              회원 탈퇴하기
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">정말 탈퇴하시겠습니까?</h3>
            <p className="text-gray-600 mb-8 break-keep">이 작업은 취소할 수 없으며, 모든 계정 접근 권한이 상실됩니다.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteModal(false)} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">취소</button>
              <button onClick={handleDeleteAccount} disabled={deleteLoading} className="px-5 py-2.5 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 transition-colors">
                {deleteLoading ? "처리 중..." : "확인, 탈퇴합니다"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
