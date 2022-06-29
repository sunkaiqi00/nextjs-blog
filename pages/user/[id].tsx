import {
  CodeOutlined,
  FundViewOutlined,
  WalletOutlined
} from '@ant-design/icons';
import { Avatar, Button, Divider } from 'antd';
import Articlelist from 'components/ArticleList';
import { perpareConection } from 'db';
import { Article, User } from 'db/entity';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { IArticle, IIdParams, IUserInfo } from 'types';

import styles from './index.module.scss';

export async function getStaticPaths() {
  return {
    paths: ['/user/id'],
    fallback: true
  };
}

export async function getStaticProps(regs: IIdParams) {
  const {
    params: { id }
  } = regs;

  const db = await perpareConection();
  const userRepo = db.getRepository(User);
  const articleRepo = db.getRepository(Article);
  const user = await userRepo.findOne({
    where: { id: Number(id) }
  });

  const articles = await articleRepo.find({
    where: {
      user: {
        id: Number(id)
      }
    },
    relations: ['user', 'tags']
  });
  // console.log('articles:', articles);

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      articles: JSON.parse(JSON.stringify(articles))
    }
  };
}

const UserInfo = (params: { user: IUserInfo; articles: IArticle[] }) => {
  const { user, articles } = params;
  const { push } = useRouter();
  const views = useMemo(() => {
    return articles?.reduce((prev, cur) => {
      return (prev += cur.views);
    }, 0);
  }, [articles]);

  const updateProfile = () => {
    push('/user/profile');
  };

  return (
    <div className={`${styles.userInfoWrapper} container`}>
      <div className={styles.left}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <Avatar src={user.avatar} size={100} alt="头像" />
          </div>
          <div className={styles.userMsg}>
            <div className={styles.userName}>{user.nickname}</div>
            <div className={styles.userJob}>
              <CodeOutlined />
              {user.job}
            </div>
            <div className={styles.userIntroduce}>
              <WalletOutlined />
              {user.introduce}
            </div>
          </div>
          <div className={styles.updateInfoBtn}>
            <Button onClick={updateProfile}>编辑个人资料</Button>
          </div>
        </div>
        <Divider />
        <Articlelist articles={articles} />
      </div>

      <div className={styles.right}>
        <div className={styles.headTitle}>个人成就</div>
        <Divider />
        <div className={styles.articleAchievement}>
          <div>
            <FundViewOutlined />
            共创作{articles.length}篇文章
          </div>
          <div>
            <FundViewOutlined />
            文章被阅读{views}次
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
