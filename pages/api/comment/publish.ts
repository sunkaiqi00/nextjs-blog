import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOption } from 'config';
import { perpareConection } from 'db';
import { Article, User, Comment } from 'db/entity';

export default withIronSessionApiRoute(publish, ironOption);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { content = '', userId, articleId } = req.body;
    const db = await perpareConection();
    const commentRepo = db.getRepository(Comment);
    const userRepo = db.getRepository(User);

    const user = await userRepo.findOne({
      where: { id: userId }
    });

    const article = await db.getRepository(Article).findOne({
      where: { id: articleId }
    });

    // console.log(content, userId, articleId);

    const comment = new Comment();
    comment.content = content;
    comment.create_time = new Date();
    comment.update_time = new Date();
    comment.user = user || undefined;
    comment.article = article || undefined;
    // .create({
    //   content,
    //   create_time: new Date(),
    //   update_time: new Date(),
    //   user,
    //   article
    // });
    console.log('comment: ', comment);

    const resComment = await commentRepo.save(comment);
    // console.log(resComment);
    if (resComment) {
      res.status(200).json({
        code: 0,
        msg: '发表成功',
        data: resComment
      });
    } else {
      res.status(200).json({
        code: -1,
        msg: '发表失败'
      });
    }
  } catch (error) {
    res.status(200).json({
      code: -1,
      msg: (error as any).message || '发表失败'
    });
  }
}
