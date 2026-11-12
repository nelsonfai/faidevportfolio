import { getWritingItems } from '../writing-data';

export function formatDate(date, language = 'en') {
  if (!date) return null;
  return new Date(date).toLocaleDateString(language === 'de' ? 'de-DE' : 'en', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Trims the Apjot feed down to what the homepage rows need.
export async function getWritingRows(limit = 5, language = 'en') {
  const all = await getWritingItems(limit);
  const feedOnline = all.some((article) => article.articleType === 'article');
  const essays = all.filter((article) => article.articleType === 'article');
  const caseStudies = all.filter((article) => article.articleType !== 'article');
  const rows = [...essays.slice(0, limit), ...caseStudies].slice(0, limit + caseStudies.length).map((article) => ({
    slug: article.slug,
    title: article.title,
    tagline: article.tagline || '',
    image: article.image || '/images/apjot-home.png',
    date: formatDate(article.created || article.$createdAt || article.publishedAt, language),
    type: article.articleType,
  }));
  return { rows, feedOnline };
}
