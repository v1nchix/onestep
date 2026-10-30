import { execSync } from 'child_process';
execSync('pip install -q openpyxl && python structure.py', { stdio: 'inherit' });
