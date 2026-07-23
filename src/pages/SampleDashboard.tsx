import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Activity, Brain, X, AlertTriangle, Droplet, ArrowRight, Loader2, Moon, Zap, Plus } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar
} from 'recharts';

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
  event_tags: string | null;
  error_count: number;
  error_types: string | null;
}

interface DashboardData {
  user_name: string;
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

const dummyDashboardData: DashboardData = {
  user_name: "체험(샘플)",
  pump_logs: Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    return {
      date: d.toISOString().slice(0, 10),
      basal: 10 + Math.random() * 2,
      bolus: isWeekend ? 25 + Math.random() * 5 : 15 + Math.random() * 5,
      append: isWeekend ? 0 : Math.random() * 5,
      avg_cgm: isWeekend ? 145 + Math.random() * 20 : 105 + Math.random() * 10,
      sleep_hours: isWeekend ? 8 : 5.5,
      stress_level: isWeekend ? 2 : 8,
      exercise_hours: isWeekend ? 0 : 1,
      event_tags: isWeekend ? '주말, 과식' : null,
      error_count: Math.random() > 0.90 ? 1 : 0,
      error_types: Math.random() > 0.90 ? ['주사기 막힘', '주입불가', '배터리 부족', '일시정지', '시간제한', '1 일 초과량 주입', '단위초과', '원인불명'][Math.floor(Math.random() * 8)] : null,
    };
  }),
  bg_logs: []
};

const dummyAiInsight: AiResponse = {
  insight: "주말마다 수면 시간이 길어지지만 활동량이 줄어들며, 평일 대비 30% 이상 인슐린 요구량이 증가하고 식후 혈당 스파이크가 빈번하게 관찰됩니다. 주말 점심 식사 전 볼루스 주입량을 2U 늘리거나, 식후 30분 가벼운 산책을 강력히 권장합니다.",
  reasoning: [
    "최근 30일간 주말(토/일)의 평균 CGM 수치가 평일 대비 평균 35mg/dL 높게 유지되고 있습니다.",
    "특히 주말 오후 식사 주입(Bolus) 대비 혈당 강하 효과가 평일보다 15% 낮게 나타납니다 (일시적 인슐린 저항성 증가).",
    "교차로 분석된 라이프로그 데이터 상 주말 운동 시간은 0이며 스트레스 지수는 낮아, 신체 활동량 저하가 혈당 상승의 주원인으로 분석됩니다.",
    "펌프 기류(막힘 등) 오류는 정상 범주로 확인되어 기기 문제는 배제하였습니다."
  ],
  model: "Healus-Medi-LLM-v2",
  prompt_used: ""
};

