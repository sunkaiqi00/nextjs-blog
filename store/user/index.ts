import { IUserInfo } from 'types';

export interface IUserStore {
  userInfo: IUserInfo;
  setUserInfo: (user: IUserInfo) => void;
}

const userStore = (): IUserStore => {
  return {
    userInfo: {
      userId: -1,
      nickname: '',
      avatar: ''
    },
    setUserInfo(user) {
      this.userInfo = user;
    }
  };
};

export default userStore;
