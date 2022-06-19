import Link from 'next/link';
import { Button, Row, Col, Menu, Dropdown, Avatar, Typography } from 'antd';
import { HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import navs from './config';
import styles from './index.module.scss';
import Logo from 'components/Logo';
import Login from 'components/Login';
import { useState } from 'react';
import { useStore } from 'context/StoreContext';

const NavBar = () => {
  const store = useStore();
  const { userId, nickname, avatar } = store.user.userInfo;

  const [isShowLogin, setIsShowLogin] = useState(false);
  // 跳转导航
  const switchNav = data => {
    console.log(data);
  };

  // 关闭登录
  const closeloginModal = () => {
    setIsShowLogin(false);
  };

  const renderDropDownMenu = () => {
    return (
      <Menu>
        <Menu.Item>
          <HomeOutlined />
          &nbsp; 个人主页
        </Menu.Item>
        <Menu.Item>
          <LogoutOutlined />
          &nbsp; 退出登录
        </Menu.Item>
      </Menu>
    );
  };
  return (
    <>
      <Row className={styles.navbar}>
        <Col span={5}>
          <div className={`${styles.logoArea} ${styles.flexAlignColCenter}`}>
            <Logo />
          </div>
        </Col>
        <Col span={14}>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['/']}
            items={navs}
            onClick={data => switchNav(data)}
          />
        </Col>
        <Col span={5}>
          <Button>写文章</Button>
          {userId != null ? (
            <Dropdown overlay={renderDropDownMenu()}>
              {/* <div> */}
              <Avatar src={avatar} />
              {/* <Typography.Text>{nickname}</Typography.Text>
              </div> */}
            </Dropdown>
          ) : (
            <Button type="primary" onClick={() => setIsShowLogin(true)}>
              登录
            </Button>
          )}
        </Col>
      </Row>
      <Login visible={isShowLogin} onClose={closeloginModal} />
    </>
  );
};

export default NavBar;
