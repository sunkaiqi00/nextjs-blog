import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOption } from 'config';
import { perpareConection } from 'db';
import { User } from 'db/entity';
import { ISession } from 'types';

export default withIronSessionApiRoute(profile, ironOption);

async function profile(req: NextApiRequest, res: NextApiResponse) {
  const { nickname, job, introduce } = req?.body;
  const session = req.session as ISession;
  const userId = session?.userId;
  const db = await perpareConection();
  const userRepo = db.getRepository(User);
  const userRes = await userRepo.findOne({
    where: { id: userId }
  });

  if (userRes) {
    userRes.nickname = nickname;
    userRes.job = job;
    userRes.introduce = introduce;

    const userInfo = await userRepo.save(userRes);

    if (userInfo) {
      res.status(200).json({
        code: 0,
        msg: '用户信息更新成功',
        data: userInfo
      });
    } else {
      res.status(200).json({
        code: -1,
        msg: '用户信息更新失败',
        data: {}
      });
    }
  } else {
    res.status(200).json({
      code: -1,
      msg: '用户信息获取失败',
      data: {}
    });
  }
}
