import { IUserInfo } from 'types';

export const setCookie = (
  cookies: any,
  { userId, nickname, avatar }: IUserInfo
) => {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const path = '/';

  cookies.set('userId', userId, {
    expires,
    path
  });
  cookies.set('nickname', nickname, {
    expires,
    path
  });
  cookies.set('avatar', avatar, {
    expires,
    path
  });
};
