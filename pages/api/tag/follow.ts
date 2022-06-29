import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOption } from 'config';
import { perpareConection } from 'db';
import { Tag, User } from 'db/entity';
import { ISession } from 'types';

export default withIronSessionApiRoute(get, ironOption);

async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = req.session as ISession;
    const { userId } = session;
    const { tagId, type } = req.body;

    const db = await perpareConection();
    const userRepo = db.getRepository(User);
    const tagRepo = db.getRepository(Tag);

    let tipText = '';

    const user = await userRepo.findOne({
      where: { id: userId }
    });

    const tag = await tagRepo.findOne({
      relations: ['users'],
      where: {
        id: tagId
      }
    });

    if (!user) {
      res.status(200).json({
        code: -1,
        msg: '请先登录'
      });
      return;
    }
    if (tag?.users) {
      if (type === 'follow') {
        tag.users = tag.users.concat(user);
        tag.follow_count += 1;
        tipText = '关注';
      } else if (type === 'unFollow') {
        tag.users = tag.users.filter(user => user.id !== userId);
        tag.follow_count -= 1;
        tipText = '取关';
      }
    }

    if (tag) {
      const resTag = await tagRepo.save(tag);
      if (resTag) {
        res.status(200).json({
          code: 0,
          msg: `${tipText}成功`,
          data: resTag
        });
      } else {
        res.status(200).json({
          code: -1,
          msg: `${tipText}失败`
        });
      }
    }
  } catch (error) {
    console.log(error);

    res.status(200).json({
      code: -1,
      msg: (error as any).message || '关注/取关失败'
    });
  }
}
