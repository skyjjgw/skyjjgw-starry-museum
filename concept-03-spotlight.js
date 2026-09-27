(() => {
  const art = document.querySelector('.concept3-art');
  const cloud = art?.querySelector('.cloud-morph-background');
  if (!art || !cloud || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const clamp = (value) => Math.max(0, Math.min(100, value));

  function moveSpotlight(event) {
    const bounds = cloud.getBoundingClientRect();
    cloud.style.setProperty('--spot-x', `${clamp((event.clientX - bounds.left) / bounds.width * 100).toFixed(2)}%`);
    cloud.style.setProperty('--spot-y', `${clamp((event.clientY - bounds.top) / bounds.height * 100).toFixed(2)}%`);
  }

  art.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    moveSpotlight(event);
    art.classList.add('is-spotlit');
  }, { passive: true });

  function hideSpotlight() {
    art.classList.remove('is-spotlit');
  }

  art.addEventListener('pointerleave', hideSpotlight);
  window.addEventListener('blur', hideSpotlight);
})();
