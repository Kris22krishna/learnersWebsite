(() => {
    const track = document.querySelector('.carousel-track');
    if (!track) return;
  
    // Compute pixels-per-second based on viewport (faster on small screens)
    function pxPerSec() {
      const vw = Math.max(320, Math.min(window.innerWidth, 1920));
      // ~18% of viewport width per second, clamped
      return Math.max(110, Math.min(220, vw * 0.18));
    }
  
    // Clone first set once if not already duplicated
    const original = Array.from(track.children);
    const hasDuplicate = original.length >= 2 &&
      original.slice(0, original.length/2)
        .every((el, i) => el.outerHTML === track.children[i + original.length/2]?.outerHTML);
    if (!hasDuplicate) original.forEach(el => track.appendChild(el.cloneNode(true)));
  
    function firstSetWidth() {
      const style = getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || 12);
      let w = 0;
      for (let i = 0; i < original.length; i++) {
        const el = track.children[i];
        w += el.getBoundingClientRect().width + gap;
      }
      return Math.max(0, w - gap); // subtract last gap
    }
  
    function setDuration() {
      const distance = firstSetWidth();            // we translate -50% (one set width)
      const speed = pxPerSec();                    // px per second
      const duration = Math.max(8, Math.round(distance / speed));
      track.style.animationDuration = duration + 's';
    }
  
    window.addEventListener('load', setDuration);
    window.addEventListener('resize', () => {
      track.style.animationPlayState = 'paused';
      setDuration();
      requestAnimationFrame(() => (track.style.animationPlayState = 'running'));
    });
  })();
  