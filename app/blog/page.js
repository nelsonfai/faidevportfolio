import Link from 'next/link';
import { getBlogArticles, formatArticleDate } from '../blog-data';

export const metadata = {
  title: 'Blog | Nelson Fai',
  description: 'Articles and case studies by Nelson Fai.',
};

export default async function BlogPage() {
  const articles = await getBlogArticles();

  return (
    <main className="blog-page">
      <nav className="nav blog-nav">
        <Link href="/" className="logo"><h2>&lt;fai/&gt;</h2></Link>
        <Link href="/" className="blog-back">← Portfolio</Link>
      </nav>
      <header className="blog-header">
        <p className="case-study-eyebrow">WRITING / CASE STUDIES</p>
        <h1>Blog</h1>
        <p>Notes on software, product design, healthcare, and the systems behind the work.</p>
      </header>
      <section className="blog-grid" aria-label="Blog articles">
        {articles.map((article) => (
          <article className="blog-card" key={article.$id || article.slug}>
            <Link href={`/blog/${article.slug}`} className="blog-card-image-wrap">
              {article.image ? <img src={article.image} alt="" className="blog-card-image" /> : <div className="blog-card-placeholder" />}
            </Link>
            <div className="blog-card-content">
              <p className="blog-card-type">{article.articleType === 'case-study' ? 'Case study' : 'Article'}</p>
              <h2><Link href={`/blog/${article.slug}`}>{article.title}</Link></h2>
              {article.tagline && <p>{article.tagline}</p>}
              <div className="blog-card-meta">
                <span>{article.author || 'Nelson Fai'}</span>
                {formatArticleDate(article.created) && <span>{formatArticleDate(article.created)}</span>}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
