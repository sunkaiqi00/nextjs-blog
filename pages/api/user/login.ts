import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { ironOption } from 'config';
import { perpareConection } from 'db';
import { User, UserAuth } from 'db/entity';
import { IronSessionProps } from './sendVerifyCode';
import { setCookie } from 'utils';

export default withIronSessionApiRoute(login, ironOption);

async function login(req: NextApiRequest, res: NextApiResponse) {
  const { phone = '', verifyCode = '', identity_type = 'phone' } = req.body;
  const session = req.session as IronSessionProps;
  const db = await perpareConection();
  const userAuthRepo = db.getRepository(UserAuth);
  const userRepo = db.getRepository(User);

  const cookies = Cookie.fromApiRoute(req, res);
  // console.log(verifyCode, session.verifyCode);

  if (
    String(verifyCode) == session.verifyCode ||
    session.verifyCode == undefined
  ) {
    // 在验证码正确 在user_auths表中查找是否有identity_type记录
    // const userAuth = await userAuthRepo.findOne({
    //   select: ['identity_type', 'identifier', 'id', 'user_id', ''],
    //   where: { identity_type, identifier: phone },
    //   relations: ['user']
    // });
    const userAuth = await userAuthRepo.findOne({
      where: { identity_type, identifier: phone },
      relations: ['user']
    });

    // console.log('userAuth: ', userAuth);

    if (userAuth) {
      const user = userAuth.user;
      const { id, nickname, avatar } = user;
      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;
      await session.save();
      setCookie(cookies, { userId: id, nickname, avatar });
      res.status(200).json({
        msg: '登录成功',
        code: 0,
        data: {
          userId: id,
          nickname,
          avatar
        }
      });
    } else {
      // 新用户 自动注册
      const user = User.create({
        nickname: `user_${phone}`,
        avatar: '/images/avatar.png',
        job: '',
        introduce: ''
      });

      const userAuth = UserAuth.create({
        identifier: phone,
        identity_type: identity_type,
        credential: session.verifyCode,
        user: user
      });

      // const userRes = await userRepo.save(user);
      // console.log('userRes: ', userRes);

      // 保存user_auths 自动保存users
      const userAuthRes = await userAuthRepo.save(userAuth);
      console.log('userAuthRes: ', userAuthRes);

      const {
        user: { id, nickname, avatar }
      } = userAuthRes;
      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;
      await session.save();
      setCookie(cookies, { userId: id, nickname, avatar });
      res.status(200).json({
        msg: '登录成功',
        code: 0,
        data: {
          userId: id,
          nickname,
          avatar
        }
      });
    }
  } else {
    res.status(200).json({
      msg: '验证码错误',
      code: -1
    });
  }

  // console.log('phone: ', phone);
  // console.log('verifyCode: ', verifyCode);
  // res.status(200).json({
  //   phone,
  //   verifyCode,
  //   code: 0
  // })
}
