import { perpareConection } from 'db';
import { Article } from 'db/entity';
import { IArticle } from 'types';

interface Iprops {
  params: {
    id: number;
  };
}

export async function getStaticPaths() {
  return {
    paths: ['/article/detail/id'],
    fallback: true
  };
}

export async function getStaticProps(regs: Iprops) {
  const {
    params: { id }
  } = regs;

  const db = await perpareConection();

  const article = await db.getRepository(Article).findOne({
    where: { id },
    relations: ['user']
  });

  console.log('article:', article);

  return {
    props: {
      article: JSON.parse(JSON.stringify(article))
    }
  };
}

const ArticleDetail = () => {
  return <h1>文章详情</h1>;
};

export default ArticleDetail;
