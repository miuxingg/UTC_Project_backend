import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { verifyToken } from 'src/utils/verifyToken';

export const User = createParamDecorator(
  (keys: string | string[] | undefined, ctx: ExecutionContext) => {
    keys = typeof keys === 'string' ? [keys] : keys;

    const request = ctx.switchToHttp().getRequest();
    if (request.headers.authorization) {
      const token = request.headers.authorization.split('Bearer ')[1];
      const { data } = verifyToken(token);
      if (data) {
        return data;
      }
    }

    return null;
  },
);
