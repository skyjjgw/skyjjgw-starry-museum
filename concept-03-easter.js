(() => {
  const art = document.querySelector('.concept3-art');
  if (!art) return;
  const cloud = art.querySelector('.cloud-morph-background');
  const stars = [...art.querySelectorAll('[data-egg-star]')];
  const dots = [...art.querySelectorAll('.egg-progress i')];
  const hint = art.querySelector('[data-egg-hint]');
  const progress = art.querySelector('[data-egg-progress]');
  const countText = art.querySelector('[data-egg-count]');
  const card = art.querySelector('[data-egg-card]');
  const restart = art.querySelector('[data-egg-restart]');
  const canvas = art.querySelector('[data-egg-canvas]');
  const scratchStatus = art.querySelector('[data-egg-scratch-status]');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  let scratching = false;
  let revealed = false;
  let strokes = 0;

  function moveLight(event) {
    if (!card.hidden) return;
    const bounds = cloud.getBoundingClientRect();
    cloud.style.setProperty('--spot-x', `${Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100)).toFixed(2)}%`);
    cloud.style.setProperty('--spot-y', `${Math.max(0, Math.min(100, (event.clientY - bounds.top) / bounds.height * 100)).toFixed(2)}%`);
    art.classList.add('is-spotlit');
    stars.forEach(star => {
      if (star.classList.contains('is-found')) return;
      const rect = star.getBoundingClientRect();
      star.classList.toggle('is-lit', Math.hypot(event.clientX - rect.left - rect.width / 2, event.clientY - rect.top - rect.height / 2) < 55);
    });
  }
  art.addEventListener('pointermove', moveLight, { passive: true });
  art.addEventListener('pointerdown', moveLight, { passive: true });
  art.addEventListener('pointerleave', () => {
    art.classList.remove('is-spotlit');
    stars.forEach(star => { if (!star.classList.contains('is-found')) star.classList.remove('is-lit'); });
  });

  stars.forEach((star, index) => star.addEventListener('click', () => {
    if (star.classList.contains('is-found')) return;
    star.classList.remove('is-lit');
    star.classList.add('is-found');
    star.setAttribute('aria-label', `已找到第${index + 1}颗星`);
    dots[index].classList.add('is-found');
    const found = stars.filter(item => item.classList.contains('is-found')).length;
    progress.hidden = false;
    countText.textContent = `${found} / 3`;
    hint.textContent = found === 1 ? '找到第一颗啦，再照亮云层的其他角落 ✧' : found === 2 ? '还差最后一颗，礼物快出现啦 ✧' : '三颗星都找到了，刮开云朵礼物吧 ✧';
    if (found === 3) window.setTimeout(() => {
      if (!stars.every(item => item.classList.contains('is-found'))) return;
      card.hidden = false;
      restart.hidden = false;
      requestAnimationFrame(paintScratch);
    }, 450);
  }));

  function paintScratch() {
    canvas.hidden = false;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.globalCompositeOperation = 'source-over';
    const fill = context.createLinearGradient(0, 0, rect.width, rect.height);
    fill.addColorStop(0, '#d4edf6');
    fill.addColorStop(.55, '#bce2ef');
    fill.addColorStop(1, '#dceff2');
    context.fillStyle = fill;
    context.fillRect(0, 0, rect.width, rect.height);
    context.textAlign = 'center';
    context.fillStyle = '#6f9fb1';
    context.font = '700 14px sans-serif';
    context.fillText('用手指或鼠标刮开云雾', rect.width / 2, rect.height / 2 + 5);
    context.font = '20px sans-serif';
    context.fillText('✦', rect.width / 2, rect.height / 2 - 25);
    revealed = false;
    strokes = 0;
    scratchStatus.textContent = '试着刮开云雾';
  }
  function revealScratch() {
    canvas.hidden = true;
    revealed = true;
    scratching = false;
    scratchStatus.textContent = '你发现了礼物 ✦';
  }
  function scratchAt(event, start) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    context.globalCompositeOperation = 'destination-out';
    context.lineWidth = 44;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    if (start) { context.beginPath(); context.moveTo(x, y); context.lineTo(x + .01, y + .01); }
    else context.lineTo(x, y);
    context.stroke();
    if (++strokes % 8 === 0) {
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0, total = 0;
      for (let i = 3; i < pixels.length; i += 32) { total++; if (pixels[i] < 30) clear++; }
      if (clear / total > .43) revealScratch();
    }
  }
  canvas.addEventListener('pointerdown', event => {
    if (revealed) return;
    scratching = true;
    canvas.setPointerCapture(event.pointerId);
    scratchAt(event, true);
  });
  canvas.addEventListener('pointermove', event => { if (scratching && !revealed) scratchAt(event, false); });
  canvas.addEventListener('pointerup', () => { scratching = false; });
  canvas.addEventListener('pointercancel', () => { scratching = false; });
  art.querySelector('[data-egg-reveal]').addEventListener('click', revealScratch);
  art.querySelector('[data-egg-scratch-reset]').addEventListener('click', paintScratch);
  window.addEventListener('resize', () => { if (!card.hidden && !revealed) paintScratch(); });
  restart.addEventListener('click', () => {
    card.hidden = true;
    restart.hidden = true;
    progress.hidden = true;
    countText.textContent = '0 / 3';
    hint.textContent = '云层里，好像藏着一点小惊喜 ✧';
    stars.forEach((star, index) => {
      star.classList.remove('is-found', 'is-lit');
      star.setAttribute('aria-label', `找到第${index + 1}颗星`);
      dots[index].classList.remove('is-found');
    });
  });
})();
