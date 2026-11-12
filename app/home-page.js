import Revamp from './site/Revamp';
import { getHeroAssets } from './site/heroAssets';
import { getWritingRows } from './site/articles';

export default async function HomePage({ language = 'en' }) {
  const { rows, feedOnline } = await getWritingRows(5, language);
  return <Revamp language={language} articles={rows} feedOnline={feedOnline} heroAssets={getHeroAssets()} />;
}
