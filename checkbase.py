import urllib.request, openpyxl
urllib.request.urlretrieve('https://docs.google.com/spreadsheets/d/11h0GZkno7uF84QXfKLPNXE4ldW-qtspB96SqH_WjLS0/export?format=xlsx', 'out/fin.xlsx')
wb = openpyxl.load_workbook('out/fin.xlsx')
with open('out/base.txt', 'w', encoding='utf-8') as f:
    for n in ['База', 'Операции']:
        ws = wb[n]
        f.write(f'## {n} protected={ws.protection.sheet} hidden={ws.sheet_state}\n')
        for r in ws.iter_rows(min_row=1, max_row=14, max_col=12, values_only=True):
            if any(v is not None for v in r): f.write(str(r)[:300] + '\n')
