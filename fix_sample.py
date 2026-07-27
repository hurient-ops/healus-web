# -*- coding: utf-8 -*-
import sys

def fix_sample(filepath):
    with open('src/pages/Dashboard.tsx', 'r', encoding='utf-8') as f:
        dash_c = f.read()
        
    start_str = '<div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" ref={eventsScrollRef}>'
    end_str = '</div>\n          </div>\n        )}'
    
    start_idx = dash_c.find(start_str)
    end_idx = dash_c.find(end_str, start_idx)
    
    new_events_block = dash_c[start_idx:end_idx]
    
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()
        
    sample_start_idx = c.find(start_str)
    sample_end_idx = c.find(end_str, sample_start_idx)
    
    if sample_start_idx >= 0 and sample_end_idx >= 0:
        new_c = c[:sample_start_idx] + new_events_block + c[sample_end_idx:]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_c)
        print("Fixed SampleDashboard!")
    else:
        print("Could not find block in SampleDashboard")

fix_sample('src/pages/SampleDashboard.tsx')

