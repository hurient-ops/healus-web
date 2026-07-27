# -*- coding: utf-8 -*-
import sys

with open('src/pages/Dashboard.tsx', 'r', encoding='utf-8') as f:
    dashboard = f.read()

start_idx = dashboard.find('function BgLogModal(')
modal_code = dashboard[start_idx:]

with open('src/pages/SampleDashboard.tsx', 'r', encoding='utf-8') as f:
    sample = f.read()

sample_start = sample.find('function BgLogModal(')
if sample_start >= 0:
    new_sample = sample[:sample_start] + modal_code
    with open('src/pages/SampleDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(new_sample)
        print('Copied BgLogModal successfully.')
