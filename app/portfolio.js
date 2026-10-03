'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  FiActivity,
  FiDatabase,
  FiGlobe,
  FiMail,
  FiMapPin,
  FiMenu,
  FiMoon,
  FiPhone,
  FiSearch,
  FiServer,
  FiSun,
  FiX,
} from 'react-icons/fi';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import {
  SiAngular,
  SiCss,
  SiDjango,
  SiFigma,
  SiFirebase,
  SiFastapi,
  SiFlutter,
  SiGit,
  SiGooglecloud,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiPython,
  SiPostgresql,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si';
import { selectedProjects } from './projects-data';

const skillGroups = [
  { name: 'Frontend & Mobile', skills: [['Flutter', SiFlutter], ['Next.js', SiNextdotjs], ['React', SiReact], ['React Native', SiReact], ['TypeScript', SiTypescript], ['Tailwind CSS', SiTailwindcss]] },
  { name: 'Backend & APIs', skills: [['Python', SiPython], ['Django', SiDjango], ['DRF', FiServer], ['FastAPI', SiFastapi], ['REST APIs', FiGlobe]] },
  { name: 'Cloud & Data', skills: [['Firebase', SiFirebase], ['PostgreSQL', SiPostgresql], ['Google Cloud', SiGooglecloud]] },
  { name: 'AI & Healthcare', skills: [['RAG', FiSearch], ['FHIR', FiActivity], ['Healthcare API', FiDatabase]] },
  { name: 'Design & Tools', skills: [['Figma', SiFigma], ['Git', SiGit]] },
];

const floatingIcons = [SiJavascript, SiDjango, SiHtml5, SiCss, SiFigma, SiPython, SiReact];

const germanProjectCopy = {
  'oneclick-med-ehr': { title: 'OneClick-Med EHR', description: 'Eine elektronische Patientenakte für klinische und organisatorische Abläufe in Krankenhäusern. Ich arbeite als Full-Stack-Entwickler und an der technischen Architektur für Systeme rund um Gesundheitsversorgung, Interoperabilität, Performance, Sicherheit und externe Integrationen.', contribution: 'Lead Full-Stack Engineer', tags: 'EHR · Full-Stack · Systemarchitektur · Healthcare' },
  'beta-health': { title: 'Beta Health', description: 'Eine patientenorientierte Gesundheitsanwendung, die Menschen Zugang zu ihren Gesundheitsinformationen und ein besseres Verständnis dafür ermöglicht. Meine Arbeit umfasst die Architektur und Entwicklung eines RAG-Systems, das medizinische Unterlagen verständlicher macht.', contribution: 'Architektur & Full-Stack-Entwicklung', tags: 'KI · RAG · Healthcare · Mobile' },
  mytubenotes: { title: 'MyTubeNotes', description: 'Ein Lernbegleiter für YouTube, der Notizen, Transkripte, Screenshots und Informationssammlung in den Lernprozess integriert. Ich habe das Produkt mit zeitgestempelten Notizen, interaktiven Transkripten, Text- und Code-Extraktion sowie Exportfunktionen entworfen und entwickelt.', contribution: 'Design & Full-Stack-Entwicklung', tags: 'Web · Full-Stack · Cloud' },
  'habts-us': { title: 'Habts Us', description: 'Eine mobile Anwendung für Paare, die gemeinsame Gewohnheiten, Aufgaben und Notizen an einem Ort verbindet. Sie unterstützt Habit-Tracking, gemeinsame To-do-Listen und Notizen und ist im Apple App Store sowie bei Google Play verfügbar.', contribution: 'Mobile Anwendung', tags: 'React Native · Django REST Framework' },
};

const copy = {
  en: {
    language: 'en',
    otherLanguage: 'DE',
    otherHref: '/de',
    nav: ['About', 'Projects', 'Contact'],
    hello: 'hello',
    intro: 'I am Fai',
    role: 'Full-Stack Engineer',
    heroDescription: 'I design and build web and mobile products across the full stack, from user-facing experiences to backend systems and architecture. My recent work spans healthcare platforms, AI-enabled applications, and production software used in real-world environments.',
    viewWork: 'View selected projects',
    viewCaseStudy: 'View case study →',
    viewProject: 'View project →',
    aboutTitle: 'About Me',
    aboutIntro: 'I’m naturally curious about how things work and how they can be made better. That curiosity shapes how I approach software: understand the problem, explore different ideas, and turn them into something useful.',
    aboutDesign: 'I care about both how a product works and how it feels to use, with design influencing how I think about interfaces, workflows, and the details that make software feel intuitive.',
    process: 'My Process',
    processText: 'Most things I build start a little messy: a problem, a scrapbook of ideas, and a lot of questions. Then comes research, experimentation, building, breaking things, and refining until it works.',
    outside: 'Outside the Code',
    outsideIntro: 'Outside of software, writing and music are important creative outlets for me. I write through',
    outsideMiddle: 'and also enjoy songwriting.',
    outsideFootball: 'I’m also a football fan and enjoy playing whenever I get the chance.',
    getInTouch: 'Get in touch!',
    projectTitle: 'Selected Work',
    projectIntro: 'A selection of products and systems I have designed, built, and helped bring into production.',
    resources: 'Resources used',
    tasks: 'Tasks',
    projectDescription: 'Project Description',
    technologies: 'Technologies used',
    live: 'Live website',
    viewApp: 'View App',
    contactTitle: 'Get in touch !',
    submit: 'Submit',
    success: 'Thanks for your submission!',
    error: 'Oops! There was a problem submitting your form',
    name: 'Name', email: 'Email', subject: 'Subject', message: 'Message',
  },
  de: {
    language: 'de',
    otherLanguage: 'EN',
    otherHref: '/',
    nav: ['Über mich', 'Projekte', 'Kontakt'],
    hello: 'hallo',
    intro: 'Ich bin Fai',
    role: 'Full-Stack-Engineer',
    heroDescription: 'Ich entwerfe und entwickle Web- und Mobile-Produkte über den gesamten Stack hinweg – von nutzerorientierten Erlebnissen bis zu Backend-Systemen und Architekturen.',
    summary: 'Ich entwickle Web- und Mobile-Produkte über den gesamten Stack hinweg.',
    viewWork: 'Ausgewählte Projekte ansehen',
    viewCaseStudy: 'Fallstudie ansehen →',
    viewProject: 'Projekt ansehen →',
    aboutTitle: 'Über mich',
    aboutIntro: 'Ich bin von Natur aus neugierig darauf, wie Dinge funktionieren und wie sie besser gemacht werden können. Diese Neugier prägt meine Herangehensweise an Software: das Problem verstehen, verschiedene Ideen erkunden und daraus etwas Nützliches machen.',
    aboutDesign: 'Mir ist wichtig, wie ein Produkt funktioniert und wie es sich anfühlt. Design beeinflusst, wie ich über Benutzeroberflächen, Abläufe und die Details denke, die Software intuitiv machen.',
    process: 'Mein Prozess',
    processText: 'Mein Designprozess beginnt normalerweise mit einem Sammelbuch voller Ideen, bei denen ich noch nicht weiß, wie ich sie umsetzen soll. Er endet mit einem Eureka-Moment, wenn es endlich funktioniert. Dazwischen liegen viele Stunden Recherche, Lernen, Ausdauer, Musik und ein guter Burger.',
    outside: 'Außerhalb des Codes',
    outsideIntro: 'Außerhalb der Software sind Schreiben und Musik wichtige kreative Ausdrucksformen für mich. Ich schreibe über',
    outsideMiddle: 'und mache auch gerne Musik.',
    outsideFootball: 'Ich bin außerdem Fußballfan und spiele gerne, wann immer ich die Gelegenheit dazu bekomme.',
    getInTouch: 'Kontakt aufnehmen!',
    projectTitle: 'Ausgewählte Arbeiten',
    projectIntro: 'Eine Auswahl von Produkten und Systemen, die ich entworfen, entwickelt und in die Produktion begleitet habe.',
    resources: 'Verwendete Ressourcen',
    tasks: 'Aufgaben',
    projectDescription: 'Projektbeschreibung',
    technologies: 'Verwendete Technologien',
    live: 'Live-Website',
    viewApp: 'App ansehen',
    contactTitle: 'Kontakt aufnehmen!',
    submit: 'Senden',
    success: 'Vielen Dank für deine Nachricht!',
    error: 'Beim Senden ist ein Fehler aufgetreten.',
    name: 'Name', email: 'E-Mail', subject: 'Betreff', message: 'Nachricht',
  },
};

function IconButton({ label, children, onClick, className = '' }) {
  return <button type="button" aria-label={label} onClick={onClick} className={className}>{children}</button>;
}

export default function Portfolio({ language = 'en' }) {
  const t = copy[language];
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState('');
  const circleRef = useRef(null);
  const eyeBallRefs = useRef([]);

  useEffect(() => {
    const moveCircle = (event) => {
      if (circleRef.current) {
        circleRef.current.style.left = `${event.pageX}px`;
        circleRef.current.style.top = `${event.pageY}px`;
      }
    };
    document.addEventListener('mousemove', moveCircle);
    return () => document.removeEventListener('mousemove', moveCircle);
  }, []);

  useEffect(() => {
    const moveEyes = (event) => {
      eyeBallRefs.current.forEach((ball) => {
        if (!ball) return;
        const x = (event.clientX * 100) / window.innerWidth;
        const y = (event.clientY * 100) / window.innerHeight;
        ball.style.left = `${x}%`;
        ball.style.top = `${y}%`;
        ball.style.transform = `translate(-${x}%, -${y}%)`;
      });
    };

    window.addEventListener('pointermove', moveEyes);
    return () => window.removeEventListener('pointermove', moveEyes);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      const response = await fetch(form.action, {
        method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Request failed');
      form.reset();
      setFormStatus(t.success);
    } catch {
      setFormStatus(t.error);
    }
  }

  return (
    <main className={dark ? 'dark-theme' : ''}>
      <div id="circle" ref={circleRef} />
      <nav className="nav">
        <Link href={language === 'de' ? '/de' : '/'}><div className="logo"><h2>&lt;fai/&gt;</h2></div></Link>
        <div className="navlinks" style={{ display: menuOpen ? 'block' : undefined }}>
          <Link href={t.otherHref}>{t.otherLanguage}</Link>
          <a href="#about">{t.nav[0]}</a>
          <a href="#project">{t.nav[1]}</a>
        </div>
        <IconButton label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setDark(!dark)} className="theme-button">
          {dark ? <FiSun id="icon" /> : <FiMoon id="icon" />}
        </IconButton>
        <IconButton label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(!menuOpen)} className="menu">
          {menuOpen ? <FiX id="ham" /> : <FiMenu id="ham" />}
        </IconButton>
      </nav>

      <header>
        <div className="hero-container">
          <div className="hero">
            <div className="hello">
              <div className="hello-mark" aria-label="&lt;hello /&gt;"><span>&lt;</span><span>h</span><span>e</span><span>l</span><span>l</span><span>o</span><span> /&gt;</span></div>
              <h1 className="hero-title" style={{ '--typing-steps': t.intro.length }}><span>{t.intro}</span></h1>
              <h2 className="hero-role">{t.role}</h2>
              <p className="hero-description">{t.heroDescription}</p>
              <div id="mobile_gif"><object type="image/svg+xml" data="/images/mobile_gif.svg" width="65%" height="65%">SVG</object></div>
            </div>
            <p className="myintro">{t.summary}</p>
            <p className="work-link"><a href="#project" className="btnmywork">{t.viewWork}</a></p>
          </div>
          <div className="hero-left">
            <div className="float-container" aria-hidden="true">
              {floatingIcons.map((Icon, index) => (
                <div className={`languages lan${index + 1}`} key={index}>
                  <Icon />
                </div>
              ))}
            </div>
            <object type="image/svg+xml" data="/images/mobile_gif.svg" width="70%" height="70%">SVG</object>
            <div className="box"><div className="eye"><div className="ball" ref={(element) => { eyeBallRefs.current[0] = element; }} /></div><div className="eye"><div className="ball" ref={(element) => { eyeBallRefs.current[1] = element; }} /></div></div>
            <div className="social-links">
              <a href="mailto:nelsonfai21@yahoo.com" aria-label="Email"><FiMail /></a>
              <a href="https://www.linkedin.com/in/baiyong-nelson-841438169/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="https://github.com/nelsonfai" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
            </div>
          </div>
        </div>
      </header>

      <section className="about-me" id="about">
        <div className="about-wrapper">
          <div className="about-right"><img src="/images/profile_pic.jpg" width="90%" alt="Headshot of Nelson Fai" /></div>
          <div className="about-left">
            <h1>{t.aboutTitle}</h1>
            <p>{t.aboutIntro}</p>
            <p>{t.aboutDesign}</p>
            <h3>{t.process}</h3>
            <p>{t.processText}</p>
            <h3>{t.outside}</h3>
            <p>{t.outsideIntro} <a href="https://www.apjot.site" target="_blank" rel="noreferrer"><u>Apjot</u></a> {t.outsideMiddle}</p>
            <p>{t.outsideFootball}</p>
          </div>
        </div>
      </section>

      <section className="skills-section"><h1>Skills( )</h1><div id="skills-list">
        {skillGroups.map((group) => (
          <div className="category" key={group.name}><h4>{group.name}</h4><div className="skills-container">{group.skills.map(([name, SkillIcon]) => <div className="skill" key={name}><SkillIcon aria-label={name} className="skillImage" /><p>{name}</p></div>)}</div></div>
        ))}
      </div></section>

      <section className="projects-section"><div className="project-container" id="project">
        <div className="project-overview"><h1>{t.projectTitle}</h1><p>{t.projectIntro}</p></div>
        <div className="project-detail">{selectedProjects.map((project) => { const localized = language === 'de' ? { ...project, ...germanProjectCopy[project.slug] } : project; return <article className="project" key={project.slug}>{localized.image ? <img src={localized.image} alt={localized.title} width="100%" /> : <div className="project-placeholder">{localized.title}</div>}<h1>{localized.title}</h1><p>{localized.description}</p><h3>{localized.contribution}</h3><p className="project-tags">{localized.tags}</p><p>{localized.caseStudy ? <Link className="btnmywork" href={`/projects/${localized.slug}`}>{t.viewCaseStudy}</Link> : <a className="btnmywork" href={localized.url} target="_blank" rel="noreferrer">{t.viewProject}</a>}</p></article>; })}</div>
      </div></section>

    </main>
  );
}
