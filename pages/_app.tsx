import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from 'components/Layout';
import StoreProvider from 'context/StoreContext';
import { IStore } from 'store';
import { NextComponentType } from 'next';

export type IApp = {
  initialValue: IStore;
  Component: NextComponentType & {
    layout?: boolean;
  };
} & AppProps;

function MyApp({ Component, pageProps, initialValue }: IApp) {
  const {} = Component;
  const renderLayout = () => {
    if (Component.layout === false) {
      return <Component {...pageProps} />;
    } else {
      return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      );
    }
  };
  return (
    <StoreProvider initialValue={initialValue}>{renderLayout()}</StoreProvider>
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
