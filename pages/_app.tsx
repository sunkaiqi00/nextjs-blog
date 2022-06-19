import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from 'components/Layout';

import StoreProvider from 'context/StoreContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider initialValue={{}}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  );
}

export default MyApp;
