import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class ApplicationExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const responseCtx = ctx.getResponse<any>();
    const requestCtx = ctx.getRequest<any>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception?.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception?.response?.data?.errorMessage ?? // keycloak error
      exception?.response?.data ??
      exception?.response?.message ??
      exception.message ??
      'Unknown';

    responseCtx.status(status).json({
      statusCode: status,
      path: requestCtx.url,
      message,
      field: exception?.response?.field ?? '',
    });
  }
}
