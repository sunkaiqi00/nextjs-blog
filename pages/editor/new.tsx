import type { NextPage } from 'next';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { ChangeEvent, useState } from 'react';
import styles from './index.module.scss';
import { Button, Input } from 'antd';

export type LayoutNextPage = NextPage & {
  layout?: boolean;
};

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const NewEditor: LayoutNextPage = () => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('**Hello world!!!**');

  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    console.log(val);
    setTitle(val);
  };
  const handleChange = (content: string | undefined) => {
    if (content) {
      setValue(content);
    }
  };
  const publishArticle = () => {};
  return (
    <div className={styles.newEditor}>
      <div className={styles.editorHead}>
        <Input value={title} onChange={changeTitle} />
        <Button type="primary" onClick={publishArticle}>
          发布
        </Button>
      </div>
      <MDEditor height={1080} value={value} onChange={handleChange} />
    </div>
  );
};
NewEditor.layout = false;

export default NewEditor;
