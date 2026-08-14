"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RavynExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const node_1 = require("@ravyn-team/node");
let RavynExceptionFilter = class RavynExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        (0, node_1.captureException)(exception);
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let messageStr = 'Internal server error';
        if (exception instanceof common_1.HttpException) {
            const resObj = exception.getResponse();
            if (typeof resObj === 'string') {
                messageStr = resObj;
            }
            else if (typeof resObj === 'object' && resObj !== null) {
                messageStr = resObj.message || JSON.stringify(resObj);
                if (Array.isArray(messageStr)) {
                    messageStr = messageStr.join(', ');
                }
            }
        }
        else if (exception instanceof Error) {
            messageStr = exception.message;
        }
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            message: messageStr,
        });
    }
};
exports.RavynExceptionFilter = RavynExceptionFilter;
exports.RavynExceptionFilter = RavynExceptionFilter = __decorate([
    (0, common_1.Catch)()
], RavynExceptionFilter);
//# sourceMappingURL=ravyn-exception.filter.js.map