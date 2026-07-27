# -*- coding: utf-8 -*-
import sys

def swap_events(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()
    
    start_str = '<div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" ref={eventsScrollRef}>'
    end_str = '</div>\n          </div>\n        )}'
    
    if start_str not in c:
        print(f"Error: Could not find start_str in {filepath}")
        return
        
    start_idx = c.find(start_str)
    end_idx = c.find(end_str, start_idx)
    
    events_block = c[start_idx:end_idx]
    
    # We want to separate the todayLog map and pastLogs map.
    # The todayLog starts with {(todayLog ? [todayLog] : []).filter
    today_start = events_block.find('{(todayLog ? [todayLog] : []).filter')
    past_start = events_block.find('{pastLogs.filter')
    
    if today_start == -1 or past_start == -1:
        print(f"Error: Could not find map blocks in {filepath}")
        return
        
    # extract the blocks
    today_block = events_block[today_start:past_start]
    past_block = events_block[past_start:]
    
    # Add notes icon to today_block if missing
    if 'log.notes &&' not in today_block:
        notes_icon_ui = '''
                    {log.notes && (
                      <div className="group relative flex items-center justify-center p-1 bg-white/50 rounded-md shadow-sm border border-blue-200 cursor-help">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center shadow-xl">
                          {log.notes}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}'''
        # insert before the closing div of the flex wrap container
        insert_idx = today_block.rfind('</div>\n                </div>')
        today_block = today_block[:insert_idx] + notes_icon_ui + '\n                  ' + today_block[insert_idx:]
    
    # Swap order: pastLogs FIRST, todayLog LATER
    new_events_block = start_str + '\n              ' + past_block + today_block
    
    new_c = c[:start_idx] + new_events_block + c[end_idx:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_c)
    
    print(f"Successfully swapped events in {filepath}")

swap_events('src/pages/Dashboard.tsx')
swap_events('src/pages/SampleDashboard.tsx')

