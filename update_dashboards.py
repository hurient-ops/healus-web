# -*- coding: utf-8 -*-
import sys

# 1. Dashboard.tsx
with open('src/pages/Dashboard.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

if 'window.scrollTo(0, 0);' not in c:
    c = c.replace('useEffect(() => {\n    fetchDashboard();', 'useEffect(() => {\n    window.scrollTo(0, 0);\n    fetchDashboard();')

c = c.replace('const avgBg = pastLogs.length ? pastLogs.reduce((acc, log) => acc + log.avg_cgm, 0) / pastLogs.length : 110;', 'const avgBg = pastLogs.length ? pastLogs.reduce((acc, log) => acc + log.avg_cgm, 0) / pastLogs.length : 0;')

if 'eventsScrollRef' not in c:
    c = c.replace('const [pageOffset, setPageOffset] = useState(0);', 'const [pageOffset, setPageOffset] = useState(0);\n  const eventsScrollRef = useRef<HTMLDivElement>(null);\n\n  useEffect(() => {\n    if (eventsScrollRef.current) {\n      eventsScrollRef.current.scrollLeft = eventsScrollRef.current.scrollWidth;\n    }\n  }, [pumpLogs]);')

c = c.replace('<div className=\"flex gap-4 overflow-x-auto pb-2 scrollbar-hide\">', '<div className=\"flex gap-4 overflow-x-auto pb-2 scrollbar-hide\" ref={eventsScrollRef}>')

if 'tab === \'notes\'' not in c:
    c = c.replace('const [tab, setTab] = useState<\'bg\' | \'sleep\' | \'stress\'>(\'bg\');', 'const [tab, setTab] = useState<\'bg\' | \'sleep\' | \'stress\' | \'notes\'>(\'bg\');')
    c = c.replace('const [tag, setTag] = useState<string>(\'식후\');', 'const [tag, setTag] = useState<string>(\'식후\');\n  const [noteText, setNoteText] = useState<string>(\'\');')
    c = c.replace('value: value,', 'value: tab === \'notes\' ? noteText : value,')
    c = c.replace('<button onClick={() => {setTab(\'stress\'); setValue(5);}} className={lex-1 py-2 md:py-3 font-bold text-sm md:text-base rounded-lg transition-colors }>스트레스</button>', '<button onClick={() => {setTab(\'stress\'); setValue(5);}} className={lex-1 py-2 md:py-3 font-bold text-sm md:text-base rounded-lg transition-colors }>스트레스</button>\n            <button onClick={() => {setTab(\'notes\'); setNoteText(\'\');}} className={lex-1 py-2 md:py-3 font-bold text-sm md:text-base rounded-lg transition-colors }>특이사항</button>')
    
    notes_ui = '''
            {tab === 'notes' && (
              <div className="flex flex-col items-center py-4">
                <span className="text-sm font-bold text-gray-500 mb-4">특이사항 메모</span>
                <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="회식, 과식, 운동 등 특이사항을 자유롭게 기록해보세요." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-base md:text-lg font-medium text-gray-900 focus:ring-2 focus:ring-[#17409c] outline-none min-h-[150px] resize-none"></textarea>
              </div>
            )}
            '''
    c = c.replace('<button onClick={handleSubmit}', notes_ui + '<button onClick={handleSubmit}')

with open('src/pages/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

# 2. SampleDashboard.tsx
with open('src/pages/SampleDashboard.tsx', 'r', encoding='utf-8') as f:
    c2 = f.read()

if 'window.scrollTo(0, 0);' not in c2:
    # Find a good place to put it
    c2 = c2.replace('const [isModalOpen, setIsModalOpen] = useState(false);', 'const [isModalOpen, setIsModalOpen] = useState(false);\n  useEffect(() => {\n    window.scrollTo(0, 0);\n  }, []);')

c2 = c2.replace('const avgBg = pastLogs.length ? pastLogs.reduce((acc, log) => acc + log.avg_cgm, 0) / pastLogs.length : 110;', 'const avgBg = pastLogs.length ? pastLogs.reduce((acc, log) => acc + log.avg_cgm, 0) / pastLogs.length : 0;')

if 'eventsScrollRef' not in c2:
    c2 = c2.replace('const [pageOffset, setPageOffset] = useState(0);', 'const [pageOffset, setPageOffset] = useState(0);\n  const eventsScrollRef = useRef<HTMLDivElement>(null);\n\n  useEffect(() => {\n    if (eventsScrollRef.current) {\n      eventsScrollRef.current.scrollLeft = eventsScrollRef.current.scrollWidth;\n    }\n  }, [pumpLogs]);')
c2 = c2.replace('<div className=\"flex gap-4 overflow-x-auto pb-2 scrollbar-hide\">', '<div className=\"flex gap-4 overflow-x-auto pb-2 scrollbar-hide\" ref={eventsScrollRef}>')

with open('src/pages/SampleDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(c2)

