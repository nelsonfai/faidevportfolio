'use client';

import { useEffect, useRef } from 'react';
import { fontVars } from './fonts';
import s from './site.module.css';

export default function SiteAnimations({ children, language = 'en' }) {
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
          const heroPuzzle = one('[data-hero-puzzle]');
          const capNumber = one('[data-hero-cap-number]');
          const bookHint = one('[data-hero-hint]');
          const capItem = heroItems.find((item) => item.dataset.heroItem === 'cap');
          let capLandsAt = Infinity;
          let capShakeInterval = null;
          let capShakeTimeout = null;
          const strokeTime = (el, speed) => Math.max(0.1, el.getTotalLength() / speed);

          const shakeCap = () => {
            if (!capItem || capItem.dataset.dragging === 'true') return;
            const bounds = capItem.getBoundingClientRect();
            if (bounds.bottom < 0 || bounds.top > window.innerHeight) {
              stopCapShakes();
              return;
            }
            capItem.dataset.shaking = 'true';
            window.clearTimeout(capShakeTimeout);
            capShakeTimeout = window.setTimeout(() => { delete capItem.dataset.shaking; }, 2000);
          };
          const stopCapShakes = () => {
            window.clearInterval(capShakeInterval);
            window.clearTimeout(capShakeTimeout);
            capShakeInterval = null;
            capShakeTimeout = null;
            if (capItem) delete capItem.dataset.shaking;
          };

          gsap.set(q('[data-draw], [data-sign-a], [data-sign-b]'), { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.set([heroPuzzle, capNumber, bookHint], { autoAlpha: 0 });

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
            scrollTrigger: {
              trigger: one('[data-pin]'), start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true,
              onUpdate: (trigger) => {
                const settled = trigger.animation.time() >= capLandsAt;
                if (settled && capShakeInterval === null) {
                  shakeCap();
                  capShakeInterval = window.setInterval(shakeCap, 6000);
                }
                else if (!settled && capShakeInterval !== null) stopCapShakes();
              },
            },
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
            const start = 0.5 + (index % 4) * 0.15;
            const duration = 2.2 + (index % 3) * 0.35;
            tl.fromTo(item, { x: () => away(item, 'x'), y: () => away(item, 'y'), rotation: spin(index) }, { x: 0, y: 0, rotation: 0, duration, ease: 'power2.out', immediateRender: true }, start);
            if (item.dataset.heroItem === 'cap') {
              capLandsAt = start + duration;
              tl.to(capNumber, { autoAlpha: 1, duration: 0.15, ease: 'power1.out' }, capLandsAt);
              tl.fromTo(heroPuzzle, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power1.out', immediateRender: true }, capLandsAt + 0.1);
            }
            if (item.dataset.heroItem === 'notebook') {
              tl.to(bookHint, { autoAlpha: 1, duration: 0.15, ease: 'power1.out' }, start + duration);
            }
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
          cleanups.push(stopCapShakes);
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
    <div className={`${s.root} ${fontVars}`} ref={rootRef} data-anim="pending" lang={language}>
      <noscript><style>{'[data-anim="pending"] [data-stage]{visibility:visible!important}'}</style></noscript>
      {children}
    </div>
  );
}
