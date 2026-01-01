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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(query) {
        const page = query.page ?? 1;
        const limit = Math.min(Math.max(query.limit ?? 20, 1), 100);
        const skip = (page - 1) * limit;
        const where = this.buildWhere(query);
        const [items, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            data: items,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    }
    async create(dto) {
        const passwordHash = await this.hashSecret(dto.password);
        try {
            return await this.prisma.user.create({
                data: {
                    email: dto.email.toLowerCase(),
                    passwordHash,
                    name: dto.name?.trim() || null,
                    role: dto.role,
                    status: dto.status ?? client_1.UserStatus.ACTIVE,
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
        }
        catch (error) {
            if (error instanceof Error &&
                'code' in error &&
                error.code === 'P2002') {
                throw new common_1.BadRequestException('Email is already registered');
            }
            throw error;
        }
    }
    async update(id, dto) {
        const existing = await this.prisma.user.findUnique({ where: { id } });
        if (!existing || existing.deletedAt) {
            throw new common_1.NotFoundException('User not found');
        }
        if (existing.role === client_1.Role.ADMIN && dto.role && dto.role !== client_1.Role.ADMIN) {
            await this.ensureAnotherAdminExists(id);
        }
        const updated = await this.prisma.user.update({
            where: { id },
            data: {
                email: dto.email?.toLowerCase(),
                name: dto.name?.trim(),
                role: dto.role,
                status: dto.status,
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
    async resetPassword(id, dto) {
        const existing = await this.prisma.user.findUnique({ where: { id } });
        if (!existing || existing.deletedAt) {
            throw new common_1.NotFoundException('User not found');
        }
        const passwordHash = await this.hashSecret(dto.password);
        await this.prisma.user.update({
            where: { id },
            data: { passwordHash },
        });
        return { success: true };
    }
    async remove(id) {
        const existing = await this.prisma.user.findUnique({ where: { id } });
        if (!existing || existing.deletedAt) {
            throw new common_1.NotFoundException('User not found');
        }
        if (existing.role === client_1.Role.ADMIN) {
            await this.ensureAnotherAdminExists(id);
        }
        await this.prisma.user.update({
            where: { id },
            data: {
                status: client_1.UserStatus.INACTIVE,
                deletedAt: new Date(),
            },
        });
        return { success: true };
    }
    buildWhere(query) {
        const where = {
            deletedAt: null,
        };
        if (query.role) {
            where.role = query.role;
        }
        if (query.status) {
            where.status = query.status;
        }
        if (query.search) {
            where.OR = [
                { email: { contains: query.search, mode: 'insensitive' } },
                { name: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        return where;
    }
    async ensureAnotherAdminExists(excludeId) {
        const admins = await this.prisma.user.count({
            where: {
                role: client_1.Role.ADMIN,
                status: client_1.UserStatus.ACTIVE,
                deletedAt: null,
                NOT: excludeId ? { id: excludeId } : undefined,
            },
        });
        if (admins === 0) {
            throw new common_1.BadRequestException('At least one admin must remain active');
        }
    }
    hashSecret(value) {
        return argon2.hash(value, { type: argon2.argon2id });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map