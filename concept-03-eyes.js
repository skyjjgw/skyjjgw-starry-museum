(() => {
  const mascot = document.querySelector('.concept3-art .mascot-stage');
  if (!mascot || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let pointer = null;
  let frame = 0;
  const clamp = (value) => Math.max(-1, Math.min(1, value));

  function updateGaze() {
    frame = 0;
    if (!pointer) return;
    const bounds = mascot.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height * .45;
    const x = clamp((pointer.x - centerX) / Math.max(140, innerWidth * .18));
    const y = clamp((pointer.y - centerY) / Math.max(120, innerHeight * .2));
    mascot.style.setProperty('--gaze-x', `${(x * bounds.width * .019).toFixed(2)}px`);
    mascot.style.setProperty('--gaze-y', `${(y * bounds.height * .016).toFixed(2)}px`);
  }

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    pointer = { x: event.clientX, y: event.clientY };
    if (!frame) frame = requestAnimationFrame(updateGaze);
  }, { passive: true });

  function resetGaze() {
    pointer = null;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    mascot.style.setProperty('--gaze-x', '0px');
    mascot.style.setProperty('--gaze-y', '0px');
  }

  document.addEventListener('mouseleave', resetGaze);
  window.addEventListener('blur', resetGaze);
})();
