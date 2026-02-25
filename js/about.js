(() => {
  const stack = document.querySelector('.card-photo-stack');
  if (!stack) return;

  const photos = [...stack.querySelectorAll('.card-photo')];
  if (photos.length < 2) return;

  let active = 0;
  let busy = false;
  let autoTimer = null;
  const autoDelayMs = 3400;

  const applyPositions = () => {
    photos.forEach((photo, idx) => {
      const relative = (idx - active + photos.length) % photos.length;
      photo.dataset.pos = String(relative);
      photo.setAttribute('aria-hidden', relative === 0 ? 'false' : 'true');
    });
  };

  const advance = () => {
    if (busy) return;
    busy = true;

    const current = photos[active];
    current.classList.add('is-leaving');

    window.setTimeout(() => {
      current.classList.remove('is-leaving');
      active = (active + 1) % photos.length;
      applyPositions();
      busy = false;
    }, 210);
  };

  const startAuto = () => {
    if (autoTimer) window.clearInterval(autoTimer);
    autoTimer = window.setInterval(advance, autoDelayMs);
  };

  applyPositions();
  stack.addEventListener('click', advance);
  stack.addEventListener('click', startAuto);
  stack.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      advance();
      startAuto();
    }
  });
  stack.addEventListener('mouseenter', () => {
    if (autoTimer) window.clearInterval(autoTimer);
  });
  stack.addEventListener('mouseleave', startAuto);

  startAuto();
})();
