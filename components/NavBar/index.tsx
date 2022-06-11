import Link from "next/link";
import { Button, Row, Col, Menu } from "antd";

import navs from "./config";
import styles from './index.module.scss';
import Logo from "components/Logo";
import Login from "components/Login";
import { useState } from "react";

const NavBar = () => {
  const [isShowLogin, setIsShowLogin] = useState(false);
  // 跳转导航
  const switchNav = (data) => {
    console.log(data);
  }

  // 关闭登录
  const closeloginModal = () => {
    setIsShowLogin(false)
  }

  return <><Row className={styles.navbar}>
    <Col span={5}>
      <div className={`${styles.logoArea} ${styles.flexAlignColCenter}`}>
        <Logo />
      </div>
    </Col>
    <Col span={14}>
      <Menu mode="horizontal" defaultSelectedKeys={['/']} items={navs} onClick={(data) => switchNav(data)} />
    </Col>
    <Col span={5}>
      &nbsp;
      <Button>写文章</Button>&nbsp;
      <Button type="primary" onClick={() => setIsShowLogin(true)}>登录</Button>
    </Col>
  </Row>
    <Login visible={isShowLogin} onClose={closeloginModal} />
  </>
}

export default NavBar