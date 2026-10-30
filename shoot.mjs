import { execSync } from 'child_process';
execSync('pip install -q openpyxl && python checkbase.py', { stdio: 'inherit' });
process.env.ONLY = 'finmodel,financeBase'; await import('./fill.mjs');
