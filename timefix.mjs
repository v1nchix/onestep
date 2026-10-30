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
  if (!(await page.locator('.docs-sheet-tab').filter({ hasText: 'Время' }).count())) {
    await page.locator('.docs-sheet-add-button').click(); await page.waitForTimeout(2500);
    await page.locator('.docs-sheet-active-tab').dblclick(); await page.waitForTimeout(600);
    await page.keyboard.press('Control+A'); await page.keyboard.type('Время'); await page.keyboard.press('Enter'); await page.waitForTimeout(1500);
    await go('A1');
    for (const t of times) { await page.keyboard.type(t); await page.keyboard.press('Enter'); }
    await page.waitForTimeout(2000);
  }
  await snap('time-sheet');

  await tab('Планер на месяц');
  const okDialog = async () => { // предупреждение о защищённом диапазоне
    const ok = page.getByRole('button', { name: /^(ОК|OK)$/ });
    if (await ok.count()) { await snap('dialog'); await ok.first().click(); await page.waitForTimeout(800); }
  };

  if (STAGE === 'all') {
    // 2. недели 3–5 по образцу 1-й недели (копия блока дней: объединения, формат, флажки, условное форматирование)
    await go('P4:BS16'); await page.keyboard.press('Control+C'); await page.waitForTimeout(1500);
    for (const top of [62, 91]) { await go(`P${top}`); await page.keyboard.press('Control+V'); await page.waitForTimeout(3000); await okDialog(); }
    await go('P4:AM16'); await page.keyboard.press('Control+C'); await page.waitForTimeout(1500);
    await go('P120'); await page.keyboard.press('Control+V'); await page.waitForTimeout(3000); await okDialog();
    for (const top of [62, 91, 120]) { await go(`P${top + 1}:P${top + 12}`); await page.keyboard.press('Delete'); await page.waitForTimeout(800); } // без чужих 6:00
    await page.keyboard.press('Escape');
    await go('P60'); await snap('pasted-w3'); await go('P118'); await snap('pasted-w5');
  }

  // 3. одно правило «список из диапазона» на все ячейки времени
  const ranges = [];
  for (const top of [4, 33, 62, 91]) for (const c of ['P', 'X', 'AF', 'AN', 'AV', 'BD', 'BL']) ranges.push(`${c}${top}:${c}${top + 12}`);
  for (const c of ['P', 'X', 'AF']) ranges.push(`${c}120:${c}132`);
  await go('P4');
  await page.getByRole('menuitem', { name: 'Данные' }).first().click(); await page.waitForTimeout(800);
  await page.getByRole('menuitem', { name: /проверк/i }).first().click(); await page.waitForTimeout(2500);
  await page.getByText('P4:P16', { exact: true }).first().click(); await page.waitForTimeout(2000);
  await snap('dv-editor'); await dump('dv-editor');
  fs.writeFileSync('out/dv-inputs.json', JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('input, [role="listbox"], [role="combobox"], [role="radio"], button')].filter(e => e.offsetParent && e.getBoundingClientRect().x > 1200).map(e => ({ tag: e.tagName, role: e.getAttribute('role'), aria: e.getAttribute('aria-label'), val: e.value, text: (e.innerText || '').slice(0, 60), ph: e.getAttribute('placeholder'), cls: e.className.toString().slice(0, 80) }))), null, 1));
  if (STAGE === 'all') {
    // диапазон применения
    const idx = await page.evaluate(() => [...document.querySelectorAll('input')].findIndex(e => e.value === 'P4:P16'));
    const ri = page.locator('input').nth(idx);
    await ri.click(); await ri.fill(ranges.join(',')); await page.keyboard.press('Tab'); await page.waitForTimeout(800);
    await snap('dv-range');
    // критерий: список из диапазона
    await page.getByText('Раскрывающийся список', { exact: true }).first().click(); await page.waitForTimeout(800);
    await snap('dv-criteria-open');
    await page.getByRole('option', { name: /из диапазона/ }).first().click(); await page.waitForTimeout(1200);
    await snap('dv-criteria');
    const src = await page.evaluate(() => [...document.querySelectorAll('input')].findIndex(e => e.offsetParent && e.getBoundingClientRect().x > 1200 && e.value === ''));
    const si = page.locator('input').nth(src);
    await si.click(); await si.fill("'Время'!A1:A96"); await page.keyboard.press('Tab'); await page.waitForTimeout(800);
    // расширенные параметры: при другом времени только предупреждение, ввод не запрещаем
    await page.getByText(/Расширенные параметры/).first().click().catch(() => {}); await page.waitForTimeout(800);
    await page.getByText(/Показывать предупреждение/).first().click(); await page.waitForTimeout(500);
    await snap('dv-filled'); await dump('dv-filled');
    await page.getByRole('button', { name: 'Готово' }).first().click(); await page.waitForTimeout(2500);
    await snap('dv-done');
    // 4. спрятать лист «Время»
    await page.locator('.docs-sheet-tab').filter({ hasText: 'Время' }).first().click({ button: 'right' }); await page.waitForTimeout(700);
    await page.getByText('Скрыть лист', { exact: true }).first().click(); await page.waitForTimeout(2500);
    await go('P60'); await page.keyboard.press('Escape'); await snap('final');
  }
} catch (e) { console.log('ОШИБКА', e.message); await snap('error'); await dump('error'); }
await browser.close();
