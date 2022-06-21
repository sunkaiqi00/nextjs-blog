import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { ironOption } from 'config';
import { ISession } from './sendVerifyCode';
import { setCookie } from 'utils';

export default withIronSessionApiRoute(logout, ironOption);

async function logout(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session as ISession;
  await session.destroy();

  const cookies = Cookie.fromApiRoute(req, res);
  setCookie(cookies, { userId: '', nickname: '', avatar: '' });

  res.status(200).json({
    code: 0,
    msg: '退出登录成功',
    data: {}
  });
}
