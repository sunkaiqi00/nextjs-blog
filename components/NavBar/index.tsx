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
import { FormOutlined, HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import navs from './config';
import styles from './index.module.scss';
import Logo from 'components/Logo';
import Login from 'components/Login';
import { useState } from 'react';
import { useStore } from 'context/StoreContext';
import { MenuInfo } from 'rc-menu/lib/interface';
import http from 'api/http';
import { useRouter } from 'next/router';

const NavBar = () => {
  const store = useStore();
  // console.log(store);
  const { push } = useRouter();
  const { userId, nickname, avatar } = store.user.userInfo;

  const [isShowLogin, setIsShowLogin] = useState(false);
  // 跳转导航
  const switchNav = data => {
    console.log(data);
    let { key } = data;
    push(key);
  };

  // 写文章
  const openEditor = () => {
    if (userId) {
      push('/editor/new');
    } else {
      message.warning('请先登录');
    }
  };

  // 关闭登录
  const closeloginModal = () => {
    setIsShowLogin(false);
  };
  const dropDownClick = ({ key }: MenuInfo) => {
    if (key === 'logout') {
      handleLogout();
    } else if (key === 'profile') {
      push(`/user/${userId}`);
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
        <Menu.Item key="profile">
          <HomeOutlined />
          &nbsp; 个人主页
        </Menu.Item>
        <Menu.Item key="logout">
          <LogoutOutlined />
          &nbsp; 退出登录
        </Menu.Item>
      </Menu>
    );
  };
  return (
    <div className={styles.navBar}>
      <Row>
        <Col span={5}>
          <div className={styles.logoArea}>
            <Logo />
          </div>
        </Col>
        <Col span={14}>
          <Menu
            className={styles.navArea}
            mode="horizontal"
            defaultSelectedKeys={['/']}
            items={navs}
            onClick={data => switchNav(data)}
          />
        </Col>
        <Col span={5}>
          <div className={styles.btnArea}>
            <Button
              icon={<FormOutlined />}
              className={styles.writeBtn}
              onClick={() => openEditor()}
            >
              写文章
            </Button>
            {userId ? (
              <Dropdown overlay={renderDropDownMenu()}>
                {/* <div> */}
                <Avatar src={avatar} size={42} />
                {/* <Typography.Text>{nickname}</Typography.Text>
              </div> */}
              </Dropdown>
            ) : (
              <Button type="primary" onClick={() => setIsShowLogin(true)}>
                登录
              </Button>
            )}
          </div>
        </Col>
      </Row>
      <Login visible={isShowLogin} onClose={closeloginModal} />
    </div>
  );
};

export default observer(NavBar);
