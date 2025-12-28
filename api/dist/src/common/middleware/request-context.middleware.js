"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RequestContextMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContextMiddleware = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const REQUEST_ID_HEADER = 'x-request-id';
let RequestContextMiddleware = RequestContextMiddleware_1 = class RequestContextMiddleware {
    logger = new common_1.Logger(RequestContextMiddleware_1.name);
    use(req, res, next) {
        const incomingRequestId = req.header(REQUEST_ID_HEADER);
        const requestId = incomingRequestId ?? (0, crypto_1.randomUUID)();
        req.requestId = requestId;
        res.setHeader(REQUEST_ID_HEADER, requestId);
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            this.logger.log(`[${requestId}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
        });
        next();
    }
};
exports.RequestContextMiddleware = RequestContextMiddleware;
exports.RequestContextMiddleware = RequestContextMiddleware = RequestContextMiddleware_1 = __decorate([
    (0, common_1.Injectable)()
], RequestContextMiddleware);
//# sourceMappingURL=request-context.middleware.js.map