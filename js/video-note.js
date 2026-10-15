// Видео-кружок на главной: клик по аватарке → оверлей с кружком, как в Telegram.
// Пока вместо видео картинка — прогресс-бар имитирует воспроизведение.
// Когда появится видео, замени <img class="video-note-media"> на <video class="video-note-media">:
// прогресс пойдёт по реальному времени, клик по кружку — пауза / продолжить.
const dialog = document.querySelector('.video-note');
const opener = document.querySelector('.hero-loom-button');
const circle = dialog.querySelector('.video-note-circle');
const video = dialog.querySelector('video.video-note-media');

const FAKE_DURATION = 20000; // мс, один «проигрыш» заглушки
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let rafId = 0;

function setProgress(value) {
  circle.style.setProperty('--progress', value);
}

function startFake() {
  if (reducedMotion.matches) { setProgress(0.5); return; } // статично, как в макете
  const start = performance.now();
  const tick = now => {
    setProgress(((now - start) % FAKE_DURATION) / FAKE_DURATION);
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);
}

function open() {
  dialog.showModal();
  setProgress(0);
  if (video) {
    video.currentTime = 0;
    video.play().catch(() => {});
  } else {
    startFake();
  }
}

function reset() {
  cancelAnimationFrame(rafId);
  if (video) video.pause();
  setProgress(0);
}

opener.addEventListener('click', open);
dialog.addEventListener('close', reset); // и кнопка, и Esc, и клик мимо

dialog.addEventListener('click', e => {
  if (e.target.closest('[data-close]') || !e.target.closest('.video-note-circle, .main-header')) {
    dialog.close();
  }
});

if (video) {
  video.addEventListener('timeupdate', () => {
    if (video.duration) setProgress(video.currentTime / video.duration);
  });
  video.addEventListener('ended', () => setProgress(1));
  circle.addEventListener('click', () => (video.paused ? video.play() : video.pause()));
  circle.style.cursor = 'pointer';
}
