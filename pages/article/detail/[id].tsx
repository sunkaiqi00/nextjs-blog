import { perpareConection } from 'db';
import { Article } from 'db/entity';
import Link from 'next/link';
import { IArticle } from 'types';
import MarkDown from 'markdown-to-jsx';
import styles from './index.module.scss';
import { format } from 'date-fns';
import Image from 'next/image';

export interface Iprops {
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

// 固定方法
export async function getStaticProps(regs: Iprops) {
  const {
    params: { id }
  } = regs;

  const db = await perpareConection();

  const article = await db.getRepository(Article).findOne({
    where: { id },
    relations: ['user']
  });

  // 文章阅读次数增加
  if (article) {
    const articleRepo = await db.getRepository(Article);
    article.views += 1;
    articleRepo.save(article);
  }

  // console.log('article:', article);

  return {
    props: {
      article: JSON.parse(JSON.stringify(article))
    }
  };
}

const ArticleDetail = (props: { article: IArticle }) => {
  const { article } = props;
  if (!article) return <></>;
  const {
    title,
    update_time,
    views,
    content,
    user: { userId, avatar, nickname }
  } = article;

  return (
    <div className={`${styles.articleDetail} container`}>
      <h1 className={styles.articleTitle}>{title}</h1>
      <div className={styles.authInfoBlock}>
        <div className={styles.avatarLink}>
          <Link href={`/user/${userId}`}>
            <Image
              src={avatar}
              className={styles.avatar}
              width="55px"
              height="55px"
              alt="头像"
            />
          </Link>
        </div>

        <div className={styles.authorInfoBox}>
          <div className={`${styles.authorName} ellipsis`}>{nickname}</div>
          <div className={styles.metaBox}>
            <time className={styles.time}>
              {format(new Date(update_time), 'yyyy-MM-dd HH:SS')}
            </time>
            <span className={styles.viewsCount}>
              &nbsp;·&nbsp;&nbsp;阅读 {views}
            </span>
            <Link href={`/editor/edit/${article.id}`}>编辑</Link>
          </div>
        </div>
      </div>
      <div className={styles.articleContent}>
        <MarkDown>{content || ''}</MarkDown>
      </div>
    </div>
  );
};

export default ArticleDetail;
