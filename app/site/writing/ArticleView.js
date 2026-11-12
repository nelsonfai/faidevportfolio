import Link from 'next/link';
import { notFound } from 'next/navigation';
import MermaidDiagram from '../../components/MermaidDiagram';
import { getWritingItem } from '../../writing-data';
import { formatDate } from '../articles';
import { fontVars } from '../fonts';
import { Mark } from '../Marks';
import SiteHeader from '../SiteHeader';
import s from '../site.module.css';

// Shared by /writing/[slug] and /de/writing/[slug]. The page
// chrome is localized; essay and case-study bodies are shown as written.
const labels = {
  en: { home: '/', essay: 'Article', caseStudy: 'Case study', back: 'All articles', title: 'Nelson Fai' },
  de: { home: '/de', essay: 'Artikel', caseStudy: 'Fallstudie', back: 'Alle Artikel', title: 'Nelson Fai', bodyNote: 'Dieser Beitrag ist auf Englisch verfasst.' },
};

export async function articleMetadata(slug) {
  const article = await getWritingItem(slug);
  return { title: article ? `${article.title} · Nelson Fai` : 'Nelson Fai' };
}

export default async function ArticleView({ slug, language = 'en' }) {
  const t = labels[language];
  const article = await getWritingItem(slug);
  if (!article) notFound();

  const project = article.project;
  const date = formatDate(article.created || article.$createdAt, language);
  const other = language === 'de' ? `/writing/${slug}` : `/de/writing/${slug}`;

  return (
    <main className={`${s.root} ${fontVars}`} lang={language}>
      <SiteHeader language={language} currentPage="article" otherHref={other} />
      <div className={s.articlePage}>
        <article className={s.article} lang="en">
          <p className={s.articleKicker} lang={language}>{project ? `${project.title} · ${t.caseStudy}` : t.essay}</p>
          <h1 className={s.articleTitle}>
            {project ? project.title : article.title}
            <Mark type="underline" className={s.articleUnderline} />
          </h1>
          {(project?.intro || article.tagline) && <p className={s.articleIntro}>{project?.intro || article.tagline}</p>}
          <p className={`${s.hand} ${s.articleMeta}`} lang={language}>{[project ? project.role : article.author || 'Nelson Fai', date, t.bodyNote].filter(Boolean).join(' · ')}</p>
          {article.image && (
            <figure className={s.articleCover}>
              <img src={article.image} alt="" />
            </figure>
          )}
          {project ? (
            project.sections.map(([title, content, diagram], index) => (
              <section key={title} className={s.section}>
                <span className={`${s.hand} ${s.sectionNumber}`}>{String(index + 1).padStart(2, '0')}</span>
                <h2>{title.replace(/^\d+\.\s*/, '')}</h2>
                <p>{content}</p>
                {diagram && <div className={s.diagram}><MermaidDiagram chart={diagram} /></div>}
              </section>
            ))
          ) : (
            <div className={s.prose} dangerouslySetInnerHTML={{ __html: article.body || '' }} />
          )}
          <Link href={`${t.home}#writing`} className={`${s.link} ${s.articleBack}`} lang={language}>← {t.back}</Link>
        </article>
      </div>
    </main>
  );
}
