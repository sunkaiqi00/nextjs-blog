import { Button, Divider, Form, Input, message } from 'antd';
import http from 'api/http';
import { useStore } from 'context/StoreContext';
import {
  ChangeEvent,
  FormEvent,
  MouseEventHandler,
  useEffect,
  useState
} from 'react';
import { IUserInfo } from 'types';
import styles from './index.module.scss';

const UserProfile = () => {
  const [profile, setProfile] = useState<Partial<IUserInfo>>({
    nickname: '',
    job: '',
    introduce: ''
  });

  // console.log(profile);

  useEffect(() => {
    http.get('/api/user/profile').then((res: any) => {
      // console.log(res);
      if (res.code !== 0) return message.error(res?.msg || '用户信息获取失败');
      setProfile(res?.data || {});
    });
  }, []);

  const setProfileField = (
    key: string,
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = (event.target as HTMLInputElement).value;

    setProfile({
      ...profile,
      [key]: value
    });
  };

  const handleSubmit = () => {
    http.post('/api/user/updateProfile', profile).then((res: any) => {
      // console.log(res);
      if (res.code !== 0) return message.error(res?.msg || '个人资料更新失败');
      message.success(res?.msg || '个人资料更新成功');
      setProfile(res?.data || {});
    });
  };

  return (
    <div className={`${styles.profileWrapper} container`}>
      <h2 style={{ textAlign: 'center' }}>个人资料编辑</h2>
      <Divider />
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={handleSubmit}
        autoComplete="off"
        className={styles.form}
      >
        <Form.Item
          label="昵称"
          name="nickname"
          rules={[{ required: true, message: '请输入昵称' }]}
        >
          <Input
            value={profile.nickname}
            onInput={e => setProfileField('nickname', e)}
          />
        </Form.Item>

        <Form.Item label="工作" name="job">
          <Input.TextArea
            value={profile.job}
            onInput={e => setProfileField('job', e)}
          />
        </Form.Item>
        <Form.Item label="个人介绍" name="introduce">
          <Input.TextArea
            value={profile.introduce}
            onInput={e => setProfileField('introduce', e)}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
          <Button type="primary" htmlType="submit" style={{ width: '200px' }}>
            提 交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserProfile;
