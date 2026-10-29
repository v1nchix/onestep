// Общие данные и поведение для всех концептов OneStep.
// Цены и названия по документу «07. Правки на мобильную версию сайта».
const PRODUCTS = {
  habits: {
    name: 'Трекер привычек', price: 499, old: 799,
    inside: ['Трекер на весь год, история сохраняется', 'До 20+ привычек и фокус на 5 главных в месяце', 'Цели в днях: например, 10 тренировок в месяц', 'Проценты и прогресс считаются сами'],
    why: ['Не начинаешь каждый месяц с нуля', 'Цифры показывают реальность, а не ощущения'],
    fit: ['Пишешь привычки на листочках или держишь в голове', 'Хочешь дисциплину без давления', 'Хочешь видеть, что уже сделано'],
    main: 'Ты видишь свой путь и не обнуляешься каждый раз.'
  },
  goals: {
    name: 'Цели на год', price: 859, old: 1349,
    inside: ['До 100 целей по кварталам и сферам жизни', 'Колесо баланса как основа системы', 'Оцифровка текущей точки: где ты сейчас', 'Прогресс в процентах и дедлайны', 'Инструкция, как ставить цели'],
    why: ['Мечты становятся целями с датами', 'Видно перекосы по сферам жизни', 'Цели не забываются через две недели'],
    fit: ['Хочешь начать год осознанно', 'Устал(а) от целей «в голове»', 'Хочешь подводить итоги и расти'],
    main: 'Цель — это мечта с дедлайном.'
  },
  finance: {
    name: 'Финансовый трекер', price: 799, old: 1299,
    inside: ['Учёт всех доходов и расходов', 'Траты по сферам жизни', 'Личные траты можно считать отдельно', 'План расходов на следующий месяц'],
    why: ['Видно, куда реально уходят деньги', 'Появляется контроль и спокойствие'],
    fit: ['Хочешь навести порядок в деньгах', 'Знакомо «деньги опять закончились»', 'Хочешь планировать, а не угадывать'],
    main: 'Ты управляешь деньгами, а не догоняешь их.'
  },
  decomp: {
    name: 'Финансовая декомпозиция', price: 549, old: 849, note: 'Для старта и проверки бизнес-идеи',
    inside: ['Расчёт финансовой цели', 'Сколько нужно продаж и по какой цене', 'Какая нужна маржинальность', 'Сколько времени и ресурсов потребуется', 'Окупится ли идея'],
    why: ['Решение на цифрах, а не на надежде', 'Меньше риск уйти в ноль или минус'],
    fit: ['Планируешь новый проект', 'Думаешь об увольнении или вложениях', 'Хочешь понять, стоит ли начинать'],
    main: 'Эта таблица может уберечь от дорогих ошибок.'
  },
  planner: {
    name: 'Планер на месяц', price: 599, old: 899,
    inside: ['Задачи, встречи и важные дела в одной таблице', 'Дни, недели, статусы и прогресс', 'Видно реальную загрузку на месяц', 'Спокойный минималистичный дизайн'],
    why: ['Месяц раскладывается по шагам', 'Понятно, что важно, и нет распыления'],
    fit: ['Хочешь порядок в делах', 'Хочешь закрывать задачи без перегруза', 'Хочешь понимать, куда уходит время'],
    main: 'Месяц становится понятной системой, а не набором случайных дел.'
  },
  finmodel: {
    name: 'Финмодель для бизнеса', price: 1499, old: 2199, note: 'Для действующего бизнеса',
    inside: ['Все доходы и расходы бизнеса', 'Реклама, ФОТ, подрядчики', 'Налоги, сервисы, подписки', 'Прибыль и маржинальность по месяцам'],
    why: ['Бизнес перестаёт жить «на ощущениях»', 'Видно, где зарабатываешь, а где теряешь'],
    fit: ['Уже ведёшь бизнес', 'Работаешь с командой или подрядчиками', 'Хочешь знать чистую прибыль'],
    main: 'Видно, сколько бизнес реально приносит денег.'
  }
};

