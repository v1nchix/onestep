// Проход 1: скриншоты всех листов каждой демо-таблицы (компьютер 1440 и телефон 375)
import { chromium, devices } from 'playwright';
import fs from 'fs';

const SHEETS = {
  habits:   '1SZAeDLNtjzZsrmgaD6eoPPQV4_HzWCJzhaoGFQmBsig',
  goals:    '1v9XrbhrngNLV_dN4zxHgPy6Te48OWYmCJ3wdU7oLduU',
  finance:  '11h0GZkno7uF84QXfKLPNXE4ldW-qtspB96SqH_WjLS0',
  decomp:   '1yv2r1WM_P_KkqJtCfHhudRQi4ZTyzDVq84Z1jB56yWg',
  planner:  '1nox0FHr3hQfcnBGF07ukEIGIRLJ09WUpUDAAuAvzp3k',
  finmodel: '1DR3bq25I-cOjqxveSuW1UwhnLPMZMyHQEukwK6To6IE',
};
fs.mkdirSync('out', { recursive: true });
const browser = await chromium.launch();

async function shoot(key, id, mode) {
  const ctx = await browser.newContext(mode === 'pc'
    ? { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'ru-RU' }
    : { ...devices['iPhone 13'], locale: 'ru-RU' });
  const page = await ctx.newPage();
  await page.goto(`https://docs.google.com/spreadsheets/d/${id}/edit`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(8000);
  const tabs = page.locator('.docs-sheet-tab');
  const n = await tabs.count();
  const names = [];
  if (n === 0) await page.screenshot({ path: `out/${key}-${mode}-0.png` });
  for (let i = 0; i < n; i++) {
    const t = tabs.nth(i);
    names.push((await t.innerText()).trim());
    await t.click().catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `out/${key}-${mode}-${i}.png` });
  }
  fs.writeFileSync(`out/${key}-${mode}-tabs.txt`, names.join('\n'));
  await ctx.close();
}

for (const [key, id] of Object.entries(SHEETS)) {
  for (const mode of ['pc', 'phone']) {
    try { await shoot(key, id, mode); } catch (e) { console.log(key, mode, e.message); }
  }
}
await browser.close();
