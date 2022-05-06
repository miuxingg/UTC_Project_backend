import * as jwt from 'jsonwebtoken';
import { APP_SECRET } from 'src/configs';

export const generateToken = (id: string, roles: string) => {
  return jwt.sign(
    {
      data: { id, roles },
    },
    APP_SECRET,
    { expiresIn: '1h' },
  );
};
