'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { copy, projects, contact } from './content';
import { fontVars } from './fonts';
import SiteHeader from './SiteHeader';
import { Mark } from './Marks';
import { Browser } from './Demos';
import ClippyStage from './ClippyStage';
import Hero from './Hero';
import s from './site.module.css';

const SUMMARY_ICONS = {
  code: ['M12 5 5 12l7 7', 'm12 5 7 7-7 7', 'M14 4 10 20'],
  book: ['M3 5.5c3.5-1.8 7-1.8 9 0v15c-2-1.8-5.5-1.8-9 0z', 'M21 5.5c-3.5-1.8-7-1.8-9 0v15c2-1.8 5.5-1.8 9 0z'],
  music: ['M3 14v-2a9 9 0 0 1 18 0v2', 'M3 14h4v7H5a2 2 0 0 1-2-2z', 'M21 14h-4v7h2a2 2 0 0 0 2-2z'],
  sparkle: ['m12 3 1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9L12 3z', 'm19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z'],
};
const SUMMARY_POINTS = ['code', 'book', 'music', 'sparkle'];

function SummaryIcon({ type }) {
  return (
    <svg className={s.aboutPointIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {SUMMARY_ICONS[type].map((path) => <path key={path} d={path} />)}
    </svg>
  );
}

// Each project is a scene: a large title, one framed view of the product and a
// short note beside it. Two alternating compositions keep the rhythm even;
// the frame (browser or phone) follows what the product actually is.
function ProjectView({ project, language, t }) {
  const { media } = project;
  const domain = project.url ? project.url.replace(/^https?:\/\/(www\.)?/, '') : project.title.toLowerCase();
  const still = media && (media.type === 'animated'
    // Animated formats bypass the image optimizer so every frame is preserved.
    ? <img src={media.src} alt={project.title} width={media.w} height={media.h} loading="lazy" decoding="async" />
    : <Image src={media.src} alt={project.title} width={media.w} height={media.h} sizes="(max-width: 760px) 92vw, 62vw" />);

  if (project.view === 'clippy') return <ClippyStage language={language} hint={t.clippyHint} shakeHint={t.clippyShake} />;
  // The Beta Health animation already shows the app inside a phone, so it gets no extra frame.
  if (project.view === 'phone') return <div className={s.bareMedia}>{still}</div>;
  return <Browser url={domain}>{still}</Browser>;
}

function Project({ project, index, language, t }) {
  const local = project[language];
  return (
    <article className={`${s.project} ${index % 2 ? s.right : s.left} ${project.view === 'phone' ? s.narrow : ''}`} id={project.slug} data-project="" style={project.theme?.accent ? { '--project-accent': project.theme.accent } : undefined}>
      <header className={s.sceneHead} data-title="">
        <span className={`${s.hand} ${s.sceneIndex}`}>{String(index + 1).padStart(2, '0')}</span>
        <h3 className={s.sceneTitle}>{project.title}</h3>
      </header>
      <div className={s.media} data-media="">
        <ProjectView project={project} language={language} t={t} />
        {local.note && (
          <p className={s.mediaNote}>
            <Mark type="arrow" className={s.noteArrow} />
            <span className={s.hand}>{local.note}</span>
          </p>
        )}
      </div>
      <div className={s.info} data-info="">
        <p className={s.kind}>{local.kind}</p>
        <p className={s.projectText}>{local.text}</p>
        <p className={s.stack}>{(language === 'de' && project.stackDe) || project.stack}</p>
        <p className={s.links}>
          {project.view === 'clippy' && <Link className={s.link} href={language === 'de' ? '/de/clippy' : '/clippy'}>{t.projectDetails}<span aria-hidden="true"> →</span></Link>}
          {project.caseStudy && <Link className={s.link} href={`${t.home}/writing/${project.slug}`}>{t.caseStudy}<span aria-hidden="true"> →</span></Link>}
          {project.url && <a className={s.link} href={project.url} target="_blank" rel="noreferrer">{t.view} {project.url.replace(/^https?:\/\/(www\.)?/, '')}<span aria-hidden="true"> →</span></a>}
        </p>
      </div>
    </article>
  );
}

export default function Revamp({ language = 'en', articles = [], feedOnline = true, heroAssets }) {
  const t = copy[language];
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    let disposed = false;
    let mm;

    async function initializeAnimations() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        root.dataset.anim = 'off';
        return;
      }

      try {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);
        if (disposed) return;

        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ ignoreMobileResize: true });
        mm = gsap.matchMedia(root);

        mm.add('(prefers-reduced-motion: reduce)', () => { root.dataset.anim = 'off'; });

        mm.add('(prefers-reduced-motion: no-preference)', () => {
          const q = gsap.utils.selector(root);
          const one = (selector) => q(selector)[0];
          const stage = one('[data-stage]');
          const heroBox = one('[data-hero-box]');
          const heroItems = q('[data-hero-item]');
          const heroNotes = one('[data-hero-notes]');
          const strokeTime = (el, speed) => Math.max(0.1, el.getTotalLength() / speed);

          gsap.set(q('[data-draw], [data-sign-a], [data-sign-b]'), { strokeDasharray: 1, strokeDashoffset: 1 });

          // 0. First view, once on load: only "i am Fai" writes itself.
          gsap.to(q('[data-sign-a]'), { strokeDashoffset: 0, duration: (i, el) => strokeTime(el, 900), stagger: 0.22, delay: 0.35, ease: 'power1.inOut' });
          gsap.to(q('[data-scroll-cue] [data-draw]'), { strokeDashoffset: 0, duration: 0.8, delay: 1.8, stagger: 0.3, ease: 'power2.inOut' });

          // Direction and distance that carries an object off the sheet, measured
          // from layout (not from its current transform) so it survives refreshes.
          const away = (el, axis) => {
            const dx = heroBox.offsetLeft + el.offsetLeft + el.offsetWidth / 2 - stage.clientWidth / 2;
            const dy = heroBox.offsetTop + el.offsetTop + el.offsetHeight / 2 - stage.clientHeight / 2;
            const length = Math.hypot(dx, dy) || 1;
            const reach = Math.max(stage.clientWidth, stage.clientHeight) * 0.95;
            return axis === 'x' ? (dx / length) * reach : (dy / length) * reach;
          };
          const spin = (index) => (index % 2 ? 24 : -24);

          // The hero assembles as the page scrolls, then leads into the About section.
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: one('[data-pin]'), start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
          });

          // A
          tl.to(q('[data-scroll-cue]'), { opacity: 0, duration: 0.5 }, 0)
            .to(one('[data-sign-intro]'), { opacity: 0, yPercent: -40, duration: 0.9, ease: 'power1.in' }, 0.1);
          let pen = 0.7;
          q('[data-sign-b]').forEach((stroke) => {
            const duration = strokeTime(stroke, 1500);
            tl.to(stroke, { strokeDashoffset: 0, duration }, pen);
            pen += duration * 0.92;
          });
          heroItems.forEach((item, index) => {
            tl.fromTo(item, { x: () => away(item, 'x'), y: () => away(item, 'y'), rotation: spin(index) }, { x: 0, y: 0, rotation: 0, duration: 2.2 + (index % 3) * 0.35, ease: 'power2.out', immediateRender: true }, 0.5 + (index % 4) * 0.15);
          });
          // The whole note layer stays hidden until its moment, so nothing (not even
          // the round caps of undrawn strokes) shows in the quiet first view.
          tl.fromTo(heroNotes, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: true }, 2.3)
            .fromTo(q('[data-hero-note]'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, immediateRender: true }, 2.4)
            .to(q('[data-hero-notes] [data-draw]'), { strokeDashoffset: 0, duration: 0.5, stagger: 0.04 }, 2.5);

          // 2. Every other hand-drawn mark traces itself as it scrolls into view.
          q('[data-mark="scroll"]').forEach((svg) => {
            gsap.to(svg.querySelectorAll('[data-draw]'), {
              strokeDashoffset: 0, stagger: 0.4, ease: 'none',
              scrollTrigger: { trigger: svg, start: 'top 90%', end: 'top 58%', scrub: true },
            });
          });
          q('[data-row] [data-draw]').forEach((path) => {
            gsap.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: path.closest('svg'), start: 'top 92%', end: 'top 66%', scrub: true } });
          });

          // 3. Compositions assemble: media settles from the side, text follows.
          // Each project fills one screen. Everything in it is tied to the same
          // stretch of scroll and is fully settled just before the scene's top
          // reaches the top of the viewport, i.e. by the time the whole scene shows.
          q('[data-project]').forEach((project) => {
            const direction = project.className.includes(s.right) ? 1 : -1;
            const scene = gsap.timeline({ defaults: { ease: 'power2.out' }, scrollTrigger: { trigger: project, start: 'top 92%', end: 'top 12%', scrub: 0.4 } });
            scene
              .fromTo(project.querySelector('[data-title]'), { xPercent: 9 * direction, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.55 }, 0)
              .fromTo(project.querySelector('[data-media]'), { y: 90, scale: 0.95, opacity: 0.3 }, { y: 0, scale: 1, opacity: 1, duration: 0.7 }, 0.1)
              .fromTo(project.querySelectorAll('[data-info] > *'), { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.08 }, 0.25);
            const strokes = project.querySelectorAll('[data-draw]');
            if (strokes.length) scene.to(strokes, { strokeDashoffset: 0, duration: 0.3, ease: 'none' }, 0.65);
          });

          q('[data-rise]').forEach((el) => {
            gsap.fromTo(el, { y: 60, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 68%', scrub: 0.5 } });
          });
          q('[data-row]').forEach((row, index) => {
            gsap.fromTo(row, { xPercent: index % 2 ? 6 : -6, opacity: 0 }, { xPercent: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: row, start: 'top 96%', end: 'top 72%', scrub: 0.5 } });
          });
          // Layered motion: a few fragments drift at their own rate.
          q('[data-drift]').forEach((el) => {
            gsap.fromTo(el, { y: Number(el.dataset.drift) }, { y: -Number(el.dataset.drift), ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
          });

          root.dataset.anim = 'on';
          document.fonts?.ready.then(() => ScrollTrigger.refresh());

          // Pointer tilt on framed media, hover devices only.
          const cleanups = [];
          if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            q('[data-tilt]').forEach((frame) => {
              const rx = gsap.quickTo(frame, 'rotationX', { duration: 0.5, ease: 'power2.out' });
              const ry = gsap.quickTo(frame, 'rotationY', { duration: 0.5, ease: 'power2.out' });
              const move = (event) => {
                const box = frame.getBoundingClientRect();
                ry(((event.clientX - box.left) / box.width - 0.5) * 5);
                rx(-((event.clientY - box.top) / box.height - 0.5) * 4);
              };
              const leave = () => { rx(0); ry(0); };
              frame.addEventListener('pointermove', move);
              frame.addEventListener('pointerleave', leave);
              cleanups.push(() => { frame.removeEventListener('pointermove', move); frame.removeEventListener('pointerleave', leave); });
            });
          }
          return () => cleanups.forEach((fn) => fn());
        });

      } catch (error) {
        console.error('Page animations failed to initialize', error);
        root.dataset.anim = 'off';
      }
    }

    initializeAnimations();
    return () => {
      disposed = true;
      mm?.revert();
    };
  }, []);

  return (
    <main className={`${s.root} ${fontVars}`} ref={rootRef} data-anim="pending" lang={language}>
      <noscript><style>{'[data-anim="pending"] [data-stage]{visibility:visible!important}'}</style></noscript>

      <SiteHeader language={language} />

      {/* The hero assembles while scrolling, then leads into the About section. */}
      <div className={s.pin} data-pin="">
        <section className={s.stage} data-stage="" aria-label={t.aboutLabel}>
          <Hero language={language} assets={heroAssets} />
          <p className={`${s.corner} ${s.cornerLeft}`} data-hero-fade="">{t.role[0]}<br />{t.role[1]}</p>
          <p className={s.scrollCue} data-hero-fade="" aria-hidden="true"><Mark type="arrowDown" className={s.scrollArrow} data-scroll-cue="" /></p>
          <p className={`${s.corner} ${s.cornerRight}`} data-hero-fade="">{t.heroRight[0]}<br />{t.heroRight[1]}</p>
        </section>
      </div>

      <section className={s.about} id="about">
        <p className={`${s.hand} ${s.aboutKicker}`} data-rise="">{t.aboutKicker}</p>
        <Mark type="arrow" className={s.aboutArrow} group="scroll" />
        <h2 className={s.aboutHeadline} data-rise="">
          <span className={s.aboutCircled}>{t.aboutHeadline[0]}<Mark type="circle" className={s.aboutCircleMark} group="scroll" /></span>{t.aboutHeadline[1]}
        </h2>
        <div className={s.aboutAside} data-rise="">
          <p className={s.aboutBody}>{t.aboutBody}</p>
          <Mark type="doubleUnderline" className={s.aboutBodyMark} group="scroll" />
        </div>
        <div className={s.aboutSummary}>
          {SUMMARY_POINTS.map((point, index) => (
            <div className={s.aboutPoint} key={point}>
              <span>{t.aboutPoints[index]}</span>
              <SummaryIcon type={point} />
            </div>
          ))}
        </div>
      </section>

      <section className={s.works} id="works">
        <div className={s.sectionHead}>
          <h2 className={s.sectionTitle}>{t.worksTitle}</h2>
          <div className={s.worksNoteWrap}>
            <Mark type="arrow" className={s.worksArrow} group="scroll" />
            <p className={`${s.hand} ${s.sectionNote}`} data-drift="14">{t.worksNote}</p>
          </div>
        </div>
        {projects.map((project, index) => <Project key={project.slug} project={project} index={index} language={language} t={t} />)}
      </section>

      <section className={s.writing} id="writing">
        <div className={s.sectionHead}>
          <h2 className={s.sectionTitle}>{t.writingTitle}<Mark type="underline" className={s.titleUnderline} group="scroll" /></h2>
          <p className={`${s.hand} ${s.sectionNote}`} data-drift="14">{t.writingNote}</p>
        </div>
        <ol className={s.rows}>
          {articles.map((article, index) => (
            <li key={article.slug} className={s.row} data-row="">
              <Link href={`${t.home}/writing/${article.slug}`} className={s.rowLink}>
                <span className={s.rowImage}><img src={article.image || '/images/apjot-home.png'} alt="" width="480" height="360" loading="lazy" /></span>
                <span className={`${s.hand} ${s.rowIndex}`}>{String(index + 1).padStart(2, '0')}</span>
                <span className={s.rowMain}>
                  <span className={s.rowTitle}>{article.title}</span>
                  {article.tagline && <span className={s.rowTagline}>{article.tagline}</span>}
                </span>
                <span className={s.rowMeta}>
                  <span>{article.type === 'case-study' ? t.caseStudyLabel : t.article}</span>
                  {article.date && <span>{article.date}</span>}
                  <span className={s.rowRead}>{t.read} →</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        {!feedOnline && <p className={`${s.hand} ${s.offline}`}>{t.writingOffline}</p>}
        <p className={s.writingAll}><a className={s.link} href={contact.apjot} target="_blank" rel="noreferrer">{t.writingAll} · apjot.site<span aria-hidden="true"> →</span></a></p>
      </section>

      <section className={s.contact} id="contact">
        <h2 className={s.contactTitle} data-rise="">{t.contactTitle}</h2>
        <div className={s.contactFeature} data-rise="">
          <Mark type="sparks" className={`${s.contactDoodle} ${s.contactSpark}`} group="scroll" />
          <span className={`${s.hand} ${s.contactS}`}>S</span>
          <Image className={s.contactGlasses} src={heroAssets?.glasses?.src ?? '/rv/hero/prototype/glasses.webp'} alt={language === 'de' ? 'Brille' : 'Glasses'} width={heroAssets?.glasses?.w ?? 509} height={heroAssets?.glasses?.h ?? 268} sizes="(max-width: 760px) 52vw, 40vw" />
          <span className={`${s.hand} ${s.contactYou}`}>you!</span>
        </div>
        <p className={`${s.hand} ${s.contactPrompt}`} data-rise="">{t.contactPrompt}</p>
        <div className={s.contactCloser}>
          <Mark type="flower" className={`${s.contactDoodle} ${s.contactFlower}`} group="scroll" />
          <p>{t.contactCloser}</p>
          <Mark type="doubleUnderline" className={`${s.contactDoodle} ${s.contactCloserUnderline}`} group="scroll" />
          <Mark type="cherries" className={`${s.contactDoodle} ${s.contactCherries}`} group="scroll" />
        </div>
        <p className={s.contactMail}>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </p>
        <p className={s.contactLinks}>
          <a className={s.link} href={contact.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className={s.link} href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a className={s.link} href={contact.apjot} target="_blank" rel="noreferrer">Apjot</a>
        </p>
        <p className={s.footer}>{t.footer} · {new Date().getFullYear()}</p>
      </section>
    </main>
  );
}
