import { Button, message } from 'antd';
import http from 'api/http';
import Articlelist from 'components/ArticleList';
import { perpareConection } from 'db';
import { Article } from 'db/entity';
import type { NextPage } from 'next';
import { createRef, useEffect, useState } from 'react';
import { IArticle } from 'types';
import { ITag } from './tag';

type IHomePeops = {
  articles: IArticle[];
};

export async function getStaticProps() {
  const db = await perpareConection();

  const articles = await db.getRepository(Article).find({
    relations: ['user', 'tags']
  });

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) as IArticle[]
    }
  };
}

const Home: NextPage<IHomePeops> = props => {
  const basicArticles = createRef();

  const [articles, setArticles] = useState(props.articles || []);
  const [allTags, setAllTags] = useState<ITag[]>([]);
  useEffect(() => {
    http.get('/api/tag/get').then((res: any) => {
      if (res.code === -1) return message.error(res.msg);
      setAllTags(res?.data?.allTags || []);
    });
  }, []);

  const handleFilter = (tag: ITag) => {
    let tagId = tag.id;
    console.log(tagId);
    let result = articles.filter(article => {
      let tags = article.tags;
      let flag = tags.some(tag => tag.id === tagId);
      return flag;
    });
    setArticles(result);
  };
  const handleUnFilter = () => {
    setArticles(articles);
  };
  return (
    <div className="container">
      {/* className={styles.filterTagsWrapper} */}
      <div>
        {allTags?.map(tag => {
          return (
            <Button key={tag.id} onClick={() => handleFilter(tag)}>
              {tag.title}
            </Button>
          );
        })}
        {/* <Button onClick={handleUnFilter}>清楚</Button> */}
      </div>
      <Articlelist articles={articles} />
    </div>
  );
};

export default Home;
