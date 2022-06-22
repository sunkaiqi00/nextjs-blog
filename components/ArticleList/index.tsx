import { Avatar, Card } from 'antd';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { EyeOutlined } from '@ant-design/icons';
import { markdownToTxt } from 'markdown-to-txt';

import { IArticle } from 'types';
import styles from './index.module.scss';
import { useRouter } from 'next/router';

interface IArticleList {
  articles: IArticle[];
}

const Articlelist = (props: IArticleList) => {
  const { articles } = props;
  const router = useRouter();

  const handlViewUser = (item: IArticle) => {
    router.push(`/user/${item.user.id}`);
  };

  const handleViewArticle = (item: IArticle) => {
    router.push(`/article/${item.id}`); ///detail
  };
  return (
    <ul className={styles.articleContainer}>
      {articles?.map(item => {
        return (
          <li
            className={styles.articleItem}
            key={item.id}
            onClick={() => handleViewArticle(item)}
          >
            <div className={styles.articleHead}>
              <div
                className={styles.userNickname}
                onClick={() => handlViewUser(item)}
              >
                {item.user.nickname}
              </div>
              <div className={styles.dividing}>|</div>
              <div>{formatDistanceToNow(new Date(item.update_time))}</div>
            </div>

            <div className={styles.articleContent}>
              <div className={styles.contentMain}>
                <div className={styles.contentMeta}>
                  <div className={styles.articleContentTitle}>{item.title}</div>
                  <div className={styles.articleContentText}>
                    {markdownToTxt(item.content)}
                  </div>
                </div>
                <ul className={styles.articleAction}>
                  <li className={styles.view}>
                    <EyeOutlined />
                    <span>{item.views}</span>
                  </li>
                  <li className={styles.like}>
                    <EyeOutlined />
                    <span>{item.views}</span>
                  </li>
                  <li className={styles.comment}>
                    <EyeOutlined />
                    <span>{item.views}</span>
                  </li>
                </ul>
              </div>

              <div className={styles.articleCover}>
                <img src="/images/article-img.webp" />
              </div>
            </div>
          </li>
        );
        // return (
        // <Card key={item.id} title={renderTitle(item)}>
        //   <h3>{item.title}</h3>
        //   <p>{item.content}</p>
        //   <div>
        //     <EyeOutlined />
        //     <span>{item.views}</span>
        //   </div>
        // </Card>
        // );
      })}
    </ul>
  );
};

export default Articlelist;
