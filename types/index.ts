export type IUserInfo = {
  userId: number | string;
  nickname: string;
  avatar: string;
};

export interface IArticle {
  id: number;
  title: string;
  content: string;
  update_time: string;
  views: number;
  user: IUserInfo;
}
