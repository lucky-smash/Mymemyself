'use client';

import { useEffect, useRef } from 'react';
import { journey } from '@/data/profile';

/**
 * The hero's journey spill, after the Solution Bowl portfolio hero: scrolling tips the bowl, each milestone slides
 * up the inner wall, leaves over the low point of the lip, flies under constant gravity to an exact touchdown,
 * skids, hops once and settles in its slot, while a dotted line threads the landed stickers in order. The empty
 * bowl then swings back.
 *
 * Everything is a pure function of t = progress through the pinned hero, so it scrubs both ways and is right on a
 * refresh at any offset. The cards are real content sitting in their slots: JS only offsets them from there, so
 * without JS or with reduced motion they simply show in place.
 */

// ---- Story clock (t ∈ [0, 1] across the pin) ---------------------------------------------------------------

const ANTICIPATE: Span = [0.03, 0.12]; // lift and counter-tilt
const POUR: Span = [0.12, 0.3]; // tip toward the slots
const SWING_BACK: Span = [0.86, 1];
const LAUNCH = 0.24; // first card leaves the lip
const STAGGER = 0.085;
const EMERGE = 0.05; // sliding up the inner wall
const FLIGHT = 0.12;
const SETTLE = 0.08; // skid + hop

const TIP = -112; // degrees: the opening turns left and down
const LEAN = -8; // how much further it leans while the last ones leave
const COUNTER = 9; // the wind-up before the pour
const LIFT = 0.1; // bowl widths

/** Resting tilt of each sticker in its slot. */
const REST = [-3, 2.5, -1.5, 3, -2.5, 1.5];

// ---- Bowl artwork (viewBox 240 × 170) -------------------------------------------------------------------------

const VB_W = 240;
const PIVOT: Point = [120, 90]; // the bowl's visual centre; it tips about this
const INSIDE: Point = [120, 74]; // where a card waits, low in the bowl
const LIP: Point = [10, 50]; // left end of the rim: the lowest point once tipped

type Span = [number, number];
type Point = [number, number];
type Bowl = { angle: number; lift: number };
type Geo = { bw: number; pivot: Point; h: number; cardH: number; slots: Point[] };
type Pose = { x: number; y: number; r: number; s: number; o: number };

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const seg = ([a, b]: Span, t: number) => clamp01((t - a) / (b - a));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const easeInCubic = (u: number) => u * u * u;
const easeOutCubic = (u: number) => 1 - (1 - u) ** 3;
const easeInOutCubic = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2);
const easeOutBack = (u: number) => 1 + 2.70158 * (u - 1) ** 3 + 1.70158 * (u - 1) ** 2;

const landsAt = (i: number) => LAUNCH + i * STAGGER + FLIGHT + SETTLE;

function bowlAt(t: number): Bowl {
  const wind = easeInOutCubic(seg(ANTICIPATE, t));
  const pour = easeInOutCubic(seg(POUR, t));
  const back = seg(SWING_BACK, t);
  const tipped = COUNTER * wind * (1 - pour) + TIP * pour + LEAN * seg([POUR[1], SWING_BACK[0]], t);
  return {
    angle: lerp(tipped, 0, easeOutBack(back)),
    lift: LIFT * wind * (1 - 0.5 * pour) * (1 - easeOutCubic(back)),
  };
}

/** A point on the bowl artwork, in stage pixels, for a given bowl pose. */
function world([lx, ly]: Point, b: Bowl, g: Geo): Point {
  const k = g.bw / VB_W;
  const vx = (lx - PIVOT[0]) * k;
  const vy = (ly - PIVOT[1]) * k;
  const a = (b.angle * Math.PI) / 180;
  return [g.pivot[0] + vx * Math.cos(a) - vy * Math.sin(a), g.pivot[1] - b.lift * g.bw + vx * Math.sin(a) + vy * Math.cos(a)];
}

