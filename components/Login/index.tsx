import { Button, Form, Input, Modal } from 'antd';
import CountDown from 'components/CountDown';
import { FC, useState, ChangeEvent, FormEvent } from 'react';

interface LoginProps {
  visible: boolean;
  onClose: () => void;
}

const Login: FC<LoginProps> = ({ visible, onClose }) => {
  // 表单值
  const [form, setForm] = useState({
    userphone: '',
    verifiCode: ''
  });
  // 是否显示获取验证码倒计时
  const [isShowVerifiCode, setIsShowVerifiCode] = useState(false);
  const updateForm = (key: string, event: FormEvent) => {
    let value = (event.target as HTMLInputElement).value;
    setForm({
      ...form,
      [key]: value
    });
  };

  // 获取手机验证码
  const getVerifiCode = () => {
    setIsShowVerifiCode(true);
  };
  const getVerifiCodeEnd = () => {
    console.log(111);

    setIsShowVerifiCode(false);
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
          name="verifiCode"
          rules={[{ required: true, message: '请输入验证码!' }]}
        >
          <Input
            value={form.verifiCode}
            placeholder="请输入验证码"
            onInput={e => updateForm('verifiCode', e)}
            addonAfter={
              isShowVerifiCode ? (
                <CountDown seconds={6} onEnd={() => getVerifiCodeEnd()} />
              ) : (
                <a onClick={() => getVerifiCode()}>获取验证码</a>
              )
            }
          />
        </Form.Item>
        {/* <Form.Item>
        <Input.Group compact>
          <Input
            value={form.verifiCode}
            placeholder="请输入验证码"
            onInput={e => updateForm('verifiCode', e)}
          />
          <Button>获取验证码</Button>
        </Input.Group>
      </Form.Item> */}
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
