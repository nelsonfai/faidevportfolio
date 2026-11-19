import Link from 'next/link';
import s from './siteHeader.module.css';

const labels = {
  en: { works: 'works', writing: 'writings', about: 'about', contact: 'contact', language: 'DE', navLabel: 'Primary navigation' },
  de: { works: 'projekte', writing: 'texte', about: 'über mich', contact: 'kontakt', language: 'EN', navLabel: 'Hauptnavigation' },
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

  return (
    <header className={s.header}>
      <Link href={home} className={s.name}>Fai</Link>
      <nav className={s.links} aria-label={copy.navLabel}>
        <Link href={section('works')}>{copy.works}</Link>,{' '}
        <Link href={section('writing')}>{copy.writing}</Link>,{' '}
        <Link href={section('about')} className={s.about}>{copy.about}</Link><span className={s.about}>, </span>
        <Link href={section('contact')}>{copy.contact}</Link>
        <Link href={otherPage} className={s.language}>{copy.language}</Link>
      </nav>
    </header>
  );
}
