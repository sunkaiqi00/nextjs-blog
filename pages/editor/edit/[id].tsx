import { Button, Input, message } from 'antd';
import { perpareConection } from 'db';
import { Article } from 'db/entity';
import dynamic from 'next/dynamic';
import { observer } from 'mobx-react-lite';
import { Iprops } from 'pages/article/detail/[id]';
import { ChangeEvent, useState } from 'react';
import { IArticle } from 'types';
import { useRouter } from 'next/router';
import http from 'api/http';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import styles from '../index.module.scss';

import { LayoutNextPage } from '../new';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export async function getStaticPaths() {
  return {
    paths: ['/editor/edit/id'],
    fallback: true
  };
}

export async function getStaticProps(regs: Iprops) {
  // console.log('regs: ', regs);
  const {
    params: { id }
  } = regs;

  const db = await perpareConection();

  const articleRepo = await db.getRepository(Article);

  const article = await articleRepo.findOne({
    where: { id },
    relations: ['user']
  });

  // console.log('article: ', article);

  return {
    props: {
      article: JSON.parse(JSON.stringify(article))
    }
  };
}

const ArticleEdit: LayoutNextPage = props => {
  const { article } = props as { article: IArticle };
  // console.log('article: ', article);
  const router = useRouter();
  // console.log(router);

  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');

  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
  };

  // 更新文章
  const updateArticle = () => {
    http
      .post('/api/article/update', {
        title,
        content,
        id: article.id
      })
      .then(res => {
        // console.log(res);
        if (res.code === 0) {
          message.success(res.msg);
          router.push(`/article/detail/${article.id}`);
        } else {
          message.error(res.msg);
        }
      });
  };

  // 更新内容
  const handleChange = (content: string | undefined) => {
    if (content) {
      setContent(content);
    }
  };

  return (
    <div className={styles.newEditor}>
      <div className={styles.editorHead}>
        <Input value={title} onChange={changeTitle} />
        <Button type="primary" onClick={updateArticle}>
          更新
        </Button>
      </div>
      <MDEditor height={1080} value={content} onChange={handleChange} />
    </div>
  );
};

ArticleEdit.layout = false;

export default observer(ArticleEdit);
