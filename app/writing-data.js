import { caseStudies } from './case-studies-data';

// Keep the same Appwrite source used by apjot.site.
const appwriteEndpoint = 'https://cloud.appwrite.io/v1';
const appwriteProject = '65e833a890f01a3607c1';
const databaseId = '65e834a1b7b3800eafe3';
const collectionId = '65e837c03ab60c631376';

async function appwriteRequest(queries = []) {
  const params = new URLSearchParams();
  queries.forEach((item) => params.append('queries[]', item));

  try {
    const response = await fetch(
      `${appwriteEndpoint}/databases/${databaseId}/collections/${collectionId}/documents?${params}`,
      {
        headers: { 'X-Appwrite-Project': appwriteProject },
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) return [];
    const data = await response.json();
    return data.documents || [];
  } catch (error) {
    console.error('Unable to load Apjot articles:', error);
    return [];
  }
}

const caseStudyEntries = Object.values(caseStudies).map((project) => ({
  $id: `case-study-${project.slug}`,
  slug: project.slug,
  title: project.title,
  tagline: project.intro,
  image: project.image,
  created: null,
  author: project.role,
  tags: project.tags.split(' · '),
  articleType: 'case-study',
  project,
}));

export async function getWritingItems(limit = 100) {
  const remoteArticles = await appwriteRequest([
    JSON.stringify({ method: 'equal', attribute: 'publish', values: [true] }),
    JSON.stringify({ method: 'orderDesc', attribute: 'created' }),
    JSON.stringify({ method: 'limit', values: [limit] }),
  ]);

  const articles = remoteArticles.map((article) => ({
    ...article,
    articleType: 'article',
  }));

  return [...caseStudyEntries, ...articles];
}

export async function getWritingItem(slug) {
  const localArticle = caseStudyEntries.find((article) => article.slug === slug);
  if (localArticle) return localArticle;

  const articles = await appwriteRequest([
    JSON.stringify({ method: 'equal', attribute: 'slug', values: [slug] }),
    JSON.stringify({ method: 'limit', values: [1] }),
  ]);

  return articles[0] ? { ...articles[0], articleType: 'article' } : null;
}
