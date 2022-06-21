import { Layout } from 'antd';
import NavBar from 'components/NavBar';
import { ReactElement } from 'react';

import styles from './index.module.scss';

const { Header, Footer, Content } = Layout;

const LayoutComp = ({ children }: { children: ReactElement }) => {
  return (
    <Layout className={styles.layoutContainer}>
      <Header className={styles.layoutHeader}>
        <NavBar />
      </Header>
      <Content className={styles.layoutContent}>{children}</Content>
      <Footer>Footer</Footer>
    </Layout>
  );
};

export default LayoutComp;
