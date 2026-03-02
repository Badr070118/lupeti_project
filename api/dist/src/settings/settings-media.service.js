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
var SettingsMediaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsMediaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = require("path");
const ALLOWED_MIME = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
};
const MAX_FILE_SIZE = 5 * 1024 * 1024;
let SettingsMediaService = SettingsMediaService_1 = class SettingsMediaService {
    configService;
    logger = new common_1.Logger(SettingsMediaService_1.name);
    uploadsRoot;
    publicBase;
    contentDir;
    constructor(configService) {
        this.configService = configService;
        this.uploadsRoot =
            this.configService.get('UPLOADS_ROOT') ??
                (0, path_1.resolve)(process.cwd(), '..', 'apps', 'web', 'public', 'uploads');
        this.publicBase =
            this.configService.get('UPLOADS_PUBLIC_BASE') ?? '/uploads';
        this.contentDir = (0, path_1.join)(this.uploadsRoot, 'content');
    }
    async saveContentImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('Image file is required');
        }
        const extension = ALLOWED_MIME[file.mimetype];
        if (!extension) {
            throw new common_1.BadRequestException('Only JPEG, PNG or WEBP images are supported');
        }
        if (file.size > MAX_FILE_SIZE) {
            throw new common_1.BadRequestException('Image exceeds 5MB limit');
        }
        await fs_1.promises.mkdir(this.contentDir, { recursive: true });
        const filename = `${(0, crypto_1.randomUUID)()}${extension}`;
        const absolutePath = (0, path_1.join)(this.contentDir, filename);
        await fs_1.promises.writeFile(absolutePath, file.buffer);
        const publicBase = this.publicBase.endsWith('/')
            ? this.publicBase.slice(0, -1)
            : this.publicBase;
        const url = `${publicBase}/content/${filename}`;
        this.logger.log(`Stored content image at ${absolutePath}`);
        return { url };
    }
};
exports.SettingsMediaService = SettingsMediaService;
exports.SettingsMediaService = SettingsMediaService = SettingsMediaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SettingsMediaService);
//# sourceMappingURL=settings-media.service.js.map