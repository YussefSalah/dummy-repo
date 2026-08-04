// import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
// import { captureException } from '@ravyn-team/node';
// import { Response } from 'express';

// @Catch()
// export class RavynExceptionFilter implements ExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();

//     // 1. Send the issue straight to Ravyn!
//     captureException(exception as Error);

//     // 2. Return the normal HTTP error to the user
//     const status = exception instanceof HttpException 
//       ? exception.getStatus() 
//       : HttpStatus.INTERNAL_SERVER_ERROR;

//     const message = exception instanceof HttpException 
//       ? exception.getResponse() 
//       : (exception as Error).message || 'Internal server error';

//     response.status(status).json({
//       statusCode: status,
//       timestamp: new Date().toISOString(),
//       message,
//     });
//   }
// }
