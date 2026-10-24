// Слайдер «было / стало» (case-1): слой «стало» обрезается по --pos (0…100 %),
// шторку тянут мышью или пальцем по карточке, с клавиатуры — стрелками на ручке.
document.querySelectorAll('[data-compare]').forEach(box => {
  const handle = box.querySelector('.compare-handle');

  function set(pos) {
    pos = Math.min(100, Math.max(0, pos));
    box.style.setProperty('--pos', pos + '%');
    handle.setAttribute('aria-valuenow', Math.round(pos));
    handle.setAttribute('aria-valuetext', pos >= 50 ? 'стало' : 'было');
  }

  // Коэффициент zoom из js/fit.js в rect уже учтён — считаем в долях ширины
  function fromPointer(e) {
    const r = box.getBoundingClientRect();
    set((e.clientX - r.left) / r.width * 100);
  }

  box.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    box.setPointerCapture(e.pointerId);
    box.classList.add('is-dragging');
    fromPointer(e);
  });
  box.addEventListener('pointermove', e => {
    if (box.hasPointerCapture(e.pointerId)) fromPointer(e);
  });
  const stop = () => box.classList.remove('is-dragging');
  box.addEventListener('pointerup', stop);
  box.addEventListener('pointercancel', stop);

  handle.addEventListener('keydown', e => {
    const now = Number(handle.getAttribute('aria-valuenow'));
    const step = e.shiftKey ? 20 : 5;
    const next = { ArrowLeft: now - step, ArrowDown: now - step, ArrowRight: now + step, ArrowUp: now + step, Home: 0, End: 100 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    set(next);
  });

  set(Number(handle.getAttribute('aria-valuenow')));
});
