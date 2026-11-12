import ArticleView, { articleMetadata } from '../../../site/writing/ArticleView';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return articleMetadata(slug);
}

export default async function WritingPageDe({ params }) {
  const { slug } = await params;
  return <ArticleView slug={slug} language="de" />;
}
