import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOption } from 'config';
import { perpareConection } from 'db';
import { Article, User } from 'db/entity';
import { ISession } from '../user/sendVerifyCode';

export default withIronSessionApiRoute(publish, ironOption);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session = req?.session as ISession;

  const { title, content } = req?.body;

  const db = await perpareConection();

  const userRepo = db.getRepository(User);
  const articlesRepo = db.getRepository(Article);

  const user = await userRepo.findOne({
    where: { id: session.userId }
  });

  const article = Article.create({
    title,
    content,
    create_time: new Date(),
    update_time: new Date(),
    is_delete: 0,
    views: 0
  });

  if (user) {
    article.user = user;
  }

  const result = await articlesRepo.save(article);

  if (result) {
    res.status(200).json({
      code: 0,
      msg: '发布成功',
      data: result
    });
  } else {
    res.status(200).json({
      code: -1,
      msg: '发布失败',
      data: {}
    });
  }
}
