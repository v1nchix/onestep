// Разные скриншоты заполненных демо-таблиц для веера и окна «Подробнее».
// Кадр: [имя файла, лист, ячейка-разгон, ячейка-цель]: сначала уходим к разгону, потом к цели, чтобы цель встала у верхнего/левого края.
import { chromium } from 'playwright';
import fs from 'fs';

const SHOTS = {
  habits:   ['1SZAeDLNtjzZsrmgaD6eoPPQV4_HzWCJzhaoGFQmBsig', [['a', 'OneStep Трекер Привычек', 'A60', 'A19'], ['b', 'OneStep Трекер Привычек', 'AI20', 'Q20'], ['c', 'Инструкция', 'A1', 'A1']]],
  goals:    ['1v9XrbhrngNLV_dN4zxHgPy6Te48OWYmCJ3wdU7oLduU', [['a', 'Карта жизни', 'A1', 'A1'], ['b', 'Колесо Баланса', 'A28', 'A5'], ['c', 'Инструкция', 'A1', 'A1']]],
  finance:  ['11h0GZkno7uF84QXfKLPNXE4ldW-qtspB96SqH_WjLS0', [['a', 'Главная', 'A70', 'A30'], ['b', 'Операции', 'A1', 'A1'], ['c', 'Инструкция', 'A1', 'A1']]],
  decomp:   ['1yv2r1WM_P_KkqJtCfHhudRQi4ZTyzDVq84Z1jB56yWg', [['a', 'Декомпозиция', 'A1', 'A1'], ['b', 'Декомпозиция', 'A52', 'A25'], ['c', 'Инструкция', 'A1', 'A1']]],
  planner:  ['1nox0FHr3hQfcnBGF07ukEIGIRLJ09WUpUDAAuAvzp3k', [['a', 'Планер на месяц', 'A1', 'A1'], ['b', 'Планер на месяц', 'CG1', 'AN1'], ['c', 'Инструкция', 'A1', 'A1']]],
  finmodel: ['1kfi14f1jbpHRQYhri4gkAg2upw3xs_n051ZlUZi7olE', [['a', 'Финмодель 2025', 'A1', 'A1'], ['b', 'Финмодель 2025', 'A125', 'A82'], ['c', 'Инструкция', 'A1', 'A1']]],
};

fs.mkdirSync('out/shots', { recursive: true });
const browser = await chromium.launch();
for (const [key, [id, list]] of Object.entries(SHOTS).filter(([k]) => !process.env.ONLY || process.env.ONLY.split(',').includes(k))) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'ru-RU' });
  const page = await ctx.newPage();
  try {
    await page.goto(`https://docs.google.com/spreadsheets/d/${id}/edit`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(8000);
    const go = async cell => { await page.click('#t-name-box'); await page.keyboard.type(cell); await page.keyboard.press('Enter'); await page.waitForTimeout(500); };
    await page.keyboard.press('Control+Shift+F'); await page.waitForTimeout(1500);
    for (const [name, tab, far, target] of list) {
      await page.locator('.docs-sheet-tab').filter({ hasText: tab }).first().click(); await page.waitForTimeout(2500);
      await go(far); await go(target); await page.waitForTimeout(1500);
      const b = await page.locator('#waffle-grid-container').boundingBox();
      await page.screenshot({ path: `out/shots/${key}-${name}.png`, clip: { x: b.x, y: b.y, width: Math.min(b.width, 1440 - b.x), height: Math.min(b.height, 900 - b.y) } });
    }
  } catch (e) { console.log(key, 'ОШИБКА', e.message); }
  await ctx.close();
}
await browser.close();
