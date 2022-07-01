import { Button, Input, message, Select } from 'antd';
import { perpareConection } from 'db';
import { Article } from 'db/entity';
import dynamic from 'next/dynamic';
import { observer } from 'mobx-react-lite';
import { ChangeEvent, useEffect, useState } from 'react';
import { IArticle, IIdParams } from 'types';
import { useRouter } from 'next/router';
import http from 'api/http';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import styles from '../index.module.scss';

import { LayoutNextPage } from '../new';
import { ITag } from 'pages/tag';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export async function getStaticPaths() {
  return {
    paths: ['/editor/update/id'],
    fallback: true
  };
}

export async function getStaticProps(regs: IIdParams) {
  // console.log('regs: ', regs);
  const {
    params: { id }
  } = regs;

  const db = await perpareConection();

  const articleRepo = await db.getRepository(Article);

  const article = await articleRepo.findOne({
    where: { id },
    relations: ['user', 'tags']
  });

  return {
    props: {
      article: JSON.parse(JSON.stringify(article))
    }
  };
}

const ArticleEdit: LayoutNextPage = props => {
  const { article } = props as { article: IArticle };

  const router = useRouter();

  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [allTags, setAllTags] = useState<ITag[]>([]);
  const [tagIds, setTagIds] = useState<number[]>(
    article?.tags.map(tag => tag.id) || []
  );

  useEffect(() => {
    http.get('/api/tag/get').then(result => {
      const res = result as any;
      if (res.code === -1) return message.error(res.msg);
      setAllTags(res?.data?.allTags || []);
    });
  }, []);

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
        id: article.id,
        tagIds
      })
      .then((res: any) => {
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

  const handleSelectTag = (ids: number[]) => {
    setTagIds(ids);
  };

  return (
    <div className={styles.newEditor}>
      <div className={styles.editorHead}>
        <Input
          value={title}
          onChange={changeTitle}
          placeholder="请输入标题"
          style={{ flex: 3 }}
        />
        <Select
          mode="multiple"
          allowClear
          placeholder="请选择标签"
          style={{ flex: 1 }}
          defaultValue={tagIds}
          onChange={handleSelectTag}
        >
          {allTags?.map(tag => {
            return (
              <Select.Option key={tag.id} value={tag.id}>
                {tag.title}
              </Select.Option>
            );
          })}
        </Select>
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
