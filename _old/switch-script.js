const sw = document.querySelector('.switch');
const pill = sw.querySelector('.pill');
const items = sw.querySelectorAll('.switch-item');
let prevOffsetLeft;

function movePill(el) {
  pill.style.width = el.offsetWidth + 'px';
  pill.style.translate = `${el.offsetLeft - 4}px 0`;
}

items.forEach(el => el.addEventListener('click', () => {
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
}));

document.fonts.ready.then(() => {
  const active = sw.querySelector('.is-active');
  movePill(active);
  prevOffsetLeft = active.offsetLeft;
});