import Image from 'next/image';
import Intro from '@/components/Intro';
import Journey from '@/components/Journey';
import Reveal from '@/components/Reveal';
import { education, experience, pillars, profile, projects, skills, stats, ticker } from '@/data/profile';

const nav = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

export default function Home() {
  return (
    <>
      <Intro />
      <Reveal />
      <a className="skip" href="#main">Skip to content</a>

      <header className="nav">
        <a href="#top" className="nav__mark" aria-label="Lakshit Tyagi — home">
          <span className="nav__mono">lt</span>
          <span className="nav__name">Lakshit Tyagi</span>
        </a>
        <nav aria-label="Primary">
          <ul className="nav__links">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn--small" href={profile.resume} download>
          Résumé <span aria-hidden>↓</span>
        </a>
      </header>

      <main id="main">
        {/* ---------- Hero ---------- */}
        <section className="hero" id="top">
          {/* The pinned hero: scrolling through it spills the journey out of the bowl (see Journey.tsx). */}
          <div className="spill">
            <div className="spill__pin">
              <div className="hero__intro">
                <div className="hero__meta load" style={{ ['--d' as string]: '0ms' }}>
                  <span className="dot" aria-hidden /> {profile.status}
                  <span className="hero__sep" aria-hidden>/</span>
                  {profile.location}
                </div>

                <h1 className="hero__title">
                  <span className="load" style={{ ['--d' as string]: '80ms' }}>I build the</span>{' '}
                  <em className="load" style={{ ['--d' as string]: '160ms' }}>engine</em>
                  <span className="load" style={{ ['--d' as string]: '240ms' }}>&nbsp;—</span>
                  <br />
                  <span className="load" style={{ ['--d' as string]: '320ms' }}>and tell the</span>{' '}
                  <em className="load accent" style={{ ['--d' as string]: '400ms' }}>story.</em>
                </h1>

                <div className="hero__copy load" style={{ ['--d' as string]: '480ms' }}>
                  <figure className="portrait">
                    <div className="portrait__frame">
                      <Image className="portrait__photo" src={profile.photo} alt={profile.name} width={200} height={200} priority />
                    </div>
                    <figcaption className="portrait__tag">that&rsquo;s me</figcaption>
                  </figure>
                  <div className="hero__text">
                    <p className="eyebrow">
                      {profile.name} · {profile.role}
                    </p>
                    <p className="lede">{profile.intro}</p>
                    <div className="hero__cta">
                      <a className="btn" href="#work">
                        See the work <span aria-hidden>→</span>
                      </a>
                      <a className="btn btn--ghost" href={`mailto:${profile.email}`}>
                        Get in touch
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <Journey />
            </div>
            <div className="spill__run" aria-hidden />
          </div>

          <dl className="stats">
            {stats.map((s, i) => (
              <div className="stat load" key={s.label} style={{ ['--d' as string]: `${760 + i * 80}ms` }}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------- Ticker ---------- */}
        <div className="ticker" aria-hidden>
          <div className="ticker__track">
            {[...ticker, ...ticker].map((t, i) => (
              <span key={i}>
                {t}
                <i>✦</i>
              </span>
            ))}
          </div>
        </div>

        {/* ---------- Pillars ---------- */}
        <section className="section pillars" aria-labelledby="pillars-h">
          <div className="section__head" data-reveal>
            <p className="kicker">What “AI MarTech” means here</p>
            <h2 id="pillars-h">
              Three skill sets that usually sit in <em>three different people.</em>
            </h2>
          </div>
          <div className="pillars__grid">
            {pillars.map((p, i) => (
              <article className="pillar" key={p.title} data-reveal style={{ ['--d' as string]: `${i * 90}ms` }}>
                <span className="pillar__no">{p.no}</span>
                <h3>{p.title}</h3>
                <p className="pillar__line">{p.line}</p>
                <ul>
                  {p.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Work ---------- */}
        <section className="work" id="work" aria-labelledby="work-h">
          <div className="section">
            <div className="section__head section__head--split" data-reveal>
              <div>
                <p className="kicker kicker--light">Selected work</p>
                <h2 id="work-h">
                  Shipped, live, <em>clickable.</em>
                </h2>
              </div>
              <a className="link-light" href={profile.links[1].href} target="_blank" rel="noreferrer">
                More on GitHub ↗
              </a>
            </div>

            <ol className="projects">
              {projects.map((p, i) => (
                <li key={p.name} className="project" data-reveal>
                  <a href={p.href} target="_blank" rel="noreferrer" className="project__link">
                    <span className="project__idx">{String(i + 1).padStart(2, '0')}</span>
                    <div className="project__main">
                      <p className="project__kind">{p.kind}</p>
                      <h3 className="project__name">{p.name}</h3>
                      <p className="project__summary">{p.summary}</p>
                      <p className="project__angle">
                        <span>Angle</span> {p.martech}
                      </p>
                    </div>
                    <div className="project__side">
                      <figure className="shot">
                        <span className="shot__bar" aria-hidden>
                          <i />
                          <i />
                          <i />
                          <span>{new URL(p.href).hostname}</span>
                        </span>
                        <Image
                          src={p.shot}
                          alt={`${p.name} — homepage of the live site`}
                          width={1280}
                          height={720}
                          sizes="(max-width: 960px) 100vw, 30rem"
                        />
                      </figure>
                      <ul className="chips chips--dark">
                        {p.stack.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                      <span className="project__go">
                        Live demo <span className="arrow" aria-hidden>↗</span>
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- Experience ---------- */}
        <section className="section" id="experience" aria-labelledby="exp-h">
          <div className="section__head section__head--split" data-reveal>
            <div>
              <p className="kicker">Experience</p>
              <h2 id="exp-h">
                Two tech internships. Two growth ones. <em>One profile.</em>
              </h2>
            </div>
            <p className="legend">
              <span className="tag tag--tech">Tech</span>
              <span className="tag tag--growth">Growth</span>
            </p>
          </div>

          <ol className="timeline">
            {experience.map((x) => (
              <li className={`role role--${x.track}`} key={x.org} data-reveal>
                <div className="role__when">
                  <span>{x.when}</span>
                  <span className="role__where">{x.where}</span>
                </div>
                <div className="role__body">
                  <div className="role__title">
                    <h3>{x.role}</h3>
                    <span className={`tag tag--${x.track}`}>{x.track === 'tech' ? 'Tech' : 'Growth'}</span>
                  </div>
                  <p className="role__org">
                    {x.org}
                    {x.link && (
                      <a className="role__link" href={x.link.href} target="_blank" rel="noreferrer">
                        {x.link.label} ↗
                      </a>
                    )}
                  </p>
                  <ul>
                    {x.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- Skills ---------- */}
        <section className="section skills" id="skills" aria-labelledby="skills-h">
          <div className="section__head" data-reveal>
            <p className="kicker">Toolkit</p>
            <h2 id="skills-h">
              The stack, <em>both sides of it.</em>
            </h2>
          </div>
          <div className="skills__grid">
            {skills.map((g) => (
              <div className="skillset" key={g.group} data-reveal>
                <h3>{g.group}</h3>
                <ul className="chips">
                  {g.items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="skillset skillset--edu" data-reveal>
              <h3>Education</h3>
              <p className="edu__school">{education.school}</p>
              <p className="edu__line">{education.degree}</p>
              <p className="edu__line edu__dim">
                {education.when} · {education.where}
              </p>
            </div>
          </div>
        </section>

        {/* ---------- Contact ---------- */}
        <section className="contact" id="contact" aria-labelledby="contact-h">
          <div className="section">
            <p className="kicker" data-reveal>
              Contact
            </p>
            <h2 id="contact-h" className="contact__title" data-reveal>
              Have a product to build, <br />
              or a launch to <em>grow?</em>
            </h2>
            <a className="contact__mail" href={`mailto:${profile.email}`} data-reveal>
              {profile.email}
              <span aria-hidden>→</span>
            </a>
            <ul className="contact__links" data-reveal>
              {profile.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noreferrer">
                    {l.label} ↗
                  </a>
                </li>
              ))}
              <li>
                <a href={profile.resume} download>
                  Résumé (PDF) ↓
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>{profile.role} · {profile.location}</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}
