// Планер на месяц: время во всех неделях как в 1-й + список времени с шагом 15 минут (лист «Время»).
// STAGE=recon: лист «Время» + открыть проверку данных и снять экран. STAGE=all: всё целиком.
import { chromium } from 'playwright';
import fs from 'fs';

const ID = process.env.SHEET_ID;
const STAGE = process.env.STAGE || 'recon';
fs.mkdirSync('out', { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, locale: 'ru-RU', permissions: ['clipboard-read', 'clipboard-write'] });
const page = await ctx.newPage();
let n = 0;
const snap = async name => { await page.screenshot({ path: `out/${String(n++).padStart(2, '0')}-${name}.png` }); };
const dump = async name => fs.writeFileSync(`out/${name}.txt`, await page.locator('body').innerText().catch(e => e.message));
const go = async cell => { await page.click('#t-name-box'); await page.keyboard.press('Control+A'); await page.keyboard.type(cell); await page.keyboard.press('Enter'); await page.waitForTimeout(500); };
const tab = async name => { await page.locator('.docs-sheet-tab').filter({ hasText: name }).first().click(); await page.waitForTimeout(2000); };
const times = [];
for (let h = 0; h < 24; h++) for (const m of ['00', '15', '30', '45']) times.push(`${h}:${m}`);

try {
  await page.goto(`https://docs.google.com/spreadsheets/d/${ID}/edit`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(9000);
  await snap('open');

  // 1. лист «Время» со списком 0:00 … 23:45
  if (!(await page.locator('.docs-sheet-tab').filter({ hasText: /^Время$/ }).count())) {
    await page.locator('.docs-sheet-add-button').click(); await page.waitForTimeout(2500);
    await page.locator('.docs-sheet-active-tab').dblclick(); await page.waitForTimeout(600);
    await page.keyboard.press('Control+A'); await page.keyboard.type('Время'); await page.keyboard.press('Enter'); await page.waitForTimeout(1500);
    await go('A1');
    for (const t of times) { await page.keyboard.type(t); await page.keyboard.press('Enter'); }
    await page.waitForTimeout(2000);
  }
  await snap('time-sheet');

  // 2. проверка данных у понедельника 1-й недели
  await tab('Планер на месяц');
  await go('P4:P16');
  await page.getByRole('menuitem', { name: 'Данные' }).first().click(); await page.waitForTimeout(800);
  await snap('data-menu');
  await page.getByRole('menuitem', { name: /проверк/i }).first().click(); await page.waitForTimeout(2500);
  await snap('dv-sidebar');
  await dump('dv-sidebar');
  fs.writeFileSync('out/dv-html.txt', await page.locator('.waffle-sidebar-container, [role="complementary"], .docs-sidebar').first().innerHTML().catch(e => e.message));
} catch (e) { console.log('ОШИБКА', e.message); await snap('error'); await dump('error'); }
await browser.close();
