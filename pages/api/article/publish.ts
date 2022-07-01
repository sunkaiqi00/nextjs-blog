import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOption } from 'config';
import { perpareConection } from 'db';
import { Article, User, Tag } from 'db/entity';
import { ISession } from 'types';

export default withIronSessionApiRoute(publish, ironOption);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = req?.session as ISession;

    const { title, content, tagIds } = req?.body;

    const db = await perpareConection();

    const userRepo = db.getRepository(User);
    const articlesRepo = db.getRepository(Article);
    const tagRepo = db.getRepository(Tag);

    const user = await userRepo.findOne({
      where: { id: session.userId }
    });

    let tags: Tag[] = [];
    if (tagIds && tagIds.length) {
      tags = await tagRepo.find({
        where: tagIds?.map((tagId: number) => ({ id: tagId }))
      });
    }

    console.log('1312312 tags: ', tags);

    // res.status(200).json({
    //   code: -1
    // });
    // return;
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

    if (tags && tags.length) {
      let newTags = tags?.map(tag => {
        tag.article_count += 1;
        return tag;
      });
      article.tags = newTags;
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
  } catch (error) {
    console.log(error);
    res.status(200).json({
      code: -1,
      msg: (error as any).message || '发布失败'
    });
  }
}
