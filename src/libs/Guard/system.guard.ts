import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Roles } from 'src/configs/roles.config';
import { AuthService } from 'src/modules/auth/auth.service';
import { verifyToken } from 'src/utils/verifyToken';

export class SystemGuard implements CanActivate {
  constructor(private readonly userService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // const user = getUserRequest(request);
    if (request.headers.authorization) {
      const token = request.headers.authorization.split('Bearer ')[1];
      const { data } = verifyToken(token);
      if (data?.roles !== Roles.System) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      return true;
    }
    return false;
  }
}
