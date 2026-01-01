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
exports.SupportAdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const roles_guard_1 = require("../common/guards/roles.guard");
const reply_ticket_dto_1 = require("./dto/reply-ticket.dto");
const support_query_dto_1 = require("./dto/support-query.dto");
const update_ticket_status_dto_1 = require("./dto/update-ticket-status.dto");
const support_service_1 = require("./support.service");
let SupportAdminController = class SupportAdminController {
    supportService;
    constructor(supportService) {
        this.supportService = supportService;
    }
    list(query) {
        return this.supportService.listTickets(query);
    }
    get(id) {
        return this.supportService.getTicket(id);
    }
    updateStatus(id, dto, req) {
        return this.supportService.updateStatus(id, dto, req.user?.sub);
    }
    reply(id, dto, req) {
        return this.supportService.replyToTicket(id, dto, req.user);
    }
};
exports.SupportAdminController = SupportAdminController;
__decorate([
    (0, common_1.Get)('tickets'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [support_query_dto_1.SupportQueryDto]),
    __metadata("design:returntype", void 0)
], SupportAdminController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('tickets/:id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SupportAdminController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)('tickets/:id/status'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ticket_status_dto_1.UpdateTicketStatusDto, Object]),
    __metadata("design:returntype", void 0)
], SupportAdminController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)('tickets/:id/replies'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reply_ticket_dto_1.ReplyTicketDto, Object]),
    __metadata("design:returntype", void 0)
], SupportAdminController.prototype, "reply", null);
exports.SupportAdminController = SupportAdminController = __decorate([
    (0, common_1.Controller)('admin/support'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [support_service_1.SupportService])
], SupportAdminController);
//# sourceMappingURL=support-admin.controller.js.map