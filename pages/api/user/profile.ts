import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOption } from 'config';
import { perpareConection } from 'db';
import { User } from 'db/entity';
import { ISession } from 'types';

export default withIronSessionApiRoute(profile, ironOption);

async function profile(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session as ISession;
  const userId = session?.userId;
  const db = await perpareConection();
  const userRepo = db.getRepository(User);
  const userRes = await userRepo.findOne({
    where: { id: userId }
  });
  if (userRes) {
    res.status(200).json({
      code: 0,
      msg: '用户信息获取成功',
      data: userRes
    });
  } else {
    res.status(200).json({
      code: -1,
      msg: '用户信息获取失败',
      data: {}
    });
  }
}
