import Articlelist from 'components/ArticleList';
import { perpareConection } from 'db';
import { Article } from 'db/entity';
import type { NextPage } from 'next';
import { IArticle } from 'types';

type IHomePeops = {
  articles: IArticle[];
};

export async function getStaticProps() {
  const db = await perpareConection();

  const articles = await db.getRepository(Article).find({
    relations: ['user']
  });

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) as IArticle[]
    }
  };
}

const Home: NextPage<IHomePeops> = props => {
  const { articles } = props;
  // console.log(articles);

  return (
    <div className="container">
      <Articlelist articles={articles} />
    </div>
  );
};

export default Home;
