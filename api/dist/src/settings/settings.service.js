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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SettingsService = class SettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStoreSettings() {
        const existing = await this.prisma.storeSettings.findFirst();
        if (existing)
            return existing;
        return this.prisma.storeSettings.create({
            data: {
                storeName: 'Lupeti',
            },
        });
    }
    async getHomepageSettings() {
        const existing = await this.prisma.homepageSettings.findFirst();
        if (existing)
            return existing;
        return this.prisma.homepageSettings.create({ data: {} });
    }
    async getPublicSettings() {
        const [store, homepage] = await Promise.all([
            this.getStoreSettings(),
            this.getHomepageSettings(),
        ]);
        return { store, homepage };
    }
    async updateStoreSettings(dto) {
        const existing = await this.getStoreSettings();
        return this.prisma.storeSettings.update({
            where: { id: existing.id },
            data: {
                ...dto,
                storeName: dto.storeName?.trim() || undefined,
                supportEmail: dto.supportEmail?.trim(),
                supportPhone: dto.supportPhone?.trim(),
                supportAddress: dto.supportAddress?.trim(),
                currency: dto.currency?.toUpperCase(),
            },
        });
    }
    async updateHomepageSettings(dto) {
        const existing = await this.getHomepageSettings();
        this.assertLocalUrl(dto.heroImageUrl, 'heroImageUrl');
        this.assertLocalUrl(dto.storyImageUrl, 'storyImageUrl');
        this.assertLocalUrl(dto.categoryDogImageUrl, 'categoryDogImageUrl');
        this.assertLocalUrl(dto.categoryCatImageUrl, 'categoryCatImageUrl');
        return this.prisma.homepageSettings.update({
            where: { id: existing.id },
            data: {
                ...dto,
                heroImageUrl: this.normalizeUrl(dto.heroImageUrl),
                storyImageUrl: this.normalizeUrl(dto.storyImageUrl),
                categoryDogImageUrl: this.normalizeUrl(dto.categoryDogImageUrl),
                categoryCatImageUrl: this.normalizeUrl(dto.categoryCatImageUrl),
            },
        });
    }
    async getShippingFees() {
        const settings = await this.getStoreSettings();
        return {
            standardCents: settings.shippingStandardCents,
            expressCents: settings.shippingExpressCents,
        };
    }
    async isPaytrEnabled() {
        const settings = await this.getStoreSettings();
        return settings.paytrEnabled;
    }
    normalizeUrl(value) {
        if (value === null)
            return null;
        if (!value)
            return undefined;
        return value.trim();
    }
    assertLocalUrl(value, field) {
        if (!value)
            return;
        if (value.startsWith('http')) {
            throw new common_1.BadRequestException(`${field} must reference a local asset`);
        }
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map