import * as jwt from 'jsonwebtoken';
import { APP_SECRET, EXPRIRE_TOKEN } from 'src/configs';

export const generateToken = (id: string, roles: string) => {
  return jwt.sign(
    {
      data: { id, roles },
    },
    APP_SECRET,
    { expiresIn: EXPRIRE_TOKEN },
  );
};
