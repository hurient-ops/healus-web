import sys

def modify(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()

    # Find the data extraction point
    old_data_extract = """  const pumpLogs = data?.pump_logs || [];
  const latestLogs = [...pumpLogs].reverse(); // 최신(어제)이 0번 인덱스
  
  // 페이징 계산 (차트용)
  // pumpLogs는 [과거...최신] 배열
  const totalDays = pumpLogs.length;"""
  
    new_data_extract = """  const pumpLogs = data?.pump_logs || [];
  
  // KST 기준 오늘 날짜 구하기 (안전하게 로컬 시간대로 가져오기)
  const todayStr = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  
  // 오늘 데이터와 과거(어제 이전) 데이터 분리
  const todayLog = pumpLogs.find(log => log.date === todayStr) || null;
  const pastLogs = pumpLogs.filter(log => log.date !== todayStr);
  
  const latestLogs = [...pastLogs].reverse(); // 과거 데이터 중 최신(어제)이 0번 인덱스
  
  // 페이징 계산 (차트용) - 과거 데이터 기준
  const totalDays = pastLogs.length;"""
  
    c = c.replace(old_data_extract, new_data_extract)
    
    # Chart data slice
    c = c.replace("const chartData = pumpLogs.slice(startIndex, endIndex);", "const chartData = pastLogs.slice(startIndex, endIndex);")
    
    # KPI Calculations
    old_kpi = """  // KPI Calculations
  const avgBg = pumpLogs.length ? pumpLogs.reduce((acc, log) => acc + log.avg_cgm, 0) / pumpLogs.length : 110;
  const targetBgPercent = pumpLogs.length ? (pumpLogs.filter(log => log.avg_cgm >= 70 && log.avg_cgm <= 180).length / pumpLogs.length) * 100 : 0;
  const latestDay = pumpLogs.length > 0 ? pumpLogs[pumpLogs.length - 1] : null;
  const avgBasal = latestDay ? latestDay.basal : 0;
  const avgBolus = latestDay ? latestDay.bolus : 0;
  const avgAppend = latestDay ? latestDay.append : 0;"""
  
    new_kpi = """  // KPI Calculations
  // 평균 혈당, 목표 달성률은 완료된 하루인 '과거 데이터(어제까지)' 기준
  const avgBg = pastLogs.length ? pastLogs.reduce((acc, log) => acc + log.avg_cgm, 0) / pastLogs.length : 110;
  const targetBgPercent = pastLogs.length ? (pastLogs.filter(log => log.avg_cgm >= 70 && log.avg_cgm <= 180).length / pastLogs.length) * 100 : 0;
  
  // 금일 주입량은 명확히 '오늘' 데이터 기준
  const avgBasal = todayLog ? todayLog.basal : 0;
  const avgBolus = todayLog ? todayLog.bolus : 0;
  const avgAppend = todayLog ? todayLog.append : 0;"""
  
    c = c.replace(old_kpi, new_kpi)
    
    # Error Chart Processing
    c = c.replace("pumpLogs.forEach(log => {", "pastLogs.forEach(log => {")
    
    # Events filtering
    c = c.replace("pumpLogs.filter(log => log.exercise_hours > 0 || log.reception_hours > 0 || log.notes)", "pastLogs.filter(log => log.exercise_hours > 0 || log.reception_hours > 0 || log.notes)")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(c)

modify('E:/projects/healus-web/src/pages/Dashboard.tsx')
modify('E:/projects/healus-web/src/pages/SampleDashboard.tsx')
