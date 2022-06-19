import userStore, { IUserStore } from './user';

export interface IStore {
  user: IUserStore;
}

const createStore = (initialValue: IStore): (() => IStore) => {
  return () => {
    return {
      user: { ...userStore(), ...initialValue?.user }
    };
  };
};

export default createStore;
