import Link from 'next/link';
import s from './siteHeader.module.css';

const labels = {
  en: { works: 'works', writing: 'writings', about: 'about', contact: 'contact', language: 'DE', navLabel: 'Primary navigation', skip: 'Skip to main content' },
  de: { works: 'projekte', writing: 'texte', about: 'über mich', contact: 'kontakt', language: 'EN', navLabel: 'Hauptnavigation', skip: 'Zum Hauptinhalt springen' },
};

export default function SiteHeader({ language = 'en', currentPage = 'home', otherHref }) {
  const copy = labels[language] || labels.en;
  const home = language === 'de' ? '/de' : '/';
  const otherHome = language === 'de' ? '/' : '/de';
  const section = (name) => currentPage === 'home' ? `#${name}` : `${home}#${name}`;
  const otherPage = otherHref ? otherHref : currentPage === 'project'
    ? `${otherHome}/clippy`
    : currentPage === 'article'
      ? `${otherHome}#writing`
      : otherHome;
  const skipTarget = currentPage === 'article' ? '#article-title' : currentPage === 'project' ? '#clippy-title' : '#site-title';

  return (
    <>
      <a className={s.skipLink} href={skipTarget}>{copy.skip}</a>
      <header className={s.header}>
        <Link href={home} className={s.name} data-analytics-click="nav_home">Fai</Link>
        <nav className={s.links} aria-label={copy.navLabel}>
          <Link href={section('works')} data-analytics-click="nav_works">{copy.works}</Link>,{' '}
          <Link href={section('writing')} data-analytics-click="nav_writing">{copy.writing}</Link>,{' '}
          <Link href={section('about')} className={s.about} data-analytics-click="nav_about">{copy.about}</Link><span className={s.about}>, </span>
          <Link href={section('contact')} data-analytics-click="nav_contact">{copy.contact}</Link>
          <Link href={otherPage} className={s.language} data-analytics-click="nav_language">{copy.language}</Link>
        </nav>
      </header>
    </>
  );
}
