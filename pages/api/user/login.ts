import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOption } from 'config';

export default withIronSessionApiRoute(login, ironOption)

async function login(req: NextApiRequest, res: NextApiResponse) {
  const { phone = '', verifyCode = '' } = req.body;
  console.log('phone: ', phone);
  console.log('verifyCode: ', verifyCode);
  res.status(200).json({
    phone,
    verifyCode,
    code: 0
  })
}