function pose(i: number, t: number, g: Geo): Pose {
  const [sx, sy] = g.slots[i];
  const rest = REST[i % REST.length];
  const launch = LAUNCH + i * STAGGER;
  if (t >= launch + FLIGHT + SETTLE) return { x: sx, y: sy, r: rest, s: 1, o: 1 };

  const atLaunch = bowlAt(launch);
  const [px, py] = world(LIP, atLaunch, g);
  const dir = Math.sign(sx - px) || -1;
  const spin = rest - 16 * dir; // still turning when it touches down
  const tx = sx - dir * g.cardH * 0.18; // touchdown short of the slot; the skid covers the rest

  // 1. Sliding up the inner wall to the lip, behind the bowl's front wall.
  if (t < launch) {
    const u = seg([launch - EMERGE, launch], t);
    const b = bowlAt(t);
    const [x, y] = world([lerp(INSIDE[0], LIP[0], easeInCubic(u)), lerp(INSIDE[1], LIP[1], easeInCubic(u))], b, g);
    return { x, y, r: b.angle, s: 0.38, o: u > 0 ? 1 : 0 };
  }

  // 2. Ballistic flight: constant gravity, solved so it touches down exactly at (tx, sy) with a small pop upward.
  if (t < launch + FLIGHT) {
    const u = (t - launch) / FLIGHT;
    const dy = sy - py;
    const gravity = 2 * Math.max(dy + g.h * 0.12, 1);
    const vy = dy - gravity / 2;
    return {
      x: lerp(px, tx, u),
      y: py + vy * u + 0.5 * gravity * u * u,
      r: lerp(atLaunch.angle, spin, easeOutCubic(u)),
      s: lerp(0.38, 1, easeOutCubic(u)),
      o: 1,
    };
  }

  // 3. Skid into the slot with one hop, and settle its tilt.
  const u = (t - launch - FLIGHT) / SETTLE;
  const hop = u < 0.6 ? Math.sin((Math.PI * u) / 0.6) * g.cardH * 0.1 : 0;
  return { x: lerp(tx, sx, easeOutCubic(u)), y: sy - hop, r: lerp(spin, rest, easeOutBack(u)), s: 1, o: 1 };
}

/** The dotted thread from one landed sticker to the next: a little arc along a row, an S-bend between rows. */
function threadPath([ax, ay]: Point, [bx, by]: Point) {
  if (Math.abs(by - ay) < 8) return `M${ax} ${ay} Q${(ax + bx) / 2} ${ay - 28} ${bx} ${by}`;
  const bend = (by - ay) * 0.6;
  return `M${ax} ${ay} C${ax} ${ay + bend} ${bx} ${by - bend} ${bx} ${by}`;
}

