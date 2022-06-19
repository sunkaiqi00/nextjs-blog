export type IUserInfo = {
  userId: number | null;
  nickname: string | null;
  avatar: string | null;
};

export interface IUserStore {
  userInfo: IUserInfo;
  setUserInfo: (user: IUserInfo) => void;
}

const userStore = (): IUserStore => {
  return {
    userInfo: {
      userId: null,
      nickname: null,
      avatar: null
    },
    setUserInfo(user) {
      this.userInfo = user;
    }
  };
};

export default userStore;
