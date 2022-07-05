import { Button, Divider, Form, Input, message } from 'antd';
import http from 'api/http';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import styles from './index.module.scss';

const UserProfile = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    http.get('/api/user/profile').then((res: any) => {
      // console.log(res);
      if (res.code !== 0) return message.error(res?.msg || '用户信息获取失败');
      form.setFieldsValue(res?.data || {});
    });
  }, [form]);

  const handleSubmit = () => {
    let profile = form.getFieldsValue();
    http.post('/api/user/updateProfile', profile).then((res: any) => {
      // console.log(res);
      if (res.code !== 0) return message.error(res?.msg || '个人资料更新失败');
      message.success(res?.msg || '个人资料更新成功');
      form.setFieldsValue(res?.data || {});
    });
  };

  return (
    <div className={`${styles.profileWrapper} container`}>
      <h2 style={{ textAlign: 'center' }}>个人资料编辑</h2>
      <Divider />
      <Form
        name="profileForm"
        form={form}
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
          <Input />
        </Form.Item>

        <Form.Item label="工作" name="job">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="个人介绍" name="introduce">
          <Input.TextArea />
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

export default observer(UserProfile);
