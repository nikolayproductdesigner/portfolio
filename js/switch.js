// Segment control. Анимация пилюли — твой исходный код без изменений,
// только обёрнут в цикл, чтобы работал для каждого .switch на странице
// (главная: «кейсы / ui сахар», case-1: «было / стало»).
// О смене пункта свич сообщает событием 'switch:change' (detail — нажатая кнопка).
document.querySelectorAll('.switch').forEach(sw => {
  const pill = sw.querySelector('.pill');
  const items = sw.querySelectorAll('.switch-item');
  let prevOffsetLeft;

  function movePill(el) {
    pill.style.width = el.offsetWidth + 'px';
    pill.style.translate = `${el.offsetLeft - 4}px 0`;
  }

  items.forEach(el => el.addEventListener('click', () => {
    if (el.classList.contains('is-active')) return;
    items.forEach(i => i.classList.remove('is-active'));
    el.classList.add('is-active');

    const newOffsetLeft = el.offsetLeft;
    if (newOffsetLeft > prevOffsetLeft) {
      pill.style.transformOrigin = 'right center';
    } else if (newOffsetLeft < prevOffsetLeft) {
      pill.style.transformOrigin = 'left center';
    }
    prevOffsetLeft = newOffsetLeft;

    movePill(el);
    pill.classList.remove('is-moving');
    void pill.offsetWidth;
    pill.classList.add('is-moving');

    sw.dispatchEvent(new CustomEvent('switch:change', { detail: el }));
  }));

  document.fonts.ready.then(() => {
    const active = sw.querySelector('.is-active');
    movePill(active);
    prevOffsetLeft = active.offsetLeft;
  });
});

// ——— Табы (главная) ———
const tabSwitch = document.querySelector('.switch[role="tablist"]');
const panels = document.querySelectorAll('[data-tab-panel]');

if (tabSwitch && panels.length) {
  const items = tabSwitch.querySelectorAll('.switch-item');

  function showTab(name) {
    panels.forEach(p => { p.hidden = p.dataset.tabPanel !== name; });
    items.forEach(i => i.setAttribute('aria-selected', i.dataset.tab === name));
    history.replaceState(null, '', name === 'cases' ? location.pathname : '#' + name);
  }

  tabSwitch.addEventListener('switch:change', e => {
    showTab(e.detail.dataset.tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  });

  // Кнопки «смотреть» у карточки ui-работ: переключают таб (как клик по switch)
  document.querySelectorAll('[data-switch-to]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      tabSwitch.querySelector(`[data-tab="${link.dataset.switchTo}"]`).click();
    });
  });

  // Открытие по ссылке site/#ui сразу на табе «ui сахар»
  if (location.hash === '#ui') {
    items.forEach(i => i.classList.toggle('is-active', i.dataset.tab === 'ui'));
    showTab('ui');
  }
}
