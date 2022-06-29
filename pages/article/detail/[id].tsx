import { ChangeEvent, useState } from 'react';
import { perpareConection } from 'db';
import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import { Article } from 'db/entity';
import { IArticle, IComment, IIdParams } from 'types';
import MarkDown from 'markdown-to-jsx';
import styles from './index.module.scss';
import { format, formatDistanceToNow } from 'date-fns';
import { useStore } from 'context/StoreContext';
import { Avatar, Button, Input, message } from 'antd';
import http from 'api/http';

export async function getStaticPaths() {
  return {
    paths: ['/article/detail/id'],
    fallback: true
  };
}

// 固定方法
export async function getStaticProps(regs: IIdParams) {
  const {
    params: { id }
  } = regs;

  const db = await perpareConection();

  const article = await db.getRepository(Article).findOne({
    where: { id },
    relations: ['user', 'comments', 'comments.user']
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
  // console.log(article);

  const store = useStore();
  // 登录用户
  const loginUser = store.user.userInfo;

  const [commentText, setCommentText] = useState('');

  // if (!article) return <></>;
  const {
    title,
    update_time,
    views,
    content,
    id,
    comments,
    // 文章所属用户
    user: { id: u_id, avatar, nickname }
  } = article || { user: {} };

  const [commentsList, setComments] = useState(comments || []);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCommentText(val);
  };

  const publishComment = () => {
    http
      .post('/api/comment/publish', {
        content: commentText,
        userId: loginUser.userId,
        articleId: id
      })
      .then(result => {
        const res = result as any;
        console.log(res);

        if (res.code === 0) {
          message.success(res.msg);
          setCommentText('');
          const { id, content, update_time, create_time, user } =
            res.data as IComment;
          const item = {
            id,
            content,
            create_time,
            update_time,
            user
          };
          setComments([item].concat(commentsList.slice(0)));
        } else {
          message.error(res.msg);
        }
      });
  };

  return (
    <div className="container">
      <div className={styles.articleDetail}>
        <h1 className={styles.articleTitle}>{title}</h1>
        <div className={styles.authInfoBlock}>
          <div className={styles.avatarLink}>
            <Link href={`/user/${u_id}`}>
              <Avatar src={avatar || '/images/avatar-def.svg'} size={55} />
              {/* <Image
                src={avatar}
                className={styles.avatar}
                width="55px"
                height="55px"
                alt="头像"
              /> */}
            </Link>
          </div>

          <div className={styles.authorInfoBox}>
            <Link href={`/user/${u_id}`}>
              <div className={`${styles.authorName} ellipsis hover-pointer`}>
                {nickname}
              </div>
            </Link>
            <div className={styles.metaBox}>
              <time className={styles.time}>
                {format(new Date(update_time), 'yyyy-MM-dd HH:SS')}
              </time>
              <span className={styles.viewsCount}>
                &nbsp;&nbsp;·&nbsp;&nbsp;阅读 {views}
              </span>
              {loginUser.userId === u_id && (
                <Link href={`/editor/update/${article.id}`}>
                  &nbsp;&nbsp;编辑
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className={styles.articleContent}>
          <MarkDown>{content || ''}</MarkDown>
        </div>
      </div>
      <div className={styles.commentContainer}>
        <div className={styles.commentForm}>
          <div className={styles.commentFormHead}>评论</div>
          <div className={styles.commentContent}>
            <div className={styles.avatarBox}>
              {/* <Image
                src={loginUser.avatar || '/images/avatar-def.svg'}
                width={40}
                height={40}
                alt="avatar"
              /> */}
              <Avatar
                src={loginUser.avatar || '/images/avatar-def.svg'}
                size={42}
              />
            </div>
            <div className={styles.commentInput}>
              <Input.TextArea
                placeholder="请输入评论内容..."
                rows={4}
                value={commentText}
                onInput={handleInput}
              />
            </div>
          </div>
          <div className={styles.publishBtn}>
            <Button type="primary" block onClick={publishComment}>
              发 表
            </Button>
          </div>
        </div>
        <div className={styles.commentList}>
          <div className={styles.listTitle}>最新评论</div>
          <div className={styles.listWrapper}>
            {commentsList?.map(item => {
              return (
                <div className={styles.listItem} key={item.id}>
                  <div className={styles.userPopover}>
                    <Link href={`/user/${item.user.userId}`}>
                      <Avatar
                        src={item.user.avatar || '/images/avatar-def.svg'}
                      />
                    </Link>
                  </div>
                  <div className={styles.commentContent}>
                    <div className={styles.commentUser}>
                      <Link href={`/user/${item.user.userId}`}>
                        <span className="hover-pointer">
                          {item.user.nickname}
                        </span>
                      </Link>
                      <span>
                        {formatDistanceToNow(new Date(item.update_time))}
                      </span>
                    </div>
                    <div className={styles.commentText}>{item.content}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(ArticleDetail);
