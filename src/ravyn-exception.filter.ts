// src/ravyn-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { captureException } from '@ravyn-team/node';
import { Response } from 'express';

@Catch()
export class RavynExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    captureException(exception as Error);

    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let messageStr = 'Internal server error';
    if (exception instanceof HttpException) {
      const resObj = exception.getResponse();
      if (typeof resObj === 'string') {
        messageStr = resObj;
      } else if (typeof resObj === 'object' && resObj !== null) {
        messageStr = (resObj as any).message || JSON.stringify(resObj);
        if (Array.isArray(messageStr)) {
          messageStr = messageStr.join(', ');
        }
      }
    } else if (exception instanceof Error) {
      messageStr = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: messageStr,
    });
  }
}