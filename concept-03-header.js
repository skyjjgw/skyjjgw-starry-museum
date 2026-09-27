(() => {
  const nav = document.querySelector('.concept3 .nav');
  if (!nav) return;

  const update = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('pageshow', update);

  const options = nav.querySelector('.nav-options');
  const indicator = options?.querySelector('.nav-pill-indicator');
  const links = options ? [...options.querySelectorAll('a[href^="#"]')] : [];
  if (!indicator || !links.length) return;

  let active = links[0];
  let hovered = null;

  function movePill(link, instant = false) {
    if (!options.getClientRects().length) return;
    const optionBounds = options.getBoundingClientRect();
    const linkBounds = link.getBoundingClientRect();
    if (instant) indicator.style.transition = 'none';
    indicator.style.width = `${linkBounds.width}px`;
    indicator.style.transform = `translate3d(${linkBounds.left - optionBounds.left}px,0,0)`;
    indicator.style.opacity = '1';
    if (instant) requestAnimationFrame(() => indicator.style.removeProperty('transition'));
  }

  function select(link) {
    if (active === link && links.some((item) => item.hasAttribute('aria-current'))) return;
    active = link;
    links.forEach((item) => {
      if (item === link) item.setAttribute('aria-current', 'location');
      else item.removeAttribute('aria-current');
    });
    if (!hovered) movePill(active);
  }

  links.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      hovered = link;
      movePill(link);
    });
    link.addEventListener('focus', () => {
      hovered = link;
      movePill(link);
    });
    link.addEventListener('click', () => select(link));
  });
  options.addEventListener('mouseleave', () => {
    hovered = null;
    movePill(active);
  });
  options.addEventListener('focusout', (event) => {
    if (options.contains(event.relatedTarget)) return;
    hovered = null;
    movePill(active);
  });

  const sections = links.map((link) => ({ link, section: document.querySelector(link.hash) }));
  let scrollFrame = 0;
  const syncScroll = () => {
    scrollFrame = 0;
    const threshold = Math.min(window.innerHeight * .38, 340);
    let current = links[0];
    sections.forEach(({ link, section }) => {
      if (section && section.getBoundingClientRect().top <= threshold) current = link;
    });
    select(current);
  };
  const scheduleScroll = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(syncScroll);
  };
  const syncHash = () => select(links.find((link) => link.hash === window.location.hash) || links[0]);
  window.addEventListener('hashchange', syncHash);
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', () => { syncScroll(); movePill(hovered || active, true); }, { passive: true });
  window.addEventListener('pageshow', syncScroll);
  syncHash();
  syncScroll();
  document.fonts?.ready.then(() => movePill(hovered || active, true));
})();
