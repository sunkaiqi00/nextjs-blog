import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOption } from 'config';
import { perpareConection } from 'db';
import { Tag } from 'db/entity';
import { ISession } from '../user/sendVerifyCode';

export default withIronSessionApiRoute(get, ironOption);

async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = req.session as ISession;
    const { userId } = session;

    const db = await perpareConection();
    const tagRepo = db.getRepository(Tag);

    const followTags = await tagRepo.find({
      relations: ['users'],
      where: {
        users: {
          id: userId
        }
        // tags_users_rel: { user_id: id }
      }
    });
    // (qb: any) => {
    //   qb.where('user_id = :id', { id: Number(userId) });
    // }
    // console.log('followTags: ', followTags);

    const allTags = await tagRepo.find({
      relations: ['users']
    });
    // console.log('allTags: ', allTags);
    res.status(200).json({
      code: 0,
      msg: 'tags标签获取成功',
      data: {
        followTags,
        allTags
      }
    });
  } catch (error) {
    console.log(error);

    res.status(200).json({
      code: -1,
      msg: 'tags标签获取成功失败'
    });
  }
}
