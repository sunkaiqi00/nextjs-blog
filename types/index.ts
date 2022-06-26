export type IUserInfo = {
  userId: number | string;
  nickname: string;
  avatar: string;
  job: string;
  introduce: string;
};

export interface IComment {
  id: number;
  create_time: Date;
  update_time: Date;
  content: string;
  user: IUserInfo;
}

export interface IArticle {
  id: number;
  title: string;
  content: string;
  update_time: string;
  views: number;
  user: IUserInfo & {
    id: number;
  };
  comments: IComment[];
}
