import { observer } from 'mobx-react-lite';
import {
  Button,
  Row,
  Col,
  Menu,
  Dropdown,
  Avatar,
  Typography,
  message
} from 'antd';
import { HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import navs from './config';
import styles from './index.module.scss';
import Logo from 'components/Logo';
import Login from 'components/Login';
import { useState } from 'react';
import { useStore } from 'context/StoreContext';
import { MenuInfo } from 'rc-menu/lib/interface';
import http from 'api/http';

const NavBar = () => {
  const store = useStore();
  // console.log(store);

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
  const dropDownClick = ({ key }: MenuInfo) => {
    if (key === '/logout') {
      handleLogout();
    }
  };
  const handleLogout = () => {
    http.get('/api/user/logout').then(res => {
      if (res.code === 0) {
        message.success(res.msg);
        store.user.setUserInfo({});
      }
    });
  };
  const renderDropDownMenu = () => {
    return (
      <Menu onClick={data => dropDownClick(data)}>
        <Menu.Item key="/profile">
          <HomeOutlined />
          &nbsp; 个人主页
        </Menu.Item>
        <Menu.Item key="/logout">
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
          {userId ? (
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

export default observer(NavBar);
