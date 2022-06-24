import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOption } from 'config';
import { perpareConection } from 'db';
import { Article } from 'db/entity';

export default withIronSessionApiRoute(update, ironOption);

async function update(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, content, id } = req.body;
    // console.log(title, content, id);

    const db = await perpareConection();
    const articleRepo = await db.getRepository(Article);

    const article = await articleRepo.findOne({
      where: { id },
      relations: ['user']
    });

    // console.log('article: ', article);
    if (article) {
      article.title = title;
      article.content = content;
      article.update_time = new Date();

      const result = await articleRepo.save(article);

      if (result) {
        res.status(200).json({
          code: 0,
          msg: '更新成功'
        });
      } else {
        res.status(200).json({
          code: -1,
          msg: '更新失败'
        });
      }
    } else {
      res.status(200).json({
        code: -1,
        msg: '更新失败，没找到这边文章'
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({
      code: -1,
      msg: (error as any).message || '更新失败'
    });
  }
}