export default function SampleDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [aiData, setAiData] = useState<AiResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('action') === 'log_bg') {
      setIsModalOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    // 가상 데이터 즉시 렌더링을 위해 타임아웃 부여 (로딩 연출)
    const t1 = setTimeout(() => setData(dummyDashboardData), 500);
    const t2 = setTimeout(() => setAiData(dummyAiInsight), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const pumpLogs = data?.pump_logs || [];
  
  // KPI Calculations
  const avgBg = pumpLogs.length ? pumpLogs.reduce((acc, log) => acc + log.avg_cgm, 0) / pumpLogs.length : 110;
  const targetBgPercent = pumpLogs.length ? (pumpLogs.filter(log => log.avg_cgm >= 70 && log.avg_cgm <= 180).length / pumpLogs.length) * 100 : 0;
  const avgBasal = pumpLogs.length ? pumpLogs.reduce((acc, log) => acc + log.basal, 0) / pumpLogs.length : 0;
  const avgBolus = pumpLogs.length ? pumpLogs.reduce((acc, log) => acc + log.bolus, 0) / pumpLogs.length : 0;
  const avgAppend = pumpLogs.length ? pumpLogs.reduce((acc, log) => acc + log.append, 0) / pumpLogs.length : 0;

  // Recent Error processing for bottom right chart
  const ERROR_TYPES = ['주사기 막힘', '주입불가', '배터리 부족', '일시정지', '시간제한', '1 일 초과량 주입', '단위초과', '원인불명'];
  const errorMap: Record<string, number> = {};
  ERROR_TYPES.forEach(type => errorMap[type] = 0);
  
  pumpLogs.forEach(log => {
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
            <span className="text-2xl font-bold font-serif" style={{ color }}>{value.toFixed(1)}</span>
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
          <p className="text-sm text-gray-600 flex justify-between gap-4"><span>식사주입:</span> <span className="font-bold text-[#1cb085]">{log.bolus.toFixed(1)} U</span></p>
          <p className="text-sm text-gray-600 flex justify-between gap-4"><span>기초주입:</span> <span className="font-bold text-[#4a90e2]">{log.basal.toFixed(1)} U</span></p>
          <p className="text-sm text-gray-600 flex justify-between gap-4"><span>추가주입:</span> <span className="font-bold text-[#8b5cf6]">{log.append.toFixed(1)} U</span></p>
          {(log.event_tags || log.error_count > 0) && (
            <div className="mt-2 pt-2 border-t flex flex-wrap gap-1">
              {log.event_tags?.split(',').map((t: string) => <span key={t} className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">{t}</span>)}
              {log.error_count > 0 && <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">오류 {log.error_count}건</span>}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative overflow-hidden">
      {/* Global Background Image for Premium feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop')", backgroundSize: 'cover', backgroundAttachment: 'fixed' }}></div>
      
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#17409c] hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-[#17409c] rounded-xl flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight font-serif">Healus</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 font-normal text-gray-600">
            <Link to="/diabetes" className="hover:text-[#17409c] transition-colors">당뇨병의 이해</Link>
            <Link to="/diet" className="hover:text-[#1cb085] transition-colors">식단 관리</Link>
            <Link to="/pump-guide" className="hover:text-orange-600 transition-colors">펌프 가이드</Link>
            <Link to="/complications" className="hover:text-red-600 transition-colors">합병증 예방</Link>
          </nav>
          
          <div className="w-16"></div>
        </div>
      </header>

      {/* Sample Banner */}
      <div className="bg-[#17409c] text-white py-3 px-6 text-center font-medium shadow-md relative z-20 flex items-center justify-center gap-4">
        <span>이 페이지는 체험을 위해 제공되는 샘플 대시보드입니다. 실제 기능을 이용하시려면 회원가입을 해주세요.</span>
        <Link to="/signup" className="px-4 py-1.5 bg-white text-[#17409c] text-sm font-bold rounded-full hover:bg-gray-100 transition-colors">
          무료 회원가입
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2 font-serif tracking-tight">
              {data?.user_name || "회원"}님의 대시보드
            </h2>
            <p className="text-gray-500 font-medium">최근 100일간의 라이프로그 및 인슐린 투여 기록 분석</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-[#17409c] text-white font-bold rounded-full hover:bg-blue-800 transition-colors shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5"/>
            수동 기록
          </button>
        </div>

        {/* 1. TOP ROW: 5 Gauge Charts */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
                {pumpLogs.slice(0, 7).map((log, i) => (
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
             <div className="flex justify-between items-start mb-6">
               <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">인슐린 & 혈당 복합 트렌드</h3>
                  <p className="text-sm text-gray-500">최근 30일간의 CGM 혈당과 인슐린 주입량 비교</p>
               </div>
             </div>
             <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={[...pumpLogs].reverse().slice(-30)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                      {aiData.reasoning.map((step, idx) => (
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
    </div>
  );
}

// ... BgLogModal remains the same
function BgLogModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [value, setValue] = useState(100);
  const [tag, setTag] = useState('식전');
  
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, 16);
  const [datetime, setDatetime] = useState(localISOTime);
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // API 통신 없이 샘플 페이지이므로 즉시 성공 처리
    setTimeout(() => {
      setLoading(false);
      onSuccess();
      alert('체험용 페이지에서는 데이터가 저장되지 않습니다.');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden relative border border-white/50">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors bg-white/50 rounded-full p-1">
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-10">
          <h3 className="text-3xl font-bold font-serif text-[#17409c] mb-2">혈당 수동 입력</h3>
          <p className="text-gray-500 mb-8">연속혈당측정기가 잠시 멈췄나요? 측정한 수치를 자유롭게 남겨주세요.</p>
          
          <div className="space-y-8">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <label className="block text-sm font-bold text-[#17409c] mb-2">측정 일시 (연/월/일/시간)</label>
              <input 
                type="datetime-local" 
                value={datetime}
                onChange={e => setDatetime(e.target.value)}
                className="w-full bg-transparent border-none text-lg font-medium text-gray-900 focus:ring-0 outline-none"
              />
            </div>

            <div className="flex flex-col items-center py-4">
              <span className="text-sm font-bold text-gray-500 mb-4">혈당 수치 (mg/dL)</span>
              <input 
                type="number" 
                value={value} 
                onChange={e => setValue(Number(e.target.value))}
                className="text-7xl font-bold text-center text-[#17409c] w-full outline-none border-b-2 border-transparent focus:border-[#17409c] bg-transparent py-2 transition-colors font-serif"
              />
            </div>

            <div>
              <span className="block text-sm font-bold text-gray-500 mb-3 text-center">측정 상태 태그</span>
              <div className="flex gap-2 justify-center flex-wrap">
                {['기상직후', '공복', '식전', '식후', '취침전', '기타'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setTag(t)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${tag === t ? 'bg-[#17409c] text-white scale-105' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#17409c] hover:text-[#17409c]'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-[#17409c] text-white font-bold text-lg hover:bg-blue-800 transition-colors mt-4 disabled:opacity-50 shadow-lg"
            >
              {loading ? '저장 중...' : '이 기록 저장하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
