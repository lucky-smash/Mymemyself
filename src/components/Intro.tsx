'use client';

import { useEffect, useRef } from 'react';
import { profile } from '@/data/profile';

/**
 * Page-load intro, after the SageVerve dot-portrait loader: dots fly in from all over the screen and settle into a
 * halftone of the photo, the name rises under it, then an ink wash sweeps up and peels away to reveal the hero.
 *
 * The head script in app/layout.tsx decides whether it plays (on every load, never for reduced motion) by adding
 * `html.intro`. This component flies the dots, then cues `intro-formed` and
 * `intro-exit`; the CSS holds everything paused until those cues (see "Intro" in globals.css).
 */

/* Head-and-shoulders crop of the photo (fractions of the image). */
const CROP = { x: 0.13, y: 0.02, w: 0.74, h: 0.98 };
const FLY_MS = 2000;
const HOLD_MS = 600;
const UNLOCK_MS = 750; // when the paper drops behind the wash
const COLORS = ['#16130f', '#6e665a', '#ff4f1a']; // ink (bold dots), muted (fine dots), accent (in flight)

const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Halftone portrait on a hex grid inside `rect`: one dot per cell, radius from the photo's darkness. */
function halftone(img: HTMLImageElement, rect: DOMRect, cols: number) {
  const sw = img.naturalWidth * CROP.w;
  const sh = img.naturalHeight * CROP.h;
  const rows = Math.round((cols * (sh / sw)) / 0.866);
  const off = document.createElement('canvas');
  off.width = cols;
  off.height = rows;
  const octx = off.getContext('2d', { willReadFrequently: true })!;
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(img, img.naturalWidth * CROP.x, img.naturalHeight * CROP.y, sw, sh, 0, 0, cols, rows);
  const data = octx.getImageData(0, 0, cols, rows).data;

  // Auto-levels: stretch the crop's own tonal range so a soft, mid-toned photo still splits into
  // empty highlights and bold darks.
  const lums = new Float32Array(cols * rows);
  for (let i = 0; i < lums.length; i++) {
    lums[i] = (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255;
  }
  const sorted = Float32Array.from(lums).sort();
  const lo = sorted[Math.floor(sorted.length * 0.04)];
  const hi = sorted[Math.floor(sorted.length * 0.9)];

  const cell = Math.min(rect.width / (cols + 0.5), rect.height / (rows * 0.866));
  const ox = rect.left + (rect.width - (cols + 0.5) * cell) / 2;
  const oy = rect.top + (rect.height - rows * cell * 0.866) / 2;

  const x: number[] = [];
  const y: number[] = [];
  const r: number[] = [];
  const c: number[] = [];
  for (let row = 0, i = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++, i++) {
      const lum = clamp((lums[i] - lo) / (hi - lo));
      // Fade the room out towards the edges so the head and shoulders carry the frame.
      const u = (col / cols - 0.5) / 0.52;
      const v = (row / rows - 0.6) / 0.62;
      const keep = clamp(1.35 - Math.hypot(u, v));
      // Contrast curve: skin falls to fine dots, hair, brows, eyes and the shirt stay bold.
      const d = Math.pow(clamp((1 - lum - 0.18) / 0.72), 1.5) * keep;
      if (d < 0.05) continue;
      x.push(ox + (col + 0.5 + (row % 2) * 0.5) * cell);
      y.push(oy + (row + 0.5) * cell * 0.866);
      r.push(cell * 0.56 * Math.sqrt(d));
      c.push(d > 0.5 ? 0 : 1);
    }
  }
  return { x, y, r, c };
}

export default function Intro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('intro') || root.classList.contains('intro-exit')) return;

    const canvas = canvasRef.current;
    const frame = frameRef.current;
    const ctx = canvas?.getContext('2d');
    const timers: number[] = [];
    const cue = (...cls: string[]) => root.classList.add(...cls);
    const exit = () => {
      cue('intro-formed', 'intro-exit');
      timers.push(window.setTimeout(() => root.classList.remove('intro-lock'), UNLOCK_MS));
    };
    if (!canvas || !frame || !ctx) {
      exit();
      return;
    }

    let disposed = false;
    let raf = 0;
    const image = new Image();
    image.decoding = 'async';
    image.src = profile.photo;

    // Flight paths are laid out per size; `draw(t)` is a pure function of progress, so a resize mid-flight
    // just carries on with the new layout.
    let scene: ReturnType<typeof layout> | null = null;
    function layout() {
      const W = canvas!.clientWidth;
      const H = canvas!.clientHeight;
      const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      const rect = frame!.getBoundingClientRect();
      const face = halftone(image, rect, W >= 700 ? 54 : 42);
      const n = face.x.length;

      // Each dot starts somewhere loose around the frame and lands on its cell.
      const rand = mulberry32(7);
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const fx = new Float32Array(n);
      const fy = new Float32Array(n);
      const delay = new Float32Array(n);
      const bend = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const a = rand() * Math.PI * 2;
        const dist = Math.max(W, H) * (0.3 + rand() * 0.55);
        fx[i] = cx + Math.cos(a) * dist;
        fy[i] = cy + Math.sin(a) * dist * 0.75;
        delay[i] = rand() * 0.45;
        bend[i] = (rand() - 0.5) * 0.5;
      }
      return { W, H, dpr, face, n, fx, fy, delay, bend };
    }

    let t0 = 0;
    const tick = (now: number) => {
      raf = 0;
      if (disposed || !scene) return;
      const t = clamp((now - t0) / FLY_MS);
      const { W, H, dpr, face, n, fx, fy, delay, bend } = scene;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (let ci = 0; ci < COLORS.length; ci++) {
        ctx.fillStyle = COLORS[ci];
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const li = easeOut(clamp((t - delay[i]) / 0.55));
          if ((li < 0.6 ? 2 : face.c[i]) !== ci) continue;
          const r = face.r[i] * li;
          if (r < 0.35) continue;
          const dx = face.x[i] - fx[i];
          const dy = face.y[i] - fy[i];
          // Curve the path so the dots swirl in rather than slide.
          const off = Math.sin(Math.PI * li) * bend[i];
          const x = fx[i] + dx * li - dy * off;
          const y = fy[i] + dy * li + dx * off;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      if (scene) scene = layout();
    };

    image.decode().then(
      () => {
        if (disposed) return;
        scene = layout();
        window.addEventListener('resize', onResize);
        t0 = performance.now();
        raf = requestAnimationFrame(tick);
        timers.push(
          window.setTimeout(() => cue('intro-formed'), FLY_MS * 0.6),
          window.setTimeout(exit, FLY_MS + HOLD_MS),
        );
      },
      () => !disposed && exit(),
    );

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="intro-curtain" aria-hidden="true">
      <div className="intro-curtain__paper">
        <canvas className="intro-curtain__dots" ref={canvasRef} />
        <div className="intro-curtain__lockup">
          <div className="intro-curtain__portrait" ref={frameRef} />
          <p className="intro-curtain__word">
            <span className="intro-curtain__line">
              <span className="intro-curtain__name">{profile.name}</span>
            </span>
            <span className="intro-curtain__line">
              <span className="intro-curtain__role">{profile.role}</span>
            </span>
          </p>
        </div>
      </div>
      <div className="intro-curtain__wash" />
    </div>
  );
}
