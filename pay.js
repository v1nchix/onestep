// Оплата: виджеты GetCourse, грузятся только по нажатию «Купить»
const PAY = {
  habits:   ['b932acf2f0f0411822bc966c9bf3b40c96e87b38', 1541902],
  goals:    ['3a31e5e656a064ca6a4ec9e2480893df497df997', 1541904],
  finance:  ['873f3379a63970041d56add7f0898b86c7a006ef', 1541910],
  finmodel: ['095058e702daf701a852722a6401a5f104c24302', 1541912],
  planner:  ['96192913f726b44d2b287af64ec121818f34bbf4', 1541914],
  decomp:   ['2575bce36c5dee34ce96d191c36b3d9e88ef4604', 1541915]
};
document.addEventListener('DOMContentLoaded', () => {
  const pay = document.getElementById('pay'), box = document.getElementById('payBox'), boxes = {};
  function openPay(key) {
    const p = PRODUCTS[key];
    document.getElementById('payName').textContent = p.name;
    document.getElementById('payPrice').textContent = rub(p.price);
    document.getElementById('payOld').textContent = rub(p.old);
    Object.values(boxes).forEach(b => b.hidden = true);
    if (!boxes[key]) {
      const wrap = document.createElement('div'), s = document.createElement('script');
      s.id = PAY[key][0];
      s.src = 'https://academy.larionovmarketing.ru/pl/lite/widget/script?id=' + PAY[key][1];
      // виджет сам стартует только на DOMContentLoaded, после подгрузки запускаем его своим событием
      s.onload = () => document.dispatchEvent(new Event('StartWidget' + PAY[key][0]));
      wrap.append(s); box.append(wrap); boxes[key] = wrap;
    }
    boxes[key].hidden = false;
    const pr = document.getElementById('product'); if (pr && pr.open) pr.close();
    pay.showModal();
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-buy]'); if (!b) return;
    e.preventDefault(); openPay(b.dataset.buy);
  });
  pay.querySelector('[data-close]').addEventListener('click', () => pay.close());
  pay.addEventListener('click', e => { if (e.target === pay) pay.close(); });
});
