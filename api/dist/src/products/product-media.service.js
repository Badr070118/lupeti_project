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
var ProductMediaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductMediaService = void 0;
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
let ProductMediaService = ProductMediaService_1 = class ProductMediaService {
    configService;
    logger = new common_1.Logger(ProductMediaService_1.name);
    uploadsRoot;
    publicBase;
    productDir;
    constructor(configService) {
        this.configService = configService;
        this.uploadsRoot =
            this.configService.get('UPLOADS_ROOT') ??
                (0, path_1.resolve)(process.cwd(), '..', 'apps', 'web', 'public', 'uploads');
        this.publicBase =
            this.configService.get('UPLOADS_PUBLIC_BASE') ?? '/uploads';
        this.productDir = (0, path_1.join)(this.uploadsRoot, 'products');
    }
    async saveProductImage(file) {
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
        await fs_1.promises.mkdir(this.productDir, { recursive: true });
        const filename = `${(0, crypto_1.randomUUID)()}${extension}`;
        const absolutePath = (0, path_1.join)(this.productDir, filename);
        await fs_1.promises.writeFile(absolutePath, file.buffer);
        const publicBase = this.publicBase.endsWith('/')
            ? this.publicBase.slice(0, -1)
            : this.publicBase;
        const url = `${publicBase}/products/${filename}`;
        this.logger.log(`Stored product image at ${absolutePath}`);
        return { url };
    }
};
exports.ProductMediaService = ProductMediaService;
exports.ProductMediaService = ProductMediaService = ProductMediaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ProductMediaService);
//# sourceMappingURL=product-media.service.js.map