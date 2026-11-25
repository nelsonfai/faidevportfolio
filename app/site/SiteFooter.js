import { copy, contact } from './content';
import { fontVars } from './fonts';
import s from './siteFooter.module.css';

export default function SiteFooter({ language = 'en' }) {
  const t = copy[language] || copy.en;
  const label = language === 'de' ? 'Kontakt' : 'Contact';

  return (
    <footer className={`${s.footer} ${fontVars}`} lang={language}>
      <p className={s.label}>{label}</p>
      <a className={s.email} href={`mailto:${contact.email}`} data-analytics-click="contact_email">{contact.email}</a>
      <nav className={s.links} aria-label={label}>
        <a href={contact.github} target="_blank" rel="noreferrer" data-analytics-click="contact_github">GitHub →</a>
        <a href={contact.linkedin} target="_blank" rel="noreferrer" data-analytics-click="contact_linkedin">LinkedIn →</a>
      </nav>
      <p className={s.credit}>{t.footer} · {new Date().getFullYear()}</p>
    </footer>
  );
}
