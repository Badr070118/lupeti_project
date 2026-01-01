"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("../auth/auth.module");
const roles_guard_1 = require("../common/guards/roles.guard");
const support_admin_controller_1 = require("./support-admin.controller");
const support_controller_1 = require("./support.controller");
const support_notifier_service_1 = require("./support-notifier.service");
const support_service_1 = require("./support.service");
let SupportModule = class SupportModule {
};
exports.SupportModule = SupportModule;
exports.SupportModule = SupportModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, config_1.ConfigModule],
        controllers: [support_controller_1.SupportController, support_admin_controller_1.SupportAdminController],
        providers: [support_service_1.SupportService, support_notifier_service_1.SupportNotifierService, roles_guard_1.RolesGuard],
        exports: [support_service_1.SupportService],
    })
], SupportModule);
//# sourceMappingURL=support.module.js.map