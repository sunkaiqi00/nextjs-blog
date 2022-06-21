import type { NextPage } from 'next';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';

import { ChangeEvent, useState } from 'react';
import styles from './index.module.scss';
import { Button, Input, message } from 'antd';
import http from 'api/http';
import { useStore } from 'context/StoreContext';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';

export type LayoutNextPage = NextPage & {
  layout?: boolean;
};

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const NewEditor: LayoutNextPage = () => {
  const store = useStore();
  const { userId } = store.user.userInfo;

  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('**Hello world!!!**');

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
        content
      })
      .then(res => {
        if (res.code === 0) {
          message.success(res?.msg || '发布成功');
          router.push(`/user/${userId}`);
        } else {
          message.error(res?.msg || '发布失败');
        }
      });
  };
  return (
    <div className={styles.newEditor}>
      <div className={styles.editorHead}>
        <Input value={title} onChange={changeTitle} />
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