// Окно таблицы: короткое описание, три шага «как это работает» и слайды.
// Слайды: картинки сейчас, позже сюда встанут видео (.mp4) с демо-таблиц.
const DETAILS = {
  habits: { desc: 'Отмечай привычки и смотри прогресс по месяцам и за год.', how: ['Отмечаешь привычку галочкой, это 5 секунд в день', 'Проценты и прогресс за месяц считаются сами', 'История сохраняется: видно, как меняется весь год'], media: ['img/habits.webp'] },
  goals: { desc: 'Цели по всем сферам жизни, с кварталами и дедлайнами.', how: ['Оцениваешь сферы жизни в колесе баланса', 'Ставишь цели по кварталам и с дедлайнами', 'Отмечаешь шаги, прогресс считается в процентах'], media: ['img/goals.webp'] },
  finance: { desc: 'Доходы, расходы и план трат на следующий месяц.', how: ['Вписываешь доходы и траты по категориям', 'Таблица показывает, куда уходят деньги', 'Планируешь бюджет на следующий месяц'], media: ['img/finance.webp'] },
  decomp: { desc: 'Посчитай, окупится ли идея, до того как вкладывать деньги.', how: ['Вписываешь цель по деньгам и цену продукта', 'Таблица считает, сколько нужно продаж и клиентов', 'Видишь, окупится ли идея, ещё до вложений'], media: ['img/decomp.webp'] },
  planner: { desc: 'Задачи, встречи и приоритеты месяца в одной таблице.', how: ['Записываешь задачи и встречи по дням', 'Ставишь статусы и видишь загрузку недели', 'Месяц раскладывается по шагам без перегруза'], media: ['img/planner.webp'] },
  finmodel: { desc: 'Прибыль, маржинальность и все расходы бизнеса по месяцам.', how: ['Вносишь доходы и расходы бизнеса по месяцам', 'Реклама, зарплаты, налоги и подписки в одной картине', 'Таблица считает прибыль и маржинальность'], media: ['img/finmodel.webp'] }
};

const rub = n => n.toLocaleString('ru-RU') + ' ₽';

// Окно «Подробнее»: страница даёт <dialog id="product">, внутри [data-f="..."].
function initModal() {
  const dlg = document.getElementById('product');
  if (!dlg) return;
  const list = (el, items) => { if (el) el.innerHTML = items.map(t => `<li>${t}</li>`).join(''); };
  const fill = (f, text) => dlg.querySelectorAll(`[data-f=${f}]`).forEach(el => { el.textContent = text || ''; el.hidden = !text; });
  const track = dlg.querySelector('[data-f=media]');
  const count = dlg.querySelector('[data-f=count]');
  let slide = 0, slides = [];
  function show(i) {
    slide = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${slide * 100}%)`;
    if (count) count.textContent = `${slide + 1} / ${slides.length}`;
    track.querySelectorAll('video').forEach((v, k) => k === slide ? v.play().catch(() => {}) : v.pause());
  }
  dlg.querySelectorAll('[data-slide]').forEach(b => b.addEventListener('click', () => show(slide + +b.dataset.slide)));
  document.querySelectorAll('[data-more]').forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    const key = btn.dataset.more, p = PRODUCTS[key], d = DETAILS[key];
    fill('name', p.name);
    fill('price', rub(p.price));
    fill('old', rub(p.old));
    fill('note', p.note);
    fill('desc', d.desc);
    fill('main', p.main);
    list(dlg.querySelector('[data-f=how]'), d.how);
    list(dlg.querySelector('[data-f=inside]'), p.inside);
    list(dlg.querySelector('[data-f=why]'), p.why);
    list(dlg.querySelector('[data-f=fit]'), p.fit);
    dlg.querySelectorAll('[data-buy-from-modal]').forEach(b => b.dataset.buy = key);
    if (track) {
      slides = d.media;
      track.innerHTML = slides.map(src => /\.mp4$/.test(src)
        ? `<video src="${src}" muted playsinline loop preload="metadata"></video>`
        : `<img src="${src}" alt="${p.name}: как выглядит таблица">`).join('');
      dlg.classList.toggle('one-slide', slides.length < 2);
    }
    dlg.showModal();
    if (track) show(0);
  }));
  dlg.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => track && track.querySelectorAll('video').forEach(v => v.pause()));
}

// Плавное появление блоков при прокрутке, и на ПК, и на телефоне.
function initReveal() {
  const els = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach(el => io.observe(el));
}

document.documentElement.classList.add('js');
document.addEventListener('DOMContentLoaded', () => { initModal(); initReveal(); });
