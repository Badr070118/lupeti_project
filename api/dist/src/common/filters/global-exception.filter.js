"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const client_1 = require("@prisma/client");
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    httpAdapterHost;
    logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    constructor(httpAdapterHost) {
        this.httpAdapterHost = httpAdapterHost;
    }
    catch(exception, host) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const requestId = request?.requestId;
        const { status, responseBody } = this.buildResponse(exception, request, requestId);
        if (status >= common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error({ requestId, path: request?.url, exception }, exception instanceof Error ? exception.stack : undefined);
        }
        else {
            this.logger.warn({ requestId, path: request?.url, exception });
        }
        httpAdapter.reply(ctx.getResponse(), responseBody, status);
    }
    buildResponse(exception, request, requestId) {
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'InternalServerError';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const response = exception.getResponse();
            if (typeof response === 'string') {
                message = response;
                error = exception.name;
            }
            else if (typeof response === 'object' && response !== null) {
                message =
                    response.message ?? message;
                error = response.error ?? exception.name;
            }
        }
        else if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            status = this.mapPrismaCodeToStatus(exception.code);
            message = exception.message;
            error = 'DatabaseError';
        }
        else if (exception instanceof Error) {
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
    mapPrismaCodeToStatus(code) {
        switch (code) {
            case 'P2002':
                return common_1.HttpStatus.CONFLICT;
            case 'P2003':
                return common_1.HttpStatus.BAD_REQUEST;
            default:
                return common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost])
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map