import { Avatar, Card } from 'antd';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { EyeOutlined } from '@ant-design/icons';
import { IArticle } from 'types';

interface IArticleList {
  articles: IArticle[];
}

const Articlelist = (props: IArticleList) => {
  const { articles } = props;
  console.log(articles);
  const renderAvatar = (article: IArticle) => {
    const {
      update_time,
      user: { avatar }
    } = article;
    return (
      <div>
        <span>{formatDistanceToNow(new Date(update_time))}</span>
        <Link href={'/'}>
          <Avatar src={avatar} />
        </Link>
      </div>
    );
  };

  return (
    <>
      {articles?.map(item => {
        return (
          <Card
            key={item.id}
            title={item.user.nickname}
            extra={renderAvatar(item)}
          >
            <h3>{item.title}</h3>
            <p>{item.content}</p>
            <div>
              <EyeOutlined />
              <span>{item.views}</span>
            </div>
          </Card>
        );
      })}
    </>
  );
};

export default Articlelist;
