// Пилот: заполняем демо «Трекер привычек» и снимаем процесс покадрово (кадры -> mp4)
import { chromium } from 'playwright';
import fs from 'fs';

const ID = '1SZAeDLNtjzZsrmgaD6eoPPQV4_HzWCJzhaoGFQmBsig';
const TAB = 'OneStep Трекер Привычек';
const HABITS = ['Выпить 2 литра воды', '10 000 шагов', 'Читать 20 минут', 'Без сладкого', 'Лечь до 23:00'];
const DAYS = 18; // заполнено «до сегодня»
// у каждой привычки свой ритм, чтобы прогресс выглядел живым (1 = галочка)
const MISS = [[6, 13], [3, 10, 16], [5, 11, 12], [2, 8, 9, 15], [4, 14]];
const COL = d => { let n = 4 + d, s = ''; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }; // день 1 = E

fs.mkdirSync('out/frames', { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'ru-RU' });
await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'https://docs.google.com' });
const page = await ctx.newPage();
await page.goto(`https://docs.google.com/spreadsheets/d/${ID}/edit`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(8000);
await page.locator('.docs-sheet-tab', { hasText: TAB }).first().click();
await page.waitForTimeout(2000);
await page.keyboard.press('Control+Shift+F'); // скрыть меню Google
await page.waitForTimeout(1500);

const box = await page.locator('#waffle-grid-container').boundingBox().catch(() => null);
const clip = box ? { x: box.x, y: box.y, width: Math.min(box.width, 1440 - box.x), height: Math.min(box.height, 900 - box.y) } : undefined;
fs.writeFileSync('out/clip.json', JSON.stringify(clip));
let f = 0;
const frame = async (times = 1) => { const p = `out/frames/${String(f++).padStart(4, '0')}.png`; await page.screenshot({ path: p, clip }); for (let i = 1; i < times; i++) fs.copyFileSync(p, `out/frames/${String(f++).padStart(4, '0')}.png`); };
const go = async cell => { await page.click('#t-name-box'); await page.keyboard.type(cell); await page.keyboard.press('Enter'); await page.waitForTimeout(250); };

// сброс прошлого прогона: галочки и названия привычек
// чистые флажки берём из строки 27 (там пусто) и вставляем в 22–26
await go('E27:AI27'); await page.keyboard.press('Control+C'); await page.waitForTimeout(800);
await go('E22:AI26'); await page.keyboard.press('Control+V'); await page.waitForTimeout(2000);
await page.screenshot({ path: 'out/reset.png', clip });
await go('C22:C26'); await page.keyboard.press('Delete'); await page.waitForTimeout(1500);
await go('A1'); await page.waitForTimeout(1000);
await page.screenshot({ path: 'out/before.png', clip });
await frame(12);
// 1. Вписываем привычки
for (let r = 0; r < HABITS.length; r++) {
  await go(`C${22 + r}`); await page.keyboard.press('F2'); await page.waitForTimeout(300);
  for (const ch of HABITS[r]) { await page.keyboard.type(ch); if (ch !== ' ') await frame(); }
  await page.keyboard.press('Enter'); await page.waitForTimeout(400); await frame(3);
}
// 2. Ставим галочки день за днём
for (let d = 1; d <= DAYS; d++) {
  for (let r = 0; r < HABITS.length; r++) {
    if (MISS[r].includes(d)) continue;
    await go(`${COL(d)}${22 + r}`);
    await page.keyboard.press('Space'); await page.waitForTimeout(150);
  }
  await go('A1'); await page.waitForTimeout(700); await frame(2);
}
await page.waitForTimeout(2500);
await frame(30);
await page.screenshot({ path: 'out/habits-after.png', clip });
await page.screenshot({ path: 'out/habits-full.png' });
await browser.close();

