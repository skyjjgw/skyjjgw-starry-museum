/* Physical page turns using the local Anime.js runtime. Scroll owns all time. */
window.createSkymoniBookTimeline = (anime, leaves, drawings, book, cover) => {
  const timeline = anime.createTimeline({ autoplay: false, defaults: { ease: 'inOutSine' } });
  timeline.add({ progress: 0 }, { progress: [0, 1], duration: 13000, ease: 'linear' }, 0);
  timeline.add(book, { x: ['-25%', '0%'], duration: 2600 }, 300);
  timeline.add(cover, { rotateY: [0, -180], duration: 2400 }, 450);
  leaves.forEach((leaf, index) => {
    timeline.add(leaf, { rotateY: [0, -180], duration: 2400 }, 4800 + index * 4400);
  });
  timeline.add(drawings, { strokeDashoffset: [1, 0], duration: 1200, delay: anime.stagger(100) }, 3100);
  timeline.seek(0);
  return timeline;
};

(() => {
  const section = document.querySelector('[data-openbook]');
  if (!section) return;
  const runway = section.querySelector('.book-runway');
  const pin = section.querySelector('.book-pin');
  const book = section.querySelector('.book-object');
  const cover = section.querySelector('.book-cover');
  const coverFront = section.querySelector('.book-cover-front');
  const leaves = [...section.querySelectorAll('.book-leaf')];
  const papers = [...section.querySelectorAll('[data-book-page]')];
  const drawings = [...section.querySelectorAll('.book-ink')];
  const counter = section.querySelector('[data-book-counter]');
  const previous = section.querySelector('[data-book-prev]');
  const next = section.querySelector('[data-book-next]');
  const walkers = [...section.querySelectorAll('[data-book-walker]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let timeline;
  let start = 0;
  let distance = 1;
  let frame = 0;
  let chapter = 0;
  let scrollEnabled = false;
  let manualProgress = 0;
  let clickAnimation;
  const stops = [.29, .63, .96];

  const render = () => {
    frame = 0;
    if (!timeline) return;
    const progress = scrollEnabled ? Math.max(0, Math.min(1, (scrollY - start) / distance)) : manualProgress;
    const time = progress * 13000;
    timeline.seek(time);
    chapter = time < 2850 ? -1 : time < 6000 ? 0 : time < 10400 ? 1 : 2;
    section.classList.toggle('book-closed', chapter < 0);
    cover.style.zIndex = time < 2850 ? '30' : '5';
    coverFront.setAttribute('aria-hidden', String(time > 1650));
    coverFront.tabIndex = time > 1650 ? -1 : 0;
    leaves.forEach((leaf, index) => {
      const turn = Math.max(0, Math.min(1, (time - 4800 - index * 4400) / 2400));
      leaf.style.zIndex = String(turn > .5 ? 10 + index : 20 - index);
      leaf.style.setProperty('--shade-opacity', String(Math.sin(turn * Math.PI) * .32));
    });
    papers.forEach((paper) => {
      const visible = Math.floor((Number(paper.dataset.bookPage) - 1) / 2) === chapter;
      paper.inert = !visible;
      paper.setAttribute('aria-hidden', String(!visible));
    });
    const label = chapter < 0 ? '点击封面打开' : `0${chapter + 1} / 03`;
    if (counter.textContent !== label) counter.textContent = label;
    previous.disabled = chapter < 0;
    next.disabled = chapter === 2;
  };

  const measure = () => {
    const enabled = Boolean(window.anime) && innerWidth >= 760;
    scrollEnabled = enabled && !reduced.matches && !document.body.classList.contains('portal-exhibit-page') && innerWidth >= 960 && innerHeight >= 740;
    section.classList.toggle('book-scroll', enabled);
    section.classList.toggle('book-click-only', enabled && !scrollEnabled);
    book.style.setProperty('--book-height', `${Math.max(480, Math.min(560, innerHeight - 255))}px`);
    if (enabled && !timeline) timeline = window.createSkymoniBookTimeline(window.anime, leaves, drawings, book, cover);
    if (!enabled && timeline) {
      timeline.revert();
      clickAnimation?.cancel();
      timeline = undefined;
      cover.style.zIndex = '';
      coverFront.removeAttribute('aria-hidden');
      coverFront.tabIndex = -1;
      leaves.forEach((leaf) => { leaf.style.zIndex = ''; leaf.style.removeProperty('--shade-opacity'); });
      papers.forEach((paper) => { paper.inert = false; paper.removeAttribute('aria-hidden'); });
    }
    if (!enabled) section.classList.remove('book-closed');
    distance = innerHeight * 4;
    runway.style.height = scrollEnabled ? `${pin.offsetHeight + distance}px` : '';
    start = runway.getBoundingClientRect().top + scrollY - 92;
    render();
  };
  const go = (index) => {
    if (!timeline) return;
    const progress = index < 0 ? 0 : stops[Math.min(2, index)];
    if (scrollEnabled) {
      window.scrollTo({ top: start + distance * progress, behavior: 'smooth' });
      return;
    }
    clickAnimation?.cancel();
    const playhead = { progress: manualProgress };
    clickAnimation = window.anime.animate(playhead, {
      progress, duration: reduced.matches ? 0 : 1100, ease: 'inOutSine',
      onUpdate: () => { manualProgress = playhead.progress; render(); },
      onComplete: () => { manualProgress = progress; render(); },
    });
  };
  coverFront.setAttribute('role', 'button');
  coverFront.setAttribute('aria-label', '打开灵感档案');
  coverFront.addEventListener('pointermove', (event) => {
    const bounds = coverFront.getBoundingClientRect();
    coverFront.style.setProperty('--light-x', `${((event.clientX - bounds.left) / bounds.width * 100).toFixed(1)}%`);
    coverFront.style.setProperty('--light-y', `${((event.clientY - bounds.top) / bounds.height * 100).toFixed(1)}%`);
  }, { passive: true });
  coverFront.addEventListener('pointerleave', () => {
    coverFront.style.removeProperty('--light-x');
    coverFront.style.removeProperty('--light-y');
  });
  coverFront.addEventListener('click', () => go(0));
  coverFront.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    go(0);
  });
  walkers.forEach((walker) => {
    let pauseTimer;
    walker.addEventListener('click', () => {
      clearTimeout(pauseTimer);
      walker.classList.add('is-paused');
      pauseTimer = setTimeout(() => walker.classList.remove('is-paused'), 5000);
    });
  });
  papers.forEach((paper) => paper.addEventListener('click', (event) => {
    if (event.target.closest('a, button, input, textarea, select') || window.getSelection()?.toString()) return;
    const direction = Number(paper.dataset.bookPage) % 2 === 0 ? 1 : -1;
    go(chapter + direction);
  }));
  previous.addEventListener('click', () => go(chapter - 1));
  next.addEventListener('click', () => go(chapter + 1));
  window.addEventListener('scroll', () => {
    if (timeline && !frame) frame = requestAnimationFrame(render);
  }, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('pageshow', measure);
  reduced.addEventListener('change', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(pin);
  measure();
})();
