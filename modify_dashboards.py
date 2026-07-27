import re
import sys

def modify_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Imports
    content = content.replace("ArrowRight, Loader2, Moon, Zap, Plus, Camera, FileDown", "ArrowRight, Loader2, Moon, Zap, Plus, Camera, FileDown, MessageSquare, ChevronLeft, ChevronRight")
    
    # 2. PumpLog Interface
    interface_old = """  exercise_hours: number;
  event_tags: string | null;
  error_count: number;"""
    interface_new = """  exercise_hours: number;
  reception_hours: number;
  event_tags: string | null;
  notes: string | null;
  error_count: number;"""
    content = content.replace(interface_old, interface_new)
    
    # 3. pageOffset state
    state_old = """  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();"""
    state_new = """  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageOffset, setPageOffset] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();"""
    content = content.replace(state_old, state_new)
    
    # 4. Sorting logic & Top 7
    # Original: pumpLogs.slice(0, 7)
    # pumpLogs is oldest->newest. We need newest->oldest for 7 days.
    # We will define `reversedLogs` at the top of the render block.
    
    content = content.replace("const pumpLogs = data?.pump_logs || [];", """const pumpLogs = data?.pump_logs || [];
  const latestLogs = [...pumpLogs].reverse(); // 최신(어제)이 0번 인덱스
  
  // 페이징 계산 (차트용)
  // pumpLogs는 [과거...최신] 배열
  const totalDays = pumpLogs.length;
  const maxPage = Math.max(0, Math.ceil(totalDays / 30) - 1);
  const startIndex = Math.max(0, totalDays - 30 * (pageOffset + 1));
  const endIndex = totalDays - 30 * pageOffset;
  const chartData = pumpLogs.slice(startIndex, endIndex);""")
    
    content = content.replace("pumpLogs.slice(0, 7).map(", "latestLogs.slice(0, 7).map(")
    
    # 5. Trend Chart Pagination UI & Data
    trend_header_old = """             <div className="flex justify-between items-start mb-6">
               <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">인슐린 & 혈당 복합 트렌드</h3>
                  <p className="text-sm text-gray-500">최근 30일간의 CGM 혈당과 인슐린 주입량 비교</p>
               </div>
             </div>"""
             
    trend_header_new = """             <div className="flex justify-between items-center mb-6">
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
             </div>"""
    content = content.replace(trend_header_old, trend_header_new)
    
    # Trend chart data replace
    content = content.replace("<ComposedChart data={[...pumpLogs].reverse().slice(-30)}", "<ComposedChart data={chartData}")
    
    # 6. Recent Events logic & badges
    events_filter_old = "pumpLogs.filter(log => log.event_tags || log.exercise_hours > 0)"
    events_filter_new = "pumpLogs.filter(log => log.exercise_hours > 0 || log.reception_hours > 0 || log.notes)"
    content = content.replace(events_filter_old, events_filter_new)
    content = content.replace(events_filter_old, events_filter_new) # Replace twice (one for if, one for map)
    
    # We want it chronologically, but the newest at the FAR RIGHT.
    # In a flex row, if it overflows, the rightmost might be hidden. 
    # Actually `pumpLogs` is oldest->newest, so the map will render oldest on left, newest on right natively!
    # But wait, it uses `.slice(0, 10)`. We should slice the LAST 10.
    events_map_old = "events_filter_new.slice(0, 10).map("
    events_map_new = "events_filter_new.slice(-15).map(" # Let's show up to 15
    # Let's just regex replace the mapping part.
    
    # Replace the badge rendering block
    badge_block_old = """                  <div className="flex gap-2 flex-wrap mt-1">
                    {log.exercise_hours > 0 && (
                      <span className="text-sm font-bold text-emerald-600 bg-emerald-100/80 px-2.5 py-1 rounded-lg">운동 {log.exercise_hours}h</span>
                    )}
                    {log.event_tags && log.event_tags.split(',').map((t: string, i: number) => (
                      <span key={i} className="text-sm font-bold text-purple-600 bg-purple-100/80 px-2.5 py-1 rounded-lg">{t.trim()}</span>
                    ))}
                  </div>"""
                  
    badge_block_new = """                  <div className="flex gap-2 flex-wrap mt-1 items-center">
                    {log.exercise_hours > 0 && (
                      <span className="text-sm font-bold text-emerald-600 bg-emerald-100/80 px-2.5 py-1 rounded-lg shadow-sm">운동 {log.exercise_hours}h</span>
                    )}
                    {log.reception_hours > 0 && (
                      <span className="text-sm font-bold text-orange-600 bg-orange-100/80 px-2.5 py-1 rounded-lg shadow-sm">회식 {log.reception_hours}h</span>
                    )}
                    {log.notes && (
                      <div className="group relative flex items-center justify-center p-1 bg-white rounded-md shadow-sm border border-gray-200 cursor-help">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center shadow-xl">
                          {log.notes}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>"""
    content = content.replace(badge_block_old, badge_block_new)
    
    # Fix the slice part
    content = re.sub(r'pumpLogs\.filter\([^)]+\)\.slice\([^)]+\)\.map', 'pumpLogs.filter(log => log.exercise_hours > 0 || log.reception_hours > 0 || log.notes).slice(-15).map', content)

    # Tooltip update
    tooltip_old = """          {(log.event_tags || log.error_count > 0) && (
            <div className="mt-2 pt-2 border-t flex flex-wrap gap-1">
              {log.event_tags?.split(',').map((t: string) => <span key={t} className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">{t}</span>)}
              {log.error_count > 0 && <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">오류 {log.error_count}건</span>}
            </div>
          )}"""
    tooltip_new = """          {(log.exercise_hours > 0 || log.reception_hours > 0 || log.notes || log.error_count > 0) && (
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
          )}"""
    content = content.replace(tooltip_old, tooltip_new)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
modify_file('E:/projects/healus-web/src/pages/Dashboard.tsx')
modify_file('E:/projects/healus-web/src/pages/SampleDashboard.tsx')
print("Done modifying both dashboards.")
