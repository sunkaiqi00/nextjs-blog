import { NextApiRequest, NextApiResponse } from 'next'
import { format } from 'date-fns'
import md5 from 'md5';
import { encode } from 'js-base64'
import { withIronSessionApiRoute } from 'iron-session/next'
import http from 'api/http';
import { ironOption } from 'config'
import { IronSession } from 'iron-session';
export default withIronSessionApiRoute(sendVerifyCode, ironOption)

type IronSessionProps = IronSession & {
  verifyCode: number
}

async function sendVerifyCode(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { to = '', templateId = 1 } = req.body;
  // session 存储
  const session = req.session as IronSessionProps;
  // 主账户ID
  const AccountId = '8aaf070881368efb018156b63181098c';
  // 账户授权令牌
  const AuthToken = '475c15e57d9542f88b36eba530b97702';
  // 时间戳
  const timeStamp = format(new Date(), 'yyyyMMddHHmmss');

  // 
  const SigParameter = md5(`${AccountId}${AuthToken}${timeStamp}`);
  const Authorization = encode(`${AccountId}:${timeStamp}`)

  const AppId = '8aaf070881368efb018156b6329d0993';

  // 验证码
  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  // 过期时间
  const expireMinute = '5'

  console.log(timeStamp);
  console.log(SigParameter);
  console.log(Authorization);

  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`

  const response = await http.post(url, {
    to,
    templateId,
    appId: AppId,
    datas: [verifyCode, expireMinute]
  },
    {
      headers: {
        Authorization
      }
    }
  )

  // 类型待完善
  const { statusCode, statusMsg, templateSMS } = response as any;
  if (statusCode === '000000') {
    // 本地存储验证码
    session.verifyCode = verifyCode;
    await session.save()
    res.status(200).json({
      code: 0,
      message: '验证码获取成功',
      data: { templateSMS }
    })
  } else {
    res.status(200).json({
      code: statusCode,
      message: statusMsg
    })
  }

}