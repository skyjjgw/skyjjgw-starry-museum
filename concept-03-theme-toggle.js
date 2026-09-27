(() => {
  const switchLink = document.querySelector('[data-theme-switch]');
  if (!switchLink) return;

  const storageKey = 'skymoni-theme-jump';
  const sections = ['works', 'journal', 'people', 'relay']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  switchLink.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const destination = new URL(switchLink.href);
    const readingLine = window.innerHeight * .33;
    let section;
    sections.forEach((item) => {
      if (item.getBoundingClientRect().top <= readingLine) section = item;
    });
    if (section) destination.hash = section.id;

    try {
      sessionStorage.setItem(storageKey, JSON.stringify({
        path: destination.pathname,
        scrollY: window.scrollY,
        savedAt: Date.now(),
      }));
    } catch (_) {
      // A file:// page may not have session storage; the section anchor still works.
    }
    switchLink.href = destination.href;
  });

  let saved;
  try {
    saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
    sessionStorage.removeItem(storageKey);
  } catch (_) {
    return;
  }
  if (!saved || saved.path !== window.location.pathname || Date.now() - saved.savedAt > 10000) return;

  const restoreScroll = () => window.scrollTo({ top: saved.scrollY, behavior: 'instant' });
  window.addEventListener('pageshow', () => {
    requestAnimationFrame(restoreScroll);
    document.fonts?.ready.then(restoreScroll);
  }, { once: true });
})();
