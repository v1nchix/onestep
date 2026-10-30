// Заполняем демо-таблицы примерами и снимаем процесс покадрово (кадры -> mp4 собираем локально)
// Шаг: ['rec', 0|1] выкл/вкл запись | ['expand', 0] раскрыть все группы строк | ['C9', 'текст'] вписать | ['tick', 'M9'] галочка | ['tab', 'Лист'] перейти | ['go', 'A116'] прокрутить | ['hold', n] пауза
import { chromium } from 'playwright';
import fs from 'fs';
import { TABLES } from './data.mjs';

const only = process.env.ONLY ? process.env.ONLY.split(',') : Object.keys(TABLES);
const browser = await chromium.launch();

for (const key of only) {
  const { id, steps } = TABLES[key];
  const dir = `out/frames-${key}`;
  fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'ru-RU' });
  const page = await ctx.newPage();
  try {
    await page.goto(`https://docs.google.com/spreadsheets/d/${id}/edit`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(8000);
    const go = async cell => { await page.click('#t-name-box'); await page.keyboard.type(cell); await page.keyboard.press('Enter'); await page.waitForTimeout(300); };
    const tab = async name => { await page.locator('.docs-sheet-tab', { hasText: name }).first().click(); await page.waitForTimeout(2500); await go('A1'); };
    let clip, f = 0, rec = true;
    const frame = async (times = 1) => {
      if (!rec) return;
      const p = `${dir}/${String(f++).padStart(4, '0')}.png`;
      await page.screenshot({ path: p, clip });
      for (let i = 1; i < times; i++) fs.copyFileSync(p, `${dir}/${String(f++).padStart(4, '0')}.png`);
    };
    // первый шаг всегда tab: открываем лист, прячем меню Google, считаем область таблицы
    await tab(steps[0][1]);
    await page.keyboard.press('Control+Shift+F'); await page.waitForTimeout(1500);
    const b = await page.locator('#waffle-grid-container').boundingBox();
    clip = { x: b.x, y: b.y, width: Math.min(b.width, 1440 - b.x), height: Math.min(b.height, 900 - b.y) };
    await frame(10);
    for (const [a, v] of steps.slice(1)) {
      if (a === 'rec') rec = !!v;
      else if (a === 'expand') {
        // правый клик по первому «+» группы строк -> «Развернуть все группы строк»
        const plus = page.locator('.row-gutter-plus, [class*="group-toggle"], [aria-label*="азвернуть"]').first();
        await plus.click({ button: 'right', timeout: 5000 }).catch(async () => { await page.mouse.click(13, 533, { button: 'right' }); });
        await page.waitForTimeout(800);
        await page.screenshot({ path: `out/${key}-menu.png` });
        await page.getByText(/Развернуть все группы строк/).first().click({ timeout: 5000 }).catch(e => console.log(key, 'нет пункта меню', e.message));
        await page.waitForTimeout(1500); await page.screenshot({ path: `out/${key}-expanded.png`, clip });
      }
      else if (a === 'tab') { await tab(v); await frame(8); }
      else if (a === 'go') { await go(v); await page.waitForTimeout(800); await frame(4); }
      else if (a === 'hold') { await page.waitForTimeout(1500); await frame(v); }
      else if (a === 'tick') { await go(v); await page.keyboard.press('Space'); await page.waitForTimeout(250); await frame(); }
      else {
        await go(a); await page.keyboard.press('Delete'); await page.keyboard.press('F2'); await page.waitForTimeout(250);
        const words = String(v).split(' ');
        for (let i = 0; i < words.length; i++) { await page.keyboard.type((i ? ' ' : '') + words[i]); if (words.length > 1) await frame(); }
        await page.keyboard.press('Enter'); await page.waitForTimeout(350); await frame();
      }
    }
    await page.waitForTimeout(2500);
    await frame(30);
    await page.screenshot({ path: `out/${key}-after.png`, clip });
  } catch (e) { console.log(key, 'ОШИБКА', e.message); await page.screenshot({ path: `out/${key}-error.png` }); }
  await ctx.close();
}
await browser.close();
