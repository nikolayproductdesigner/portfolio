// Пропорционально уменьшает «собранные» блоки (ряды телефонов, коллажи, шоты),
// когда им не хватает ширины. data-fit — ширина блока в макете, px.
// Блок сохраняет десктопную раскладку и сжимается целиком через CSS zoom;
// коэффициент лежит в --fit (по нему, например, компенсируется скругление).
const fitBlocks = document.querySelectorAll('[data-fit]');

function fit(el) {
  const design = Number(el.dataset.fit);
  const available = el.parentElement.clientWidth;
  if (!available) return;            // скрытый таб: пересчитаем, когда покажется
  if (available >= design) {
    el.style.removeProperty('width');
    el.style.removeProperty('zoom');
    el.style.removeProperty('--fit');
    return;
  }
  const k = available / design;
  el.style.width = design + 'px';
  el.style.zoom = k;
  el.style.setProperty('--fit', k);
}

fitBlocks.forEach(fit);
const fitObserver = new ResizeObserver(() => fitBlocks.forEach(fit));
new Set([...fitBlocks].map(el => el.parentElement)).forEach(p => fitObserver.observe(p));
