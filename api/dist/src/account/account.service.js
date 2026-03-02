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
exports.AccountService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let AccountService = class AccountService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, deletedAt: null },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateProfile(userId, dto) {
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: {
                name: dto.name?.trim() || null,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return updated;
    }
    async listAddresses(userId) {
        return this.prisma.address.findMany({
            where: { userId },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });
    }
    async createAddress(userId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const existingCount = await tx.address.count({ where: { userId } });
            const shouldDefault = dto.isDefault ?? existingCount === 0;
            if (shouldDefault) {
                await tx.address.updateMany({
                    where: { userId },
                    data: { isDefault: false },
                });
            }
            const data = {
                user: { connect: { id: userId } },
                label: dto.label?.trim() || null,
                fullName: dto.fullName.trim(),
                phone: dto.phone?.trim() || null,
                line1: dto.line1.trim(),
                line2: dto.line2?.trim() || null,
                city: dto.city.trim(),
                state: dto.state?.trim() || null,
                postalCode: dto.postalCode.trim(),
                country: dto.country.trim(),
                type: (dto.type ?? client_1.AddressType.SHIPPING),
                isDefault: shouldDefault,
            };
            return tx.address.create({ data });
        });
    }
    async updateAddress(userId, id, dto) {
        const address = await this.prisma.address.findFirst({
            where: { id, userId },
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        return this.prisma.$transaction(async (tx) => {
            if (dto.isDefault) {
                await tx.address.updateMany({
                    where: { userId },
                    data: { isDefault: false },
                });
            }
            const data = {};
            if (dto.label !== undefined)
                data.label = dto.label?.trim() || null;
            if (dto.fullName !== undefined)
                data.fullName = dto.fullName?.trim() || null;
            if (dto.phone !== undefined)
                data.phone = dto.phone?.trim() || null;
            if (dto.line1 !== undefined)
                data.line1 = dto.line1.trim();
            if (dto.line2 !== undefined)
                data.line2 = dto.line2?.trim() || null;
            if (dto.city !== undefined)
                data.city = dto.city.trim();
            if (dto.state !== undefined)
                data.state = dto.state?.trim() || null;
            if (dto.postalCode !== undefined)
                data.postalCode = dto.postalCode.trim();
            if (dto.country !== undefined)
                data.country = dto.country.trim();
            if (dto.type !== undefined)
                data.type = dto.type;
            if (dto.isDefault !== undefined)
                data.isDefault = dto.isDefault;
            return tx.address.update({
                where: { id },
                data,
            });
        });
    }
    async removeAddress(userId, id) {
        const address = await this.prisma.address.findFirst({
            where: { id, userId },
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        await this.prisma.address.delete({ where: { id } });
        if (address.isDefault) {
            const next = await this.prisma.address.findFirst({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            });
            if (next) {
                await this.prisma.address.update({
                    where: { id: next.id },
                    data: { isDefault: true },
                });
            }
        }
        return { success: true };
    }
};
exports.AccountService = AccountService;
exports.AccountService = AccountService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccountService);
//# sourceMappingURL=account.service.js.map