import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStore } from 'context/StoreContext';
import http from 'api/http';
import { IUserInfo } from 'types';
import { Button, message, Tabs } from 'antd';
import * as ANTDICONS from '@ant-design/icons';

import styles from './index.module.scss';

export interface ITag {
  id: number;
  title: string;
  icon: string;
  follow_count: number;
  article_count: number;
  users: IUserInfo & { id: number }[];
}

const { TabPane } = Tabs;

const Tag = () => {
  const router = useRouter();
  const store = useStore();
  const { userId } = store?.user?.userInfo;
  const [followTags, setFollowTags] = useState<ITag[]>([]);
  const [allTags, setAllTags] = useState<ITag[]>([]);
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    http.get('/api/tag/get').then(result => {
      const res = result as any;
      if (res.code === -1) return message.error(res.msg);
      setAllTags(res?.data?.allTags || []);
      setFollowTags(res?.data?.followTags || []);
    });
  }, [needRefresh]);

  // 关注
  const handleFollowTag = (tagId: number) => {
    http
      .post('/api/tag/follow', {
        tagId,
        type: 'follow'
      })
      .then(result => {
        const res = result as any;
        if (res.code === -1) return message.error(res?.msg);
        message.success(res?.msg);
        setNeedRefresh(!needRefresh);
      });
  };
  // 取消关注
  const handleUnFollowTag = (tagId: number) => {
    http
      .post('/api/tag/follow', {
        tagId,
        type: 'unFollow'
      })
      .then(result => {
        const res = result as any;
        if (res.code === -1) return message.error(res?.msg);
        message.success(res?.msg);
        setNeedRefresh(!needRefresh);
      });
  };

  return (
    <div className={`${styles.tagsWrapper} container`}>
      <Tabs defaultActiveKey="all">
        <TabPane tab="已关注标签" key="follow">
          <div className={styles.allTAgs}>
            {followTags?.map(tag => {
              return (
                <div className={styles.tagsItem} key={tag.id}>
                  <div>{(ANTDICONS as any)[tag?.icon]?.render()}</div>
                  <div className={styles.tagTitle}>{tag.title}</div>
                  <div>
                    <span>{tag.follow_count} 关注</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span>{tag.article_count} 文章</span>
                  </div>
                  {tag?.users?.find(
                    item => Number(item.id) === Number(userId)
                  ) ? (
                    <Button
                      type="primary"
                      onClick={() => handleUnFollowTag(tag.id)}
                    >
                      取消关注
                    </Button>
                  ) : (
                    <Button onClick={() => handleFollowTag(tag.id)}>
                      关注
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </TabPane>
        <TabPane tab="全部标签" key="all">
          <div className={styles.allTAgs}>
            {allTags?.map(tag => {
              return (
                <div className={styles.tagsItem} key={tag.id}>
                  <div>{(ANTDICONS as any)[tag?.icon]?.render()}</div>
                  <div className={styles.tagTitle}>{tag.title}</div>
                  <div>
                    <span>{tag.follow_count} 关注</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <span>{tag.article_count} 文章</span>
                  </div>
                  {tag?.users?.find(
                    item => Number(item.id) === Number(userId)
                  ) ? (
                    <Button
                      type="primary"
                      onClick={() => handleUnFollowTag(tag.id)}
                    >
                      取消关注
                    </Button>
                  ) : (
                    <Button onClick={() => handleFollowTag(tag.id)}>
                      关注
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Tag;
