import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOption } from 'config';
import { perpareConection } from 'db';
import { Article, Tag } from 'db/entity';
import { ITag } from 'pages/tag';

export default withIronSessionApiRoute(update, ironOption);

async function update(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, content, id, tagIds } = req.body;
    // console.log(title, content, id);

    const db = await perpareConection();
    const articleRepo = await db.getRepository(Article);
    const tagRepo = db.getRepository(Tag);

    const article = await articleRepo.findOne({
      where: { id },
      relations: ['user', 'tags']
    });

    // 数据库中上一次tags
    const prevTagIds = article?.tags?.map(tag => tag.id);
    // console.log(prevTagIds);

    let prevTags: Tag[] = [];
    if (prevTagIds && prevTagIds.length > 0) {
      prevTags = await tagRepo.find({
        where: prevTagIds?.map((id: number) => ({ id }))
      });
    }

    // 现在更新文章所选的tags
    let nowTags: Tag[] = [];
    if (tagIds && tagIds.length > 0) {
      nowTags = await tagRepo.find({
        where: tagIds?.map((tagId: number) => ({ id: tagId }))
      });
    }

    // console.log('prevTags:', prevTags);
    // console.log('nowTags:', nowTags);

    // res.status(200).json({
    //   code: 0
    // });
    // return;

    // console.log('article: ', article);
    if (article) {
      article.title = title;
      article.content = content;
      article.update_time = new Date();

      let unFollowTags: Tag[] = [];

      if (prevTags && nowTags) {
        let newFollowTags: Tag[] = [];
        // console.log('prevTagIds: ', prevTagIds);

        // 新关联的tag(更新时关联的tag如果在上一次的tag)
        nowTags?.forEach(tag => {
          if (!prevTagIds?.includes(tag.id)) {
            // console.log('new tag: ', tag);
            // 新添加tag
            tag.article_count += 1;
            newFollowTags.push(tag);
          }
        });

        // console.log('tagIds: ', tagIds);
        // 文章取消关联的tag

        for (let i = 0; i < prevTags.length; ) {
          let tag = prevTags[i];
          if (!tagIds?.includes(tag.id)) {
            // console.log('un tag: ', tag);

            // 取消的tag
            tag.article_count -= 1;
            unFollowTags.push(tag);
            prevTags.splice(i, 1);
          } else {
            i++;
          }
        }

        article.tags = newFollowTags.concat(prevTags);

        // console.log('followTags: ', article.tags);
      }

      // console.log('unFollowTags: ', unFollowTags);

      // res.status(200).json({
      //   code: -1
      // });

      // return;

      const unFollowRes = await tagRepo.save(unFollowTags);

      if (!unFollowRes) {
        res.status(200).json({
          code: -1,
          msg: '文章取关标签失败'
        });
        return;
      }

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