export default function Journey() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = ref.current;
    const spill = stage?.closest<HTMLElement>('.spill');
    const pin = spill?.querySelector<HTMLElement>('.spill__pin');
    if (!stage || !spill || !pin) return;

    const bowl = stage.querySelector<HTMLElement>('.bowl')!;
    const layers = [...stage.querySelectorAll<HTMLElement>('.bowl__layer')];
    const shadow = stage.querySelector<HTMLElement>('.bowl__shadow')!;
    const slots = [...stage.querySelectorAll<HTMLElement>('.journey__slot')];
    const cards = slots.map((s) => s.querySelector<HTMLElement>('.jcard')!);
    const svg = stage.querySelector<SVGSVGElement>('.journey__thread')!;
    const dashed = svg.querySelector<SVGPathElement>('[data-thread]')!;
    const reveals = [...svg.querySelectorAll<SVGPathElement>('[data-reveal-seg]')];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Dev only: ?spill=0.4 freezes the story at that point, for screenshots.
    const frozen = process.env.NODE_ENV !== 'production' ? new URLSearchParams(location.search).get('spill') : null;

    let geo: Geo | null = null;
    let frame = 0;

    const nav = document.querySelector<HTMLElement>('.nav');

    const measure = () => {
      const navH = nav?.offsetHeight ?? 0;
      spill.style.setProperty('--nav-h', `${navH}px`);
      pin.style.top = `${Math.min(navH, window.innerHeight - pin.offsetHeight)}px`;
      const sr = stage.getBoundingClientRect();
      const br = bowl.getBoundingClientRect(); // the wrapper is never transformed; its layers are
      const k = br.width / VB_W;
      const rects = slots.map((s) => s.getBoundingClientRect());
      geo = {
        bw: br.width,
        pivot: [br.left - sr.left + PIVOT[0] * k, br.top - sr.top + PIVOT[1] * k],
        h: sr.height,
        cardH: rects[0]?.height ?? 0,
        slots: rects.map((r) => [r.left - sr.left + r.width / 2, r.top - sr.top + r.height / 2]),
      };
      svg.setAttribute('viewBox', `0 0 ${sr.width} ${sr.height}`);
      const d = geo.slots.slice(1).map((p, i) => threadPath(geo!.slots[i], p));
      dashed.setAttribute('d', d.join(' '));
      reveals.forEach((path, i) => path.setAttribute('d', d[i] ?? ''));
    };

    const progress = () => {
      if (frozen !== null) return clamp01(Number(frozen));
      const run = spill.offsetHeight - pin.offsetHeight;
      const top = parseFloat(pin.style.top) || 0;
      return run > 0 ? clamp01((top - spill.getBoundingClientRect().top) / run) : 1;
    };

    const render = () => {
      frame = 0;
      if (!geo) return;
      const t = progress();
      const b = bowlAt(t);
      const tf = `translateY(${(-b.lift * geo.bw).toFixed(2)}px) rotate(${b.angle.toFixed(2)}deg)`;
      layers.forEach((l) => (l.style.transform = tf));
      shadow.style.transform = `scaleX(${(1 - b.lift * 2.5).toFixed(3)})`;
      shadow.style.opacity = String(1 - b.lift * 4);
      cards.forEach((c, i) => {
        const p = pose(i, t, geo!);
        const [sx, sy] = geo!.slots[i];
        c.style.transform = `translate(${(p.x - sx).toFixed(2)}px, ${(p.y - sy).toFixed(2)}px) rotate(${p.r.toFixed(2)}deg) scale(${p.s.toFixed(3)})`;
        c.style.opacity = String(p.o);
      });
      // Each stretch of thread draws from one landing to the next.
      reveals.forEach((path, i) => {
        path.style.strokeDashoffset = String(1 - seg([landsAt(i), landsAt(i + 1)], t));
      });
      stage.classList.toggle('is-idle', t < 0.02);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const refresh = () => {
      measure();
      schedule();
    };

    const reset = () => {
      spill.classList.remove('is-live');
      stage.classList.remove('is-idle');
      pin.style.top = '';
      spill.style.removeProperty('--nav-h');
      [...layers, shadow, ...cards].forEach((el) => {
        el.style.transform = '';
        el.style.opacity = '';
      });
      reveals.forEach((path) => (path.style.strokeDashoffset = ''));
    };

    const ro = new ResizeObserver(refresh);
    const start = () => {
      spill.classList.add('is-live');
      refresh();
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', refresh);
      ro.observe(pin);
      document.fonts?.ready.then(refresh);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', refresh);
      ro.disconnect();
      reset();
    };
    const sync = () => {
      stop();
      if (!reduce.matches) start();
    };

    sync();
    reduce.addEventListener('change', sync);
    return () => {
      reduce.removeEventListener('change', sync);
      stop();
    };
  }, []);

  return (
    <div className="journey load" ref={ref} style={{ ['--d' as string]: '560ms' }}>
      <p className="journey__label">
        my journey <span>(so far)</span>
      </p>

      <div className="bowl" aria-hidden>
        <span className="bowl__shadow" />
        <div className="bowl__layer bowl__layer--back">
          <svg viewBox="0 0 240 170">
            <ellipse cx="120" cy="50" rx="110" ry="26" fill="#7d62f0" stroke="#16130f" strokeWidth="3" />
            <ellipse cx="120" cy="58" rx="92" ry="16" fill="#5a40cf" />
          </svg>
        </div>
        <div className="bowl__layer bowl__layer--front">
          <svg viewBox="0 0 240 170">
            <path d="M88 154 L94 167 H146 L152 154 Z" fill="#16130f" />
            <path
              d="M10 50 A110 26 0 0 0 230 50 C230 122 182 158 120 158 C58 158 10 122 10 50 Z"
              fill="#b9a6ff"
              stroke="#16130f"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d="M30 84 C38 112 60 134 90 145" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="7" strokeLinecap="round" />
            <path d="M44 74 C46 82 49 89 53 95" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="7" strokeLinecap="round" />
            <g transform="rotate(-12 166 108)">
              <circle cx="166" cy="108" r="23" fill="#ff4f1a" stroke="#16130f" strokeWidth="3" />
              <text x="166" y="116" textAnchor="middle" fontFamily="var(--display)" fontStyle="italic" fontSize="26" fill="#16130f">
                lt
              </text>
            </g>
            <path d="M112 112 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z" fill="#c8f169" stroke="#16130f" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <p className="journey__hint" aria-hidden>
        scroll to spill the tea <span>↓</span>
      </p>
      <span className="journey__spark journey__spark--a" aria-hidden>✦</span>
      <span className="journey__spark journey__spark--b" aria-hidden>✦</span>

      <svg className="journey__thread" aria-hidden>
        <mask id="thread-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
          {journey.slice(1).map((j) => (
            <path key={j.when} data-reveal-seg pathLength={1} fill="none" stroke="#fff" strokeWidth="8" strokeDasharray="1 1" />
          ))}
        </mask>
        <path data-thread mask="url(#thread-reveal)" fill="none" stroke="#16130f" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.1 9" />
      </svg>

      <ol className="journey__slots" aria-label="My journey so far">
        {journey.map((j, i) => {
          const body = (
            <>
              <span className="jcard__top">
                <span className="jcard__when">{j.when}</span>
                <span className="jcard__emoji" aria-hidden>
                  {j.emoji}
                </span>
              </span>
              <span className="jcard__title">{j.title}</span>
              <span className="jcard__org">@ {j.org}</span>
              <span className="jcard__hook">{j.hook}</span>
            </>
          );
          const style = { ['--r' as string]: `${REST[i % REST.length]}deg`, ['--z' as string]: 2 + i };
          return (
            <li className="journey__slot" key={j.when}>
              <span className="journey__slot-when" aria-hidden>
                {j.when}
              </span>
              {j.href ? (
                <a className={`jcard jcard--${j.tone}`} href={j.href} style={style}>
                  {body}
                </a>
              ) : (
                <div className={`jcard jcard--${j.tone}`} style={style}>
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
