import * as jwt from 'jsonwebtoken';
import { APP_SECRET } from 'src/configs';

export const generateToken = (id: string) => {
  return jwt.sign(
    {
      data: { id },
    },
    APP_SECRET,
    { expiresIn: '1h' },
  );
};
