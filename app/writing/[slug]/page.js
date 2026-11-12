import ArticleView, { articleMetadata } from '../../site/writing/ArticleView';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return articleMetadata(slug);
}

export default async function WritingPage({ params }) {
  const { slug } = await params;
  return <ArticleView slug={slug} language="en" />;
}
