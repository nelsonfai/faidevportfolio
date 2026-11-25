import Image from 'next/image';
import Link from 'next/link';
import { copy, projects, contact, checklist } from './content';
import SiteHeader from './SiteHeader';
import { Mark } from './Marks';
import { Browser } from './Demos';
import ClippyStage from './ClippyStage';
import Hero from './Hero';
import { supportsNextImageOptimization } from './imageSources';
import s from './site.module.css';
import SiteAnimations from './SiteAnimations';

const ABOUT_ICONS = {
  programming: { paths: ['M8 7 3 12l5 5', 'm16 7 5 5-5 5', 'm14 5-4 14'] },
  art: { paths: ['M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 1.2-3.6 1.8 1.8 0 0 1 1.1-3.2H18a3 3 0 0 0 3-3c0-4.5-4-8.2-9-8.2Z'], dots: [[7.5, 10], [11, 7.5], [15, 8.5], [7.5, 14.5]] },
  music: { paths: ['M10 18V5l11-2v13', 'M10 8l11-2'], dots: [[7, 18], [18, 16]], filled: true },
  electronics: { paths: ['M8 7h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z', 'M10 3v4m4-4v4m4-1h3m-3 4h3m-3 4h3m-3 4h3M10 17v4m4-4v4m-7-14H4m3 4H4m3 4H4m3 4H4'] },
  writing: { paths: ['m4 20 4.2-.9L19 8.3a2.1 2.1 0 0 0-3-3L5.2 16.1 4 20Z', 'm14.5 6.5 3 3'] },
};

