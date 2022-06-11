import { Layout } from 'antd'
import NavBar from "components/NavBar";

import styles from './index.module.scss';

const { Header, Footer, Content } = Layout;

const LayoutComp = ({ children }) => {
  return <Layout >
    <Header className={styles.layoutHeader}>
      <NavBar />
    </Header>
    <Content>Content</Content>
    <Footer>Footer</Footer>
  </Layout>
}

export default LayoutComp