# Выгружает xlsx демо-таблиц и печатает структуру нужных листов: адрес, значение/формула, проверки данных
import urllib.request, openpyxl, os, sys
SHEETS = {
  'goals':    ('1v9XrbhrngNLV_dN4zxHgPy6Te48OWYmCJ3wdU7oLduU', ['Колесо Баланса', 'Карта жизни', 'Все хотелки']),
  'finance':  ('11h0GZkno7uF84QXfKLPNXE4ldW-qtspB96SqH_WjLS0', ['Главная', 'Операции']),
  'decomp':   ('1yv2r1WM_P_KkqJtCfHhudRQi4ZTyzDVq84Z1jB56yWg', ['Декомпозиция', '1']),
  'planner':  ('1nox0FHr3hQfcnBGF07ukEIGIRLJ09WUpUDAAuAvzp3k', ['Планер на месяц']),
  'finmodel': ('1DR3bq25I-cOjqxveSuW1UwhnLPMZMyHQEukwK6To6IE', ['Финмодель 2025']),
}
os.makedirs('out', exist_ok=True)
for key, (fid, tabs) in SHEETS.items():
    path = f'out/{key}.xlsx'
    urllib.request.urlretrieve(f'https://docs.google.com/spreadsheets/d/{fid}/export?format=xlsx', path)
    wb = openpyxl.load_workbook(path)
    with open(f'out/{key}-structure.txt', 'w', encoding='utf-8') as out:
        for t in tabs:
            if t not in wb.sheetnames: out.write(f'### нет листа {t}\n'); continue
            ws = wb[t]
            out.write(f'### {t}  dims={ws.dimensions}\n')
            for dv in ws.data_validations.dataValidation:
                out.write(f'DV {dv.type} {str(dv.formula1)[:80]} @ {str(dv.sqref)[:120]}\n')
            out.write('MERGED ' + ' '.join(str(m) for m in list(ws.merged_cells.ranges)[:80]) + '\n')
            for row in ws.iter_rows(max_row=min(ws.max_row, 120), max_col=min(ws.max_column, 40)):
                cells = [f'{c.coordinate}={str(c.value)[:50]!r}' for c in row if c.value is not None]
                if cells: out.write(' | '.join(cells)[:1500] + '\n')
