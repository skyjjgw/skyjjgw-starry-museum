(() => {
  const cards = document.querySelectorAll('.concept3 .partner-card');
  if (!cards.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  cards.forEach((card) => {
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const paint = () => {
      frame = 0;
      const bounds = card.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = Math.max(0, Math.min(1, (pointerX - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (pointerY - bounds.top) / bounds.height));
      card.style.setProperty('--glint-x', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--glint-y', `${(y * 100).toFixed(1)}%`);
      card.style.setProperty('--tilt-x', `${((.5 - y) * 14).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${((x - .5) * 18).toFixed(2)}deg`);
    };

    card.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      card.style.removeProperty('--glint-x');
      card.style.removeProperty('--glint-y');
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    });
  });
})();
