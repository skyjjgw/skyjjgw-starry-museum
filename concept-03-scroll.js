(() => {
  if (!document.body.classList.contains('concept3')) return;

  const targets = [];
  const add = (selector, step = 0) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.dataset.scrollReveal = '';
      element.style.setProperty('--reveal-delay', `${index * step}ms`);
      targets.push(element);
    });
  };

  add('.heroCopy');
  add('.concept3-art');
  add('.platform-strip h2, .platform-viewport', 100);
  add('#works .home-gallery-heading, #works .home-gallery-root, #works .home-gallery-bottom', 110);
  add('#people .sectionHead, #people .partner-window', 120);
  add('#relay .relay');
  add('.footer');

  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  document.documentElement.classList.add('marquee-observer-ready');
  const marqueeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-in-view', entry.isIntersecting));
  }, { rootMargin: '100px 0px' });
  document.querySelectorAll('.platform-viewport, .partner-window').forEach((element) => marqueeObserver.observe(element));

  document.documentElement.classList.add('scroll-reveal-ready');
  const updateFade = () => {
    const fadeStart = Math.min(72, window.innerHeight * .08);
    targets.forEach((element) => {
      if (!element.classList.contains('scroll-fade-ready')) return;
      const bounds = element.getBoundingClientRect();
      const fadeDistance = Math.max(160, Math.min(280, bounds.height * .65));
      const opacity = Math.max(0, Math.min(1, (bounds.top + fadeDistance - fadeStart) / fadeDistance));
      element.style.setProperty('--scroll-fade', opacity.toFixed(3));
    });
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('scroll-visible');
      observer.unobserve(entry.target);
      const delay = Number.parseInt(entry.target.style.getPropertyValue('--reveal-delay'), 10) || 0;
      window.setTimeout(() => {
        entry.target.classList.add('scroll-fade-ready');
        updateFade();
      }, 850 + delay);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  targets.forEach((element) => observer.observe(element));
  window.addEventListener('scroll', updateFade, { passive: true });
  window.addEventListener('resize', updateFade, { passive: true });
  window.addEventListener('pageshow', updateFade);
})();
