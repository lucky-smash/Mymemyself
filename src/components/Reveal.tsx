'use client';

import { useEffect } from 'react';

// Adds `is-in` to every [data-reveal] element as it scrolls into view.
// Without JS the elements stay visible (see .js-reveal guard in globals.css).
export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('js-reveal');
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
