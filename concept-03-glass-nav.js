/* GlassSurface displacement map and RGB filter adapted from React Bits.
 * Copyright 2026 David Haz — MIT + Commons Clause.
 * Source: preview/src/effect-picker/vendor/GlassSurface.jsx
 * License: assets/vendor/REACT-BITS-LICENSE.md
 * DOM adapter preserves the existing navigation, anchors and sliding pill. */
(() => {
  const nav = document.querySelector('.concept3 .nav');
  if (!nav) return;
  const isUnsupported = /Firefox/.test(navigator.userAgent) ||
    (/Safari/.test(navigator.userAgent) && !/Chrome|Chromium/.test(navigator.userAgent));
  if (isUnsupported || !CSS.supports('backdrop-filter', 'url(#skymoni-nav-glass)')) return;

  const namespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(namespace, 'svg');
  svg.classList.add('nav-glass-filter');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.innerHTML = `<defs>
    <filter id="skymoni-nav-glass" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">
      <feImage x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map"/>
      <feDisplacementMap in="SourceGraphic" in2="map" scale="-65" xChannelSelector="R" yChannelSelector="G" result="dispRed"/>
      <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="red"/>
      <feDisplacementMap in="SourceGraphic" in2="map" scale="-62" xChannelSelector="R" yChannelSelector="G" result="dispGreen"/>
      <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="green"/>
      <feDisplacementMap in="SourceGraphic" in2="map" scale="-58" xChannelSelector="R" yChannelSelector="G" result="dispBlue"/>
      <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="blue"/>
      <feBlend in="red" in2="green" mode="screen" result="rg"/>
      <feBlend in="rg" in2="blue" mode="screen" result="output"/>
      <feGaussianBlur in="output" stdDeviation="0"/>
    </filter>
  </defs>`;
  nav.prepend(svg);
  const image = svg.querySelector('feImage');
  let frame = 0;
  let lastSize = '';
  function updateMap() {
    frame = 0;
    const bounds = nav.getBoundingClientRect();
    const width = Math.round(bounds.width);
    const height = Math.round(bounds.height);
    if (!width || !height) return;
    const radius = Math.min(parseFloat(getComputedStyle(nav).borderRadius) || 0, height / 2);
    const key = `${width}:${height}:${radius}`;
    if (key === lastSize) return;
    lastSize = key;
    const edge = Math.min(width, height) * .035;
    const map = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <defs><linearGradient id="r" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/></linearGradient><linearGradient id="b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/></linearGradient></defs>
      <rect width="${width}" height="${height}" fill="black"/>
      <rect width="${width}" height="${height}" rx="${radius}" fill="url(#r)"/>
      <rect width="${width}" height="${height}" rx="${radius}" fill="url(#b)" style="mix-blend-mode:difference"/>
      <rect x="${edge}" y="${edge}" width="${width - edge * 2}" height="${height - edge * 2}" rx="${Math.max(0, radius - edge)}" fill="hsl(0 0% 80% / .93)" style="filter:blur(2px)"/>
    </svg>`;
    image.setAttribute('href', `data:image/svg+xml,${encodeURIComponent(map)}`);
    nav.classList.add('has-refraction');
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(updateMap); };
  const resize = new ResizeObserver(schedule);
  resize.observe(nav);
  nav.addEventListener('transitionend', schedule);
  window.addEventListener('pageshow', schedule);
  updateMap();
})();
