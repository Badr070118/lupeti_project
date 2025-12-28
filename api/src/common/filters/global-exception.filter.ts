import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request & { requestId?: string }>();
    const requestId = request?.requestId;

    const { status, responseBody } = this.buildResponse(
      exception,
      request,
      requestId,
    );

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        { requestId, path: request?.url, exception },
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn({ requestId, path: request?.url, exception });
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }

  private buildResponse(
    exception: unknown,
    request: Request | undefined,
    requestId?: string,
  ) {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'string') {
        message = response;
        error = exception.name;
      } else if (typeof response === 'object' && response !== null) {
        message =
          (response as { message?: string | string[] }).message ?? message;
        error = (response as { error?: string }).error ?? exception.name;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      status = this.mapPrismaCodeToStatus(exception.code);
      message = exception.message;
      error = 'DatabaseError';
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    return {
      status,
      responseBody: {
        statusCode: status,
        message,
        error,
        timestamp: new Date().toISOString(),
        path: request?.url,
        requestId,
      },
    };
  }

  private mapPrismaCodeToStatus(code: string): HttpStatus {
    switch (code) {
      case 'P2002':
        return HttpStatus.CONFLICT;
      case 'P2003':
        return HttpStatus.BAD_REQUEST;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
