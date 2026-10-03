import Link from 'next/link';
import { notFound } from 'next/navigation';
import MermaidDiagram from '../../components/MermaidDiagram';
import { formatArticleDate, getBlogArticle } from '../../blog-data';

function ArticleBody({ body }) {
  if (!body) return null;
  return <div className="blog-article-body" dangerouslySetInnerHTML={{ __html: body }} />;
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const article = await getBlogArticle(slug);
  if (!article) notFound();

  const project = article.project;
  const sections = project?.sections || [];

  return (
    <main className="blog-article-page">
      <nav className="nav blog-nav">
        <Link href="/" className="logo"><h2>&lt;fai/&gt;</h2></Link>
        <Link href="/blog" className="blog-back">← All articles</Link>
      </nav>
      <article className="blog-article">
        <header className="blog-article-header">
          <p className="case-study-eyebrow">{project ? project.eyebrow : 'ARTICLE'}</p>
          <h1>{article.title}</h1>
          {article.tagline && <p className="blog-article-intro">{article.tagline}</p>}
          <div className="blog-article-meta">
            <span>{article.author || 'Nelson Fai'}</span>
            {formatArticleDate(article.created) && <span>{formatArticleDate(article.created)}</span>}
          </div>
        </header>
        {article.image && <img className="blog-article-image" src={article.image} alt={article.title} />}
        {project ? (
          <div className="blog-article-sections">
            {sections.map(([title, content, diagram], index) => (
              <section key={title}>
                <p className="case-study-number">{String(index + 1).padStart(2, '0')}</p>
                <h2>{title}</h2>
                <p>{content}</p>
                {diagram && <MermaidDiagram chart={diagram} />}
              </section>
            ))}
          </div>
        ) : (
          <ArticleBody body={article.body} />
        )}
        {article.tags?.length > 0 && (
          <div className="blog-article-tags">{article.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        )}
      </article>
    </main>
  );
}
