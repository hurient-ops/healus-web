# -*- coding: utf-8 -*-
import sys

def fix_injection(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Remove bad injection
    start_bad = c.find('      const chatContext = ')
    end_bad = c.find('.trim();\n', start_bad) + 9
    
    if start_bad != -1:
        c = c[:start_bad] + c[end_bad:]
        
    c = c.replace('<AIChatWidget />', '<AIChatWidget contextData={chatContext} />')
    
    # Now insert before eturn (
    target_str = '  return (\n    <div className="min-h-screen'
    if target_str not in c:
        target_str = '  return (\n      <div className="min-h-screen'
        
    if target_str in c:
        context_code = '''
  const chatContext = 
사용자 데이터 요약 (최근 100일 기준):
- 평균 혈당:  mg/dL
- 목표 혈당 달성률: %
- 금일 기초 인슐린 주입:  U
- 금일 식사 인슐린 주입:  U
- 금일 추가 인슐린 주입:  U
.trim();
'''
        c = c.replace(target_str, context_code + '\n' + target_str)
        print(f"Fixed {filepath}")
    else:
        print(f"Could not find return block in {filepath}")
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(c)

fix_injection('src/pages/Dashboard.tsx')
fix_injection('src/pages/SampleDashboard.tsx')

