# -*- coding: utf-8 -*-
import sys

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()

    # 1. Fix corrupted Korean text
    c = c.replace('?이?로?기록', '라이프로그 기록')
    c = c.replace('?당', '혈당')
    c = c.replace('?면', '수면')
    c = c.replace('?트?스', '스트레스')
    c = c.replace('?이?항', '특이사항')
    
    # 2. Fix the notes placeholder and UI completely
    # First, find the notes section
    start_str = '{tab === \'notes\' && ('
    end_str = ')}'
    
    if start_str in c:
        start_idx = c.find(start_str)
        end_idx = c.find(end_str, start_idx) + 2
        
        # New Notes UI
        new_notes_ui = '''{tab === 'notes' && (
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
            )}'''
        c = c[:start_idx] + new_notes_ui + c[end_idx:]

    # 3. Center the Stress labels
    # Currently it's:
    # <div className="flex justify-between w-full px-2 text-xs font-bold text-gray-400 mb-8">
    #   <span>1 (평온)</span>
    #   <span>5 (보통)</span>
    #   <span>10 (극심)</span>
    # </div>
    
    stress_labels_old = '<div className="flex justify-between w-full px-2 text-xs font-bold text-gray-400 mb-8">\n                  <span>1 (평온)</span>\n                  <span>5 (보통)</span>\n                  <span>10 (극심)</span>\n                </div>'
    
    stress_labels_new = '<div className="grid grid-cols-3 w-full px-2 text-xs font-bold text-gray-400 mb-8">\n                  <span className="text-left">1 (평온)</span>\n                  <span className="text-center">5 (보통)</span>\n                  <span className="text-right">10 (극심)</span>\n                </div>'
    
    c = c.replace(stress_labels_old, stress_labels_new)
    
    # Let's fix the other corrupted korean:
    c = c.replace('측정 ?시', '측정 일시')
    c = c.replace('?당 ?치', '혈당 수치')
    c = c.replace('측정 ?태 ?그', '측정 상태 태그')
    c = c.replace('?전', '식전')
    c = c.replace('?후', '식후')
    c = c.replace('취침??, '기?', '취침전\', \'기타\'')
    c = c.replace('?젯??면 ?간', '어젯밤 수면 시간')
    c = c.replace('?간', '시간')
    c = c.replace('?늘???트?스', '오늘의 스트레스')
    c = c.replace('지??', '지수 ')
    c = c.replace('????..', '저장중...')
    c = c.replace('??기록 ??하?', '이 기록 저장하기')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(c)

fix_file('src/pages/Dashboard.tsx')
fix_file('src/pages/SampleDashboard.tsx')
