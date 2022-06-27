import type { NextPage } from 'next';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';

import { ChangeEvent, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { Button, Input, message, Select } from 'antd';
import http from 'api/http';
import { useStore } from 'context/StoreContext';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { ITag } from 'pages/tag';

export type LayoutNextPage = NextPage & {
  layout?: boolean;
};

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const NewEditor: LayoutNextPage = () => {
  const store = useStore();
  const { userId } = store.user.userInfo;

  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [allTags, setAllTags] = useState<ITag[]>([]);
  const [tagIds, setTagIds] = useState<number[]>([]);

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
  const handleChange = (content: string | undefined) => {
    if (content) {
      setContent(content);
    }
  };
  const publishArticle = () => {
    http
      .post('/api/article/publish', {
        title,
        content,
        tagIds
      })
      .then((res: any) => {
        if (res.code === 0) {
          message.success(res?.msg || '发布成功');
          router.push(`/user/${userId}`);
        } else {
          message.error(res?.msg || '发布失败');
        }
      });
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
        <Button type="primary" onClick={publishArticle}>
          发布
        </Button>
      </div>
      <MDEditor height={1080} value={content} onChange={handleChange} />
    </div>
  );
};
NewEditor.layout = false;

export default observer(NewEditor);
