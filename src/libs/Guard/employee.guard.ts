import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DashboardRolesAccess } from 'src/configs/roles.config';
import { AuthService } from 'src/modules/auth/auth.service';
import { verifyToken } from 'src/utils/verifyToken';

export class EmployeeGuard implements CanActivate {
  constructor(private readonly userService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.headers.authorization) {
      const token = request.headers.authorization.split('Bearer ')[1];
      const { data } = verifyToken(token);
      if (!DashboardRolesAccess.includes(data?.roles)) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      return true;
    }
    return false;
  }
}
