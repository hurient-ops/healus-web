# -*- coding: utf-8 -*-
import sys

def inject_context(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()
    
    if 'contextData={chatContext}' in c:
        return
        
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
    
    # insert before <AIChatWidget />
    c = c.replace('<AIChatWidget />', context_code + '\n      <AIChatWidget contextData={chatContext} />')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f"Injected context to {filepath}")

inject_context('src/pages/Dashboard.tsx')
inject_context('src/pages/SampleDashboard.tsx')

