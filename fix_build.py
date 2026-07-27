# -*- coding: utf-8 -*-
import sys

# Dashboard.tsx
with open('src/pages/Dashboard.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add useRef to import if missing
c = c.replace('import { useState, useEffect } from \'react\';', 'import { useState, useEffect, useRef } from \'react\';')

# Move the eventsScrollRef below pumpLogs
ref_code = 'const eventsScrollRef = useRef<HTMLDivElement>(null);\n\n  useEffect(() => {\n    if (eventsScrollRef.current) {\n      eventsScrollRef.current.scrollLeft = eventsScrollRef.current.scrollWidth;\n    }\n  }, [pumpLogs]);'

if ref_code in c:
    c = c.replace('\n  ' + ref_code, '')
    c = c.replace('const pumpLogs = data?.pump_logs || [];', 'const pumpLogs = data?.pump_logs || [];\n\n  ' + ref_code)

with open('src/pages/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

# SampleDashboard.tsx
with open('src/pages/SampleDashboard.tsx', 'r', encoding='utf-8') as f:
    c2 = f.read()

c2 = c2.replace('import { useState, useEffect } from \'react\';', 'import { useState, useEffect, useRef } from \'react\';')

if ref_code in c2:
    c2 = c2.replace('\n  ' + ref_code, '')
    c2 = c2.replace('const pumpLogs = data?.pump_logs || [];', 'const pumpLogs = data?.pump_logs || [];\n\n  ' + ref_code)

with open('src/pages/SampleDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(c2)
