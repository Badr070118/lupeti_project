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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const roles_guard_1 = require("../common/guards/roles.guard");
const paytr_initiate_dto_1 = require("./dto/paytr-initiate.dto");
const paytr_callback_dto_1 = require("./dto/paytr-callback.dto");
const payments_query_dto_1 = require("./dto/payments-query.dto");
const payments_service_1 = require("./payments.service");
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    getUserId(req) {
        return req.user?.sub;
    }
    getClientIp(req) {
        const forwardedHeader = req.headers['x-forwarded-for'];
        const forwarded = Array.isArray(forwardedHeader)
            ? forwardedHeader[0]
            : (forwardedHeader ?? '');
        const ip = forwarded.toString().split(',')[0]?.trim();
        return ip || req.ip || req.socket.remoteAddress || '127.0.0.1';
    }
    initiatePaytr(req, dto) {
        return this.paymentsService.initiatePaytr(this.getUserId(req), dto, this.getClientIp(req));
    }
    async paytrCallback(payload) {
        return this.paymentsService.handlePaytrCallback(payload);
    }
    listPayments(query) {
        return this.paymentsService.listPayments(query);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('paytr/initiate'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, paytr_initiate_dto_1.PaytrInitiateDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "initiatePaytr", null);
__decorate([
    (0, common_1.Post)('paytr/callback'),
    (0, common_1.Header)('Content-Type', 'text/plain'),
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60 } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paytr_callback_dto_1.PaytrCallbackDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "paytrCallback", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payments_query_dto_1.PaymentsQueryDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "listPayments", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map