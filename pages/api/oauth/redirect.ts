import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { ironOption } from 'config';
import { perpareConection } from 'db';
import { User, UserAuth } from 'db/entity';
import { setCookie } from 'utils';
import { IronSessionProps } from '../user/sendVerifyCode';
import { githubClientId, githubClientSecret } from 'config/oauth';
import http from 'api/http';

export default withIronSessionApiRoute(redirect, ironOption);

async function redirect(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session as IronSessionProps;
  const cookies = Cookie.fromApiRoute(req, res);

  // http:localhost:3000/api/oauth/redirect?code=xxx
  const { code } = req?.query || {};

  const url = `https://github.com/login/oauth/access_token?client_id=${githubClientId}&client_secret=${githubClientSecret}&code=${code}`;

  const result = await http.post(
    url,
    {},
    {
      headers: {
        accept: 'application/json'
      }
    }
  );
  console.log('result: ', result);

  const { access_token } = result as any;

  console.log('access_token: ', access_token);

  const githubUserInfo = await http.get('https://api.github.com/user', {
    headers: {
      accept: 'application/json',
      Authorization: `token ${access_token}`
    }
  });
  console.log('githubUserInfo: ', githubUserInfo);

  const db = await perpareConection();
  const userAuthRepo = db.getRepository(UserAuth);

  const userAuth = await userAuthRepo.findOne({
    where: { identity_type: 'github', credential: githubClientId },
    relations: ['user']
  });
  console.log('userAuth: ', userAuth);

  if (userAuth) {
    // 之前登录过的用户，直接从 user 取出用户信息，并更新credential(凭证)
    userAuth.credential = access_token;

    const { id, nickname, avatar } = userAuth.user;

    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;
    await session.save();

    setCookie(cookies, { userId: id, nickname, avatar });

    res.writeHead(302, {
      location: '/'
    });
  } else {
    // 创建一个新用户，user和userAuth
    const { login = '', avatar_url = '' } = githubUserInfo as any;

    const user = User.create({
      nickname: login,
      avatar: avatar_url
    });

    const userAuth = UserAuth.create({
      identity_type: 'github',
      identifier: githubClientId,
      credential: access_token,
      user
    });

    const userAuthRes = await userAuthRepo.save(userAuth);
    console.log('userAuthRes: ', userAuthRes);

    const { id, nickname, avatar } = userAuthRes.user;

    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;
    await session.save();

    setCookie(cookies, { userId: id, nickname, avatar });

    res.writeHead(302, {
      location: '/'
    });

    // res.status(200).json({
    //   code: 200,
    //   msg: '登陆成功',
    //   data: {
    //     userId: id,
    //     nickname,
    //     avatar
    //   }
    // });
  }
}
