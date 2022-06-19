import React, { createContext, FC, ReactElement, useContext } from 'react';
import { useLocalObservable, enableStaticRendering } from 'mobx-react-lite';
import createStore, { IStore } from 'store';

export interface IProps {
  initialValue: any;
  children: ReactElement;
}

// ssr
enableStaticRendering(!typeof window);

const StoreContext = createContext({});

const StoreProvider: FC<IProps> = ({ initialValue, children }) => {
  // console.log(initialValue);

  const store = useLocalObservable(createStore(initialValue));
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext) as IStore;
  if (!store) {
    throw new Error('store is null');
  }
  return store;
};

export default StoreProvider;
