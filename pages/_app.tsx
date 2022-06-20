import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from 'components/Layout';
import StoreProvider from 'context/StoreContext';
import { IStore } from 'store';

export type IApp = {
  initialValue: IStore;
} & AppProps;

function MyApp({ Component, pageProps, initialValue }: IApp) {
  return (
    <StoreProvider initialValue={initialValue}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }: any) => {
  const { userId, nickname, avatar } = ctx?.req?.cookies || {};

  return {
    initialValue: {
      user: {
        userInfo: {
          userId,
          nickname,
          avatar
        }
      }
    }
  };
};

export default MyApp;
