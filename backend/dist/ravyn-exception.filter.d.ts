import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class RavynExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
}
