import * as jwt from 'jsonwebtoken';
import { APP_SECRET } from 'src/configs';

export const verifyToken = (token: string) => {
  return jwt.verify(token, APP_SECRET);
};
