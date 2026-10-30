// Разные скриншоты заполненных демо-таблиц для веера и окна «Подробнее».
// Кадр: [имя файла, лист, ячейка-разгон, ячейка-цель]: сначала уходим к разгону, потом к цели, чтобы цель встала у верхнего/левого края.
import { chromium } from 'playwright';
import fs from 'fs';

const SHOTS = {
  habits:   ['1SZAeDLNtjzZsrmgaD6eoPPQV4_HzWCJzhaoGFQmBsig', [['b', 'OneStep Трекер Привычек', 'AI20', 'Q20']]],
  goals:    ['1v9XrbhrngNLV_dN4zxHgPy6Te48OWYmCJ3wdU7oLduU', [['a', 'Карта жизни', 'A1', 'A1'], ['b', 'Колесо Баланса', 'A28', 'A5']]],
  finance:  ['11h0GZkno7uF84QXfKLPNXE4ldW-qtspB96SqH_WjLS0', [['d', 'Главная', 'A60', 'A19']]],
  finmodel: ['1kfi14f1jbpHRQYhri4gkAg2upw3xs_n051ZlUZi7olE', [['b', 'Финмодель 2025', 'A125', 'A100']]],
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
