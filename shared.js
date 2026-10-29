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

const rub = n => n.toLocaleString('ru-RU') + ' ₽';

// Окно «Подробнее»: страница даёт <dialog id="product">, внутри [data-f="..."].
function initModal() {
  const dlg = document.getElementById('product');
  if (!dlg) return;
  const list = (el, items) => { el.innerHTML = items.map(t => `<li>${t}</li>`).join(''); };
  document.querySelectorAll('[data-more]').forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    const p = PRODUCTS[btn.dataset.more];
    dlg.querySelector('[data-f=name]').textContent = p.name;
    dlg.querySelector('[data-f=price]').textContent = rub(p.price);
    dlg.querySelector('[data-f=old]').textContent = rub(p.old);
    const note = dlg.querySelector('[data-f=note]');
    note.textContent = p.note || ''; note.hidden = !p.note;
    list(dlg.querySelector('[data-f=inside]'), p.inside);
    list(dlg.querySelector('[data-f=why]'), p.why);
    list(dlg.querySelector('[data-f=fit]'), p.fit);
    dlg.querySelector('[data-f=main]').textContent = p.main;
    dlg.showModal();
  }));
  dlg.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
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
