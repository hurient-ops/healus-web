import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Activity, Brain, X, AlertTriangle, Droplet, ArrowRight, Loader2, Moon, Zap, Plus, Camera, FileDown, MessageSquare, ChevronLeft, ChevronRight, Battery, Volume2, StopCircle } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import axios from 'axios';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar
} from 'recharts';
import AIChatWidget from '../components/AIChatWidget';

const api = axios.create({ baseURL: '/api' });

// Add interceptor to attach JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.setItem('isLoggedIn', 'false');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

interface BgLog {
  value: number;
  tag: string;
  time: string;
}

interface PumpLog {
  date: string;
  basal: number;
  bolus: number;
  append: number;
  avg_cgm: number;
  sleep_hours: number;
  stress_level: number;
  exercise_hours: number;
  reception_hours: number;
  event_tags: string | null;
  notes: string | null;
  error_count: number;
  error_types: string | null;
}

interface DashboardData {
  user_name: string;
  pump_battery_level?: number | null;
  pump_insulin_remaining?: number | null;
  pump_logs: PumpLog[];
  bg_logs: BgLog[];
}

interface AiResponse {
  insight: string;
  reasoning: string[];
  model: string;
  prompt_used: string;
}

const PRIMARY_COLOR = '#17409c';
const SECONDARY_COLOR = '#1cb085';
const ACCENT_COLOR = '#4a90e2';
const DANGER_COLOR = '#ef4444';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [aiData, setAiData] = useState<AiResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageOffset, setPageOffset] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('action') === 'log_bg') {
      setIsModalOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      let fetchedData: DashboardData = res.data.data;
      
      // 1. 날짜(date) 오름차순 정렬
      fetchedData.pump_logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // 2. 동일 날짜 중복 제거 (가장 마지막에 들어온 최신 데이터 1개만 유지)
      const uniqueLogsMap = new Map<string, PumpLog>();
      fetchedData.pump_logs.forEach(log => {
        uniqueLogsMap.set(log.date, log);
      });
      fetchedData.pump_logs = Array.from(uniqueLogsMap.values());
      
      setData(fetchedData);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAiInsight = async () => {
    try {
      const res = await api.get('/ai-insight');
      setAiData(res.data);
    } catch (e) {
      console.error(e);
      setAiData({
        insight: "AI 서버와의 통신 지연으로 분석을 가져오지 못했습니다.",
        reasoning: ["네트워크 오류", "잠시 후 다시 시도해 주세요."],
        model: "Error",
        prompt_used: ""
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDashboard();
    fetchAiInsight();
  }, []);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const formatU = (val: number) => Number(val.toFixed(1));

    const battery = data?.pump_battery_level ?? 4;
    const insulin = data?.pump_insulin_remaining ?? 300;
    
    // 시작 시 앞부분이 잘리는(Clipping) 현상을 막기 위한 웜업(Warm-up) 문구
    let warningMsg = "힐어스 스마트 브리핑입니다. ";
    if (battery <= 1) warningMsg += "주의! 펌프 배터리가 1칸 남았습니다. ";
    if (insulin < 30) warningMsg += `주의! 인슐린 잔량이 ${formatU(insulin)} 유닛으로, 30 유닛 미만입니다. 교체가 필요합니다. `;

    const statusMsg = `현재 펌프 배터리는 ${battery}칸, 인슐린은 ${formatU(insulin)} 유닛 남아있습니다. `;

    const basal = data?.pump_logs.length ? data.pump_logs[data.pump_logs.length-1].basal : 0;
    const bolus = data?.pump_logs.length ? data.pump_logs[data.pump_logs.length-1].bolus : 0;
    const append = data?.pump_logs.length ? data.pump_logs[data.pump_logs.length-1].append : 0;
    const total = basal + bolus + append;
    const dailyMsg = `오늘 하루 총 ${formatU(total)} 유닛을 주입했으며, 이 중 기초 주입은 ${formatU(basal)} 유닛, 식사 및 추가 주입은 ${formatU(bolus + append)} 유닛입니다. `;

    const insightMsg = aiData && aiData.insight && !aiData.insight.includes("오류") && !aiData.insight.includes("지연")
      ? `오늘의 에이아이 주치의 조언입니다. ${aiData.insight}` 
      : "";

    const textToSpeak = warningMsg + statusMsg + dailyMsg + insightMsg;

    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.05; // 발음을 또렷하게 하기 위해 속도를 조금 늦춤 (1.15 -> 1.05)
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCapture = async () => {
    console.log("handleCapture called!");
    const element = document.getElementById('dashboard-content');
    if (!element) {
      console.error("No element found!");
      alert("대시보드 영역을 찾을 수 없습니다.");
      return;
    }
    try {
      console.log("Starting html-to-image toPng...");
      const image = await toPng(element, { pixelRatio: 2 });
      console.log("toPng success! Creating link...");
      const link = document.createElement('a');
      link.href = image;
      link.download = `healus_dashboard_${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(link); // Required for some browsers
      link.click();
      document.body.removeChild(link);
      console.log("Download triggered.");
    } catch (e) {
      console.error("Capture failed:", e);
      alert("캡쳐 중 오류가 발생했습니다.");
    }
  };

  const handleReport = async () => {
    console.log("handleReport called!");
    const element = document.getElementById('dashboard-content');
    if (!element) {
      console.error("No element found!");
      alert("대시보드 영역을 찾을 수 없습니다.");
      return;
    }
    try {
      console.log("Starting html-to-image toPng for PDF...");
      const imgData = await toPng(element, { pixelRatio: 2 });
      console.log("Image data generated. Starting jsPDF...");
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      // Calculate height maintaining aspect ratio from DOM dimensions
      const elWidth = element.clientWidth;
      const elHeight = element.clientHeight;
      const pdfHeight = (elHeight * pdfWidth) / elWidth;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`healus_report_${new Date().toISOString().slice(0, 10)}.pdf`);
      console.log("PDF download triggered.");
    } catch (e) {
      console.error("PDF generation failed:", e);
      alert("PDF 생성 중 오류가 발생했습니다.");
    }
  };

  const pumpLogs = data?.pump_logs || [];

  const eventsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eventsScrollRef.current) {
      eventsScrollRef.current.scrollLeft = eventsScrollRef.current.scrollWidth;
    }
  }, [pumpLogs]);
  
  // 가장 최신 데이터를 '오늘(최근)' 데이터로 간주 (마지막 인덱스)
  const todayLog = pumpLogs.length > 0 ? pumpLogs[pumpLogs.length - 1] : null;
  const todayStr = todayLog ? todayLog.date : '';
  
  // 최근 데이터와 과거 데이터 분리
  const pastLogs = pumpLogs.filter(log => log.date !== todayStr);
  
  const latestLogs = [...pastLogs].reverse(); // 과거 데이터 중 최신이 0번 인덱스
  
  // 페이징 계산 (차트용) - 과거 데이터 기준
  const totalDays = pastLogs.length;
  const maxPage = Math.max(0, Math.ceil(totalDays / 30) - 1);
  const startIndex = Math.max(0, totalDays - 30 * (pageOffset + 1));
  const endIndex = totalDays - 30 * pageOffset;
  const chartData = pastLogs.slice(startIndex, endIndex);
  
  // KPI Calculations
  // 평균 혈당, 목표 달성률은 완료된 하루인 '과거 데이터(어제까지)' 기준
  const avgBg = pastLogs.length ? pastLogs.reduce((acc, log) => acc + log.avg_cgm, 0) / pastLogs.length : 0;
  const targetBgPercent = pastLogs.length ? (pastLogs.filter(log => log.avg_cgm >= 70 && log.avg_cgm <= 180).length / pastLogs.length) * 100 : 0;
  
  // 금일 주입량은 명확히 '오늘' 데이터 기준
  const avgBasal = todayLog ? todayLog.basal : 0;
  const avgBolus = todayLog ? todayLog.bolus : 0;
  const avgAppend = todayLog ? todayLog.append : 0;

  // Recent Error processing for bottom right chart
  const ERROR_TYPES = ['주사기 막힘', '주입불가', '배터리 부족', '일시정지', '시간제한', '1 일 초과량 주입', '단위초과', '원인불명'];
  const errorMap: Record<string, number> = {};
  ERROR_TYPES.forEach(type => errorMap[type] = 0);
  
  pastLogs.forEach(log => {
    if (log.error_types) {
      log.error_types.split(',').forEach(err => {
        const trimmed = err.trim();
        if (errorMap[trimmed] !== undefined) {
          errorMap[trimmed] += 1;
        }
      });
    }
  });
  const errorChartData = Object.entries(errorMap).map(([name, count]) => ({ name, count }));

  // Custom Donut Component
  const KPIDonut = ({ value, maxValue, label, unit, color }: any) => {
    const chartData = [
      { name: 'Value', value: value },
      { name: 'Remaining', value: Math.max(0, maxValue - value) }
    ];
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 flex flex-col items-center shadow-lg border border-white relative overflow-hidden">
        {/* Subtle background image for aesthetics */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=600&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="h-32 w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius="75%"
                outerRadius="100%"
                startAngle={225}
                endAngle={-45}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={color} />
                <Cell fill="#f3f4f6" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold font-serif" style={{ color }}>{unit === 'U' ? value.toFixed(2) : value.toFixed(1)}</span>
            <span className="text-xs text-gray-500 font-bold">{unit}</span>
          </div>
        </div>
        <h4 className="text-sm font-bold text-gray-700 mt-2 z-10">{label}</h4>
      </div>
    );
  };

  // Custom Tooltip for Trend Chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const log = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 border border-gray-200 shadow-xl rounded-xl">
          <p className="font-bold text-gray-800 mb-2 border-b pb-2">{label}</p>
          <p className="text-sm text-gray-600 flex justify-between gap-4"><span>혈당(CGM):</span> <span className="font-bold">{log.avg_cgm.toFixed(1)} mg/dL</span></p>
          <p className="text-sm text-gray-600 flex justify-between gap-4"><span>식사주입:</span> <span className="font-bold text-[#1cb085]">{log.bolus.toFixed(2)} U</span></p>
          <p className="text-sm text-gray-600 flex justify-between gap-4"><span>기초주입:</span> <span className="font-bold text-[#4a90e2]">{log.basal.toFixed(2)} U</span></p>
          <p className="text-sm text-gray-600 flex justify-between gap-4"><span>추가주입:</span> <span className="font-bold text-[#8b5cf6]">{log.append.toFixed(2)} U</span></p>
          {(log.exercise_hours > 0 || log.reception_hours > 0 || log.notes || log.error_count > 0) && (
            <div className="mt-2 pt-2 border-t flex flex-col gap-1">
              <div className="flex flex-wrap gap-1">
                {log.exercise_hours > 0 && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-full">운동 {log.exercise_hours}h</span>}
                {log.reception_hours > 0 && <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">회식 {log.reception_hours}h</span>}
                {log.error_count > 0 && <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">{log.error_types || '오류'}</span>}
              </div>
              {log.notes && (
                <div className="text-xs text-gray-500 bg-gray-50 p-1.5 rounded border border-gray-100 mt-1">
                  "{log.notes}"
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const chatContext = `
사용자 데이터 요약 (최근 100일 기준):
- 평균 혈당: ${avgBg.toFixed(1)} mg/dL
- 목표 혈당 달성률: ${targetBgPercent.toFixed(1)}%
- 금일 기초 인슐린 주입: ${avgBasal.toFixed(2)} U
- 금일 식사 인슐린 주입: ${avgBolus.toFixed(2)} U
- 금일 추가 인슐린 주입: ${avgAppend.toFixed(2)} U
`.trim();

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative overflow-hidden">
      {/* Global Background Image for Premium feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop')", backgroundSize: 'cover', backgroundAttachment: 'fixed' }}></div>
      
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between flex-wrap gap-4">
          <Link to="/" className="flex items-center gap-2 text-[#17409c] hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-[#17409c] rounded-xl flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight font-serif">HealUs</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 font-normal text-gray-600">
            <Link to="/diabetes" className="hover:text-[#17409c] transition-colors">당뇨병의 이해</Link>
            <Link to="/diet" className="hover:text-[#1cb085] transition-colors">식단 관리</Link>
            <Link to="/pump-guide" className="hover:text-orange-600 transition-colors">펌프 가이드</Link>
            <Link to="/complications" className="hover:text-red-600 transition-colors">합병증 예방</Link>
          </nav>
          
          <div className="w-16 hidden md:block"></div>
        </div>
      </header>

      <main id="dashboard-content" className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 relative z-10 bg-gray-50 min-h-[80vh]">
        {!data ? (
          <div className="flex flex-col items-center justify-center h-full w-full py-32 animate-in fade-in duration-500">
            <Loader2 className="w-12 h-12 text-[#17409c] animate-spin mb-6" />
            <h3 className="text-2xl font-bold font-serif text-gray-800 mb-2">건강 데이터를 동기화하고 있습니다</h3>
            <p className="text-gray-500 font-medium">최근 100일간의 라이프로그를 분석 중입니다...</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-700">
            <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif tracking-tight break-keep mb-2">
              {JSON.parse(localStorage.getItem('user') || '{}')?.name || data?.user_name || "회원"}님의 대시보드
            </h2>
            <p className="text-gray-500 font-medium break-keep mb-4">최근 100일간의 라이프로그 및 인슐린 투여 기록 분석</p>
            
            {data && (data.pump_battery_level !== undefined || data.pump_insulin_remaining !== undefined) && (
              <div className="flex flex-col sm:flex-row gap-4 mb-2">
                <div className="bg-white px-5 py-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-5 w-fit min-w-[240px]">
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <Battery className="absolute text-gray-200 w-full h-full" strokeWidth={1.5} />
                    <div 
                      className="absolute left-0 top-0 bottom-0 overflow-hidden transition-all duration-500" 
                      style={{ width: `calc(10% + ${((data.pump_battery_level ?? 4) / 4) * 75}%)` }}
                    >
                      <Battery className="absolute left-0 top-0 text-green-500 w-16 h-16" strokeWidth={1.5} fill="currentColor" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center text-gray-700">
                    <span className="text-sm font-bold text-gray-500 mb-1">배터리</span>
                    <span className="text-2xl font-black text-green-600 tracking-tight">{data.pump_battery_level ?? 4} / 4</span>
                  </div>
                </div>

                <div className="bg-white px-5 py-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-5 w-fit min-w-[240px]">
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="absolute inset-0 text-gray-200 w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="8" width="14" height="8" rx="1" />
                      <rect x="18" y="10" width="2" height="4" rx="0.5" />
                      <line x1="20" y1="12" x2="24" y2="12" />
                      <line x1="1" y1="12" x2="4" y2="12" />
                      <line x1="1" y1="9" x2="1" y2="15" />
                    </svg>
                    <div 
                      className="absolute right-0 top-0 bottom-0 overflow-hidden transition-all duration-500" 
                      style={{ width: `calc(25% + ${((data.pump_insulin_remaining ?? 300) / 300) * 58.3}%)` }}
                    >
                      <svg viewBox="0 0 24 24" className="absolute right-0 top-0 text-blue-500 w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="8" width="14" height="8" rx="1" fill="currentColor" />
                        <rect x="18" y="10" width="2" height="4" rx="0.5" fill="currentColor" />
                        <line x1="20" y1="12" x2="24" y2="12" />
                        <line x1="1" y1="12" x2="4" y2="12" />
                        <line x1="1" y1="9" x2="1" y2="15" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center text-gray-700">
                    <span className="text-sm font-bold text-gray-500 mb-1">인슐린 잔량</span>
                    <span className="text-2xl font-black text-blue-500 tracking-tight">{data.pump_insulin_remaining !== undefined && data.pump_insulin_remaining !== null ? data.pump_insulin_remaining.toFixed(2) : '300.00'} U</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            <button 
              onClick={handleSpeak}
              className={`px-3 py-2 sm:px-4 sm:py-3 font-bold rounded-full transition-colors shadow-sm border flex items-center gap-2 whitespace-nowrap ${isSpeaking ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-blue-50 text-[#17409c] border-blue-200 hover:bg-blue-100'}`}
              title="스마트 브리핑"
            >
              {isSpeaking ? <StopCircle className="w-5 h-5 animate-pulse"/> : <Volume2 className="w-5 h-5"/>}
              <span className="hidden sm:inline">{isSpeaking ? '브리핑 중지' : '스마트 브리핑'}</span>
            </button>
            <button 
              onClick={handleCapture}
              className="px-3 py-2 sm:px-4 sm:py-3 bg-white text-gray-700 font-bold rounded-full hover:bg-gray-100 transition-colors shadow-sm border border-gray-200 flex items-center gap-2 whitespace-nowrap"
              title="화면 캡쳐"
            >
              <Camera className="w-5 h-5"/>
              <span className="hidden sm:inline">화면 캡쳐</span>
            </button>
            <button 
              onClick={handleReport}
              className="px-3 py-2 sm:px-4 sm:py-3 bg-white text-gray-700 font-bold rounded-full hover:bg-gray-100 transition-colors shadow-sm border border-gray-200 flex items-center gap-2 whitespace-nowrap"
              title="레포트 PDF"
            >
              <FileDown className="w-5 h-5"/>
              <span className="hidden sm:inline">레포트 PDF</span>
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-[#17409c] text-white font-bold rounded-full hover:bg-blue-800 transition-colors shadow-lg flex items-center gap-2 ml-2"
            >
              <Plus className="w-5 h-5"/>
              수동 기록
            </button>
          </div>
        </div>

        {/* 1. TOP ROW: 5 Gauge Charts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
          <KPIDonut value={targetBgPercent} maxValue={100} label="목표 혈당 달성률" unit="%" color={PRIMARY_COLOR} />
          <KPIDonut value={avgBg} maxValue={300} label="평균 혈당" unit="mg/dL" color={SECONDARY_COLOR} />
          <KPIDonut value={avgBasal} maxValue={30} label="금일 기초 주입" unit="U" color={ACCENT_COLOR} />
          <KPIDonut value={avgBolus} maxValue={50} label="금일 식사 주입" unit="U" color="#f59e0b" />
          <KPIDonut value={avgAppend} maxValue={20} label="금일 추가 주입" unit="U" color="#8b5cf6" />
        </div>

        {/* 2. MIDDLE ROW: Summary Table (Left) & Trend Line Chart (Right) */}
        <div className="grid lg:grid-cols-12 gap-8 mb-8">
          {/* Summary Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#1cb085]"/> 라이프로그 요약 (최근 7일)
              </h3>
              <div className="space-y-4">
                {latestLogs.slice(0, 7).map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-700">{log.date}</span>
                      <span className="text-xs text-gray-500">{log.event_tags || '특이사항 없음'}</span>
                    </div>
                    <div className="text-right flex items-center gap-4">
                       <div className="flex flex-col items-center" title="CGM">
                         <Droplet className="w-3 h-3 text-red-400 mb-0.5"/>
                         <span className="text-xs font-bold text-gray-700">{log.avg_cgm.toFixed(0)}</span>
                       </div>
                       <div className="flex flex-col items-center" title="수면">
                         <Moon className="w-3 h-3 text-indigo-400 mb-0.5"/>
                         <span className="text-xs font-bold text-gray-700">{log.sleep_hours.toFixed(1)}h</span>
                       </div>
                       <div className="flex flex-col items-center" title="스트레스">
                         <Zap className="w-3 h-3 text-yellow-500 mb-0.5"/>
                         <span className="text-xs font-bold text-gray-700">{log.stress_level}</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Trend Chart Column */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-6">
               <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">인슐린 & 혈당 복합 트렌드</h3>
                  <p className="text-sm text-gray-500">30일 단위 CGM 혈당과 인슐린 주입량 비교 (오른쪽이 최신)</p>
               </div>
               <div className="flex items-center gap-2">
                 <button 
                   onClick={() => setPageOffset(prev => Math.min(maxPage, prev + 1))}
                   disabled={pageOffset >= maxPage}
                   className={`p-2 rounded-lg border ${pageOffset >= maxPage ? 'text-gray-300 border-gray-200' : 'text-gray-600 border-gray-300 hover:bg-gray-100'} transition-colors`}
                   title="이전 30일"
                 >
                   <ChevronLeft className="w-5 h-5"/>
                 </button>
                 <span className="text-sm font-bold text-gray-600 min-w-[60px] text-center">
                   {pageOffset === 0 ? '최근 30일' : `과거 ${pageOffset*30}~${(pageOffset+1)*30}일`}
                 </span>
                 <button 
                   onClick={() => setPageOffset(prev => Math.max(0, prev - 1))}
                   disabled={pageOffset === 0}
                   className={`p-2 rounded-lg border ${pageOffset === 0 ? 'text-gray-300 border-gray-200' : 'text-gray-600 border-gray-300 hover:bg-gray-100'} transition-colors`}
                   title="다음 30일"
                 >
                   <ChevronRight className="w-5 h-5"/>
                 </button>
               </div>
             </div>
             <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBasal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={ACCENT_COLOR} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={ACCENT_COLOR} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBolus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={SECONDARY_COLOR} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={SECONDARY_COLOR} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAppend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="date" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#ef4444'}} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                    <Area yAxisId="left" type="monotone" dataKey="basal" name="기초 주입" stroke={ACCENT_COLOR} fillOpacity={1} fill="url(#colorBasal)" />
                    <Area yAxisId="left" type="monotone" dataKey="bolus" name="식사 주입" stroke={SECONDARY_COLOR} fillOpacity={1} fill="url(#colorBolus)" />
                    <Area yAxisId="left" type="monotone" dataKey="append" name="추가 주입" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorAppend)" />
                    <Line yAxisId="right" type="monotone" dataKey="avg_cgm" name="평균 혈당" stroke={DANGER_COLOR} strokeWidth={2} dot={{r: 2, fill: DANGER_COLOR}} />
                  </ComposedChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* 2.5 Lifelog Events */}
        {pumpLogs.filter(log => log.exercise_hours > 0 || log.reception_hours > 0 || log.notes).length > 0 && (
          <div className="mb-8 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="text-lg font-bold text-[#17409c] mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5"/> 최근 주요 라이프로그 이벤트
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" ref={eventsScrollRef}>
              {pastLogs.filter(log => log.exercise_hours > 0 || log.reception_hours > 0 || log.notes).slice(-15).map((log, idx) => (
                <div key={`past-${idx}`} className="flex-shrink-0 bg-blue-50 px-5 py-3 rounded-2xl border border-blue-100 flex flex-col gap-1 min-w-[150px]">
                  <span className="text-xs font-bold text-gray-400">{log.date}</span>
                  <div className="flex gap-2 flex-wrap mt-1 items-center">
                    {log.exercise_hours > 0 && (
                      <span className="text-sm font-bold text-emerald-600 bg-emerald-100/80 px-2.5 py-1 rounded-lg shadow-sm">운동 {log.exercise_hours}h</span>
                    )}
                    {log.reception_hours > 0 && (
                      <span className="text-sm font-bold text-orange-600 bg-orange-100/80 px-2.5 py-1 rounded-lg shadow-sm">회식 {log.reception_hours}h</span>
                    )}
                    {log.notes && (
                      <div className="group relative flex items-center justify-center p-1 bg-white rounded-md shadow-sm border border-gray-200 cursor-help">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs break-keep p-2.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center shadow-xl leading-relaxed">
                          {log.notes}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {(todayLog ? [todayLog] : []).filter(log => log.exercise_hours > 0 || log.reception_hours > 0 || log.notes).map((log, idx) => (
                <div key={`today-${idx}`} className="flex-shrink-0 bg-blue-100 px-5 py-3 rounded-2xl border border-blue-200 flex flex-col gap-1 min-w-[150px]">
                  <span className="text-xs font-bold text-blue-800">오늘 ({log.date})</span>
                  <div className="flex gap-2 flex-wrap mt-1 items-center">
                    {log.exercise_hours > 0 && <span className="text-sm font-bold text-emerald-700">운동 {log.exercise_hours}h</span>}
                    {log.reception_hours > 0 && <span className="text-sm font-bold text-orange-700">회식 {log.reception_hours}h</span>}
                  
                    {log.notes && (
                      <div className="group relative flex items-center justify-center p-1 bg-white/50 rounded-md shadow-sm border border-blue-200 cursor-help">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs break-keep p-2.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center shadow-xl leading-relaxed">
                          {log.notes}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </div>
          </div>
        )}

        {/* 3. BOTTOM ROW: Transparent AI Box (Left) & Error Bar Chart (Right) */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* AI Box */}
          <div className="lg:col-span-8 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-1 shadow-xl overflow-hidden relative group">
            {/* Animated Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            
            <div className="bg-[#0b1120] rounded-[22px] p-8 h-full relative z-10 text-white flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <Brain className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Transparent AI Inference</h3>
                  <p className="text-xs text-blue-300 font-mono flex items-center gap-1">
                    <Loader2 className={`w-3 h-3 ${!aiData ? 'animate-spin' : ''}`}/>
                    {aiData ? `Model: ${aiData.model}` : 'Connecting to local LLM...'}
                  </p>
                </div>
              </div>

              {!aiData ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-10 opacity-70">
                  <div className="w-full max-w-md h-2 bg-blue-900/50 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                  <p className="text-sm font-mono text-blue-200">Analyzing Lifelog Vectors (CGM, Sleep, Meals, Stress)...</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6 h-full">
                  {/* Reasoning Process */}
                  <div className="bg-blue-950/40 border border-blue-800/50 rounded-2xl p-5">
                    <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Activity className="w-3 h-3"/> Reasoning Process
                    </h4>
                    <ul className="space-y-3 font-mono text-sm text-blue-100/80">
                      {(aiData.reasoning || []).map((step: string, idx: number) => (
                        <li key={idx} className="flex gap-3 items-start">
                          <span className="text-blue-500 mt-0.5">[{idx+1}]</span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Final Insight */}
                  <div className="mt-auto">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <ArrowRight className="w-3 h-3"/> AI Clinical Insight
                    </h4>
                    <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border-l-4 border-emerald-500 p-4 rounded-r-xl">
                      <p className="text-lg leading-relaxed font-normal text-white">
                        {aiData.insight}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Chart */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
               <AlertTriangle className="w-5 h-5 text-red-500"/> 오류 상태 분석
            </h3>
            <p className="text-sm text-gray-500 mb-6">최근 100일간 발생한 펌프 오류 통계</p>
            
            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={errorChartData} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#f3f4f6"/>
                  <XAxis type="number" axisLine={{ stroke: '#d1d5db' }} tickLine={{ stroke: '#d1d5db' }} tick={{fontSize: 12, fill: '#9ca3af'}} />
                  <YAxis dataKey="name" type="category" axisLine={{ stroke: '#d1d5db' }} tickLine={{ stroke: '#d1d5db' }} width={110} tick={(props: any) => (
                    <text x={props.x - 100} y={props.y} dy={4} textAnchor="start" fontSize={12} fill="#4b5563" fontWeight="bold">
                      {props.payload.value}
                    </text>
                  )} />
                  <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                  <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        </div>
        )}
      </main>

      {isModalOpen && (
        <BgLogModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchDashboard();
          }}
        />
      )}
      
      <AIChatWidget contextData={chatContext} />
    </div>
  );
}

// ... BgLogModal remains the same
function BgLogModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [tab, setTab] = useState<'bg' | 'sleep' | 'stress' | 'notes'>('bg');
  
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, 16);
  const [datetime, setDatetime] = useState<string>(localISOTime);
  
  const [value, setValue] = useState<number>(100);
  const [tag, setTag] = useState<string>('식후');
  const [noteText, setNoteText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/log-metrics', {
        type: tab,
        value: tab === 'notes' ? noteText : value,
        tag: tab === 'bg' ? tag : undefined
      });
      onSuccess();
    } catch (e) {
      console.error(e);
      alert('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden relative border border-white/50">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors bg-white/50 rounded-full p-1 z-10">
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-8 md:p-10 max-h-[90vh] overflow-y-auto">
          <h3 className="text-2xl md:text-3xl font-bold font-serif text-[#17409c] mb-6">라이프로그 기록</h3>
          
          <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
            <button onClick={() => {setTab('bg'); setValue(100);}} className={`flex-1 py-2 md:py-3 font-bold text-sm md:text-base rounded-lg transition-colors ${tab === 'bg' ? 'bg-white shadow text-[#17409c]' : 'text-gray-500 hover:text-gray-900'}`}>혈당</button>
            <button onClick={() => {setTab('sleep'); setValue(7.5);}} className={`flex-1 py-2 md:py-3 font-bold text-sm md:text-base rounded-lg transition-colors ${tab === 'sleep' ? 'bg-white shadow text-[#17409c]' : 'text-gray-500 hover:text-gray-900'}`}>수면</button>
            <button onClick={() => {setTab('stress'); setValue(5);}} className={`flex-1 py-2 md:py-3 font-bold text-sm md:text-base rounded-lg transition-colors ${tab === 'stress' ? 'bg-white shadow text-[#17409c]' : 'text-gray-500 hover:text-gray-900'}`}>스트레스</button>
            <button onClick={() => {setTab('notes'); setNoteText('');}} className={`flex-1 py-2 md:py-3 font-bold text-sm md:text-base rounded-lg transition-colors ${tab === 'notes' ? 'bg-white shadow text-[#17409c]' : 'text-gray-500 hover:text-gray-900'}`}>특이사항</button>
          </div>
          
          <div className="space-y-8">
            {tab === 'bg' && (
              <>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <label className="block text-sm font-bold text-[#17409c] mb-2">측정 일시</label>
                  <input type="datetime-local" value={datetime} onChange={e => setDatetime(e.target.value)} className="w-full bg-transparent border-none text-base md:text-lg font-medium text-gray-900 focus:ring-0 outline-none"/>
                </div>
                <div className="flex flex-col items-center py-4">
                  <span className="text-sm font-bold text-gray-500 mb-4">혈당 수치 (mg/dL)</span>
                  <input type="number" value={value} onChange={e => setValue(Number(e.target.value))} className="text-6xl md:text-7xl font-bold text-center text-[#17409c] w-full outline-none border-b-2 border-transparent focus:border-[#17409c] bg-transparent py-2 transition-colors font-serif"/>
                </div>
                <div>
                  <span className="block text-sm font-bold text-gray-500 mb-3 text-center">측정 상태 태그</span>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {['기상직후', '공복', '식전', '식후', '취침전', '기타'].map(t => (
                      <button key={t} onClick={() => setTag(t)} className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${tag === t ? 'bg-[#17409c] text-white scale-105' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#17409c]'}`}>{t}</button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {tab === 'sleep' && (
              <div className="flex flex-col items-center py-10">
                <span className="text-sm font-bold text-gray-500 mb-4">어젯밤 수면 시간 (시간)</span>
                <div className="flex items-end gap-2">
                  <input type="number" step="0.5" value={value} onChange={e => setValue(Number(e.target.value))} className="text-6xl md:text-7xl font-bold text-center text-[#17409c] w-32 md:w-40 outline-none border-b-2 border-transparent focus:border-[#17409c] bg-transparent py-2 transition-colors font-serif"/>
                  <span className="text-xl md:text-2xl font-bold text-gray-400 mb-4">h</span>
                </div>
              </div>
            )}

            {tab === 'stress' && (
              <div className="flex flex-col items-center py-10">
                <span className="text-sm font-bold text-gray-500 mb-2">오늘의 스트레스 지수 (0~10)</span>
                <p className="text-xs text-gray-400 mb-8 text-center px-4">
                  0(가장 평온함)부터 10(극심한 스트레스) 사이에서<br/>오늘 하루 전반적으로 느낀 강도를 선택해주세요.
                </p>
                <input type="range" min="0" max="10" value={value} onChange={e => setValue(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#17409c] mb-2"/>
                <div className="grid grid-cols-3 w-full px-2 text-xs font-bold text-gray-400 mb-8">
                  <span className="text-left">0 (평온)</span>
                  <span className="text-center">5 (보통)</span>
                  <span className="text-right">10 (극심)</span>
                </div>
                <div className="text-6xl md:text-7xl font-bold text-center text-[#17409c] font-serif">{value}</div>
              </div>
            )}

            
            {tab === 'notes' && (
              <div className="flex flex-col items-center py-4">
                <span className="text-sm font-bold text-gray-500 mb-2">특이사항 메모</span>
                <p className="text-xs text-gray-400 mb-4 text-center">
                  최대 100자까지만 작성 가능합니다.
                </p>
                <textarea 
                  value={noteText} 
                  onChange={e => setNoteText(e.target.value)} 
                  maxLength={100}
                  placeholder="회식, 과식, 운동, 식사종류 등 특이사항을 자유롭게 기록해보세요." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-base md:text-lg font-medium text-gray-900 focus:ring-2 focus:ring-[#17409c] outline-none min-h-[150px] resize-none"
                ></textarea>
                <div className="text-right w-full text-xs font-mono mt-2 font-bold text-gray-400">
                  {noteText.length} / 100 자
                </div>
              </div>
            )}
            <button onClick={handleSubmit} disabled={loading} className="w-full py-4 md:py-5 rounded-2xl bg-[#17409c] text-white font-bold text-lg hover:bg-blue-800 transition-colors mt-4 disabled:opacity-50 shadow-lg">
              {loading ? '저장 중...' : '이 기록 저장하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
