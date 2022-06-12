import { Button, Form, Input, Modal } from 'antd';
import CountDown from 'components/CountDown';
import { FC, useState, FormEvent } from 'react';
import { message } from 'antd';

import http from 'api/http';

interface LoginProps {
  visible: boolean;
  onClose: () => void;
}

const Login: FC<LoginProps> = ({ visible, onClose }) => {
  // 表单值
  const [form, setForm] = useState({
    userphone: '',
    verifyCode: ''
  });
  // 是否显示获取验证码倒计时
  const [isShowverifyCode, setIsShowverifyCode] = useState(false);
  const updateForm = (key: string, event: FormEvent) => {
    let value = (event.target as HTMLInputElement).value;
    setForm({
      ...form,
      [key]: value
    });
  };

  // 获取手机验证码
  const getVerifyCode = () => {
    const { userphone } = form;
    if (!userphone) {
      message.warning('请输入手机号！');
      return;
    }

    http
      .post('/api/user/sendVerifyCode', {
        to: userphone,
        templateId: 1
      })
      .then((res: any) => {
        if (res.code === 0) {
          message.info('验证码发送成功');
          setIsShowverifyCode(true);
        } else {
          message.error(res.message || '验证码获取错误');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const getVerifyCodeEnd = () => {
    console.log(111);

    setIsShowverifyCode(false);
  };
  return (
    <Modal visible={visible} title="手机号登录" footer={null}>
      <Form>
        <Form.Item
          name="userphone"
          rules={[{ required: true, message: '请输入手机号!' }]}
        >
          <Input
            value={form.userphone}
            placeholder="请输入手机号"
            onInput={e => updateForm('userphone', e)}
          />
        </Form.Item>
        <Form.Item
          name="verifyCode"
          rules={[{ required: true, message: '请输入验证码!' }]}
        >
          <Input
            value={form.verifyCode}
            placeholder="请输入验证码"
            onInput={e => updateForm('verifyCode', e)}
            addonAfter={
              isShowverifyCode ? (
                <CountDown seconds={6} onEnd={() => getVerifyCodeEnd()} />
              ) : (
                <a onClick={() => getVerifyCode()}>获取验证码</a>
              )
            }
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form.Item>
      </Form>
      <a>使用Github登录</a>
    </Modal>
  );
};

export default Login;