function AboutPointIcon({ type }) {
  const icon = ABOUT_ICONS[type];
  return (
    <svg className={s.aboutPointIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {icon.paths.map((d) => <path key={d} d={d} />)}
      {icon.dots?.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.15" fill={icon.filled ? 'currentColor' : 'none'} />)}
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
    : <Image src={media.src} alt={project.title} width={media.w} height={media.h} sizes="(max-width: 760px) 92vw, min(62vw, 900px)" />);

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
          {project.view === 'clippy' && <Link className={s.link} href={language === 'de' ? '/de/clippy' : '/clippy'} data-analytics-click="project_details:clippy">{t.projectDetails}<span aria-hidden="true"> →</span></Link>}
          {project.caseStudy && <Link className={s.link} href={`${t.home}/writing/${project.slug}`} data-analytics-click={`project_case_study:${project.slug}`}>{t.caseStudy}<span aria-hidden="true"> →</span></Link>}
          {project.url && <a className={s.link} href={project.url} target="_blank" rel="noreferrer" data-analytics-click={`project_visit:${project.slug}`}>{t.view} {project.url.replace(/^https?:\/\/(www\.)?/, '')}<span aria-hidden="true"> →</span></a>}
        </p>
      </div>
    </article>
  );
}

export default function Revamp({ language = 'en', articles = [], feedOnline = true, heroAssets }) {
  const t = copy[language];


  return (
    <SiteAnimations language={language}>
      <SiteHeader language={language} />

      <main lang={language}>
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
        <p className={`${s.hand} ${s.aboutKicker}`} data-rise="">
          {t.aboutKicker}
          <Mark type="arrowDown" className={s.aboutArrow} group="scroll" />
        </p>
        <h2 className={s.aboutHeadline} data-rise="">
          <span className={s.aboutCircled}>{t.aboutHeadline[0]}<Mark type="circle" className={s.aboutCircleMark} group="scroll" /></span>{t.aboutHeadline[1]}
        </h2>
        <div className={s.aboutAside} data-rise="">
          <p className={s.aboutBody}>{t.aboutBody}</p>
          <Mark type="doubleUnderline" className={s.aboutBodyMark} group="scroll" />
        </div>
        {/* Icon row for the interests that connect the About section. */}
        <ol className={s.aboutSummary}>
          {t.aboutPoints.map((point, index) => (
            <li className={s.aboutPoint} key={point} data-rise="">
              <AboutPointIcon type={Object.keys(ABOUT_ICONS)[index]} />
              <span>{point}</span>
            </li>
          ))}
        </ol>
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
              <Link href={`${t.home}/writing/${article.slug}`} className={s.rowLink} data-analytics-click={`writing_open:${article.slug}`}>
                <span className={s.rowImage}>
                  {supportsNextImageOptimization(article.image || '/images/apjot-home.png')
                    ? <Image src={article.image || '/images/apjot-home.png'} alt="" fill sizes="(max-width: 760px) 30vw, min(28vw, 380px)" />
                    : <img src={article.image} alt="" loading="lazy" decoding="async" />}
                </span>
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
        <p className={s.writingAll}><a className={s.link} href={contact.apjot} target="_blank" rel="noreferrer" data-analytics-click="writing_archive">{t.writingAll} · apjot.site<span aria-hidden="true"> →</span></a></p>
      </section>

      <section className={s.contact} id="contact">
        <div className={s.contactFeature} data-rise="">
          <Mark type="sparks" className={`${s.contactDoodle} ${s.contactSpark}`} group="scroll" />
          <Image className={s.contactGlasses} src="/rv/hero/glasses-contact.webp" alt={language === 'de' ? 'Brille' : 'Glasses'} width={1728} height={910} quality={90} sizes="(max-width: 760px) 48vw, 28vw" />
        </div>
        <div className={s.todoStage}>
          <svg className={s.todoDoodles} viewBox="0 0 900 520" preserveAspectRatio="none" aria-hidden="true">
            <path d="M284 405v25m332-25v25" fill="none" stroke="var(--paper)" strokeLinecap="round" strokeWidth="10" />
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
              <path d="M145 224C97 212 68 183 63 141" />
              <path d="M63 141c-24 3-25-20-7-21-15-14 1-29 12-10 1-21 22-17 18 1 18-13 28 5 11 16-10 7-20 11-34 14Z" />
              <path d="M754 255c42 28 62 14 82-3" />
              <path d="M835 244v-13m16 19 11-8m-6 25 14-1" />
              <path d="M284 405v25m332-25v25" strokeDasharray="8 10" />
            </g>
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3">
              <path d="m43 105-9-7m24-16-2-12m18 15 6-11" />
            </g>
          </svg>
          <svg className={s.todoDoodlesMobile} viewBox="0 0 390 480" preserveAspectRatio="none" aria-hidden="true">
            <path d="M100 397v20m190-20v20" fill="none" stroke="var(--paper)" strokeLinecap="round" strokeWidth="10" />
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
              <path d="M100 397v20m190-20v20" strokeDasharray="7 9" />
            </g>
          </svg>
          <section className={s.todoNote} aria-labelledby="todo-title">
            <h3 className={s.todoTitle} id="todo-title">{t.todoTitle}</h3>
            <ul className={s.todoList}>
              {checklist.map((item) => (
                <li className={s.todoItem} key={item.id}>
                  <label htmlFor={`checklist-${item.id}`}>
                    <input id={`checklist-${item.id}`} type="checkbox" data-checklist-item={item.id} />
                    <span>{item[language]}</span>
                  </label>
                </li>
              ))}
            </ul>
            <Image className={s.todoPen} src="/rv/hero/prototype/black-pen.webp" alt="" aria-hidden="true" width={229} height={425} sizes="(max-width: 760px) 72px, 170px" />
          </section>
        </div>
        <div className={s.contactPrompt} data-rise="">
          <div className={s.contactColumns}>
            <p>{t.contactPrompt}</p>
            <p>{t.contactCloser}</p>
          </div>
          <svg className={s.contactShoes} viewBox="0 0 640 110" preserveAspectRatio="none" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
              <path d="M154 0v42m332-42v42" strokeDasharray="7 9" />
              <path d="M122 91c8-17 21-26 42-27l20 27-62 5Zm332 0c8-17 21-26 42-27l20 27-62 5Z" />
              <path d="m121 70-8-7m17-2-4-10m74 17 8-7m-17-2 4-10m246 21-8-7m17-2-4-10m74 17 8-7m-17-2 4-10" />
            </g>
          </svg>
        </div>
      </section>
      </main>
    </SiteAnimations>
  );
}
