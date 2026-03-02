"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSettingsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = __importStar(require("multer"));
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const roles_guard_1 = require("../common/guards/roles.guard");
const update_homepage_settings_dto_1 = require("./dto/update-homepage-settings.dto");
const update_store_settings_dto_1 = require("./dto/update-store-settings.dto");
const settings_media_service_1 = require("./settings-media.service");
const settings_service_1 = require("./settings.service");
const uploadInterceptor = (0, platform_express_1.FileInterceptor)('file', {
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});
let AdminSettingsController = class AdminSettingsController {
    settingsService;
    mediaService;
    constructor(settingsService, mediaService) {
        this.settingsService = settingsService;
        this.mediaService = mediaService;
    }
    getAll() {
        return this.settingsService.getPublicSettings();
    }
    updateStore(dto) {
        return this.settingsService.updateStoreSettings(dto);
    }
    updateHomepage(dto) {
        return this.settingsService.updateHomepageSettings(dto);
    }
    upload(file) {
        return this.mediaService.saveContentImage(file);
    }
};
exports.AdminSettingsController = AdminSettingsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminSettingsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Patch)('store'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_store_settings_dto_1.UpdateStoreSettingsDto]),
    __metadata("design:returntype", void 0)
], AdminSettingsController.prototype, "updateStore", null);
__decorate([
    (0, common_1.Patch)('homepage'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_homepage_settings_dto_1.UpdateHomepageSettingsDto]),
    __metadata("design:returntype", void 0)
], AdminSettingsController.prototype, "updateHomepage", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)(uploadInterceptor),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof multer_1.File !== "undefined" && multer_1.File) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], AdminSettingsController.prototype, "upload", null);
exports.AdminSettingsController = AdminSettingsController = __decorate([
    (0, common_1.Controller)('admin/settings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [settings_service_1.SettingsService,
        settings_media_service_1.SettingsMediaService])
], AdminSettingsController);
//# sourceMappingURL=admin-settings.controller.js.map