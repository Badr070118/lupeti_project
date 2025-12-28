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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const slugify_1 = require("../common/utils/slugify");
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async create(dto) {
        const slug = (0, slugify_1.ensureSlug)(dto.slug ?? dto.name, dto.name);
        try {
            return await this.prisma.category.create({
                data: {
                    name: dto.name,
                    slug,
                },
            });
        }
        catch (error) {
            this.handlePrismaError(error);
        }
    }
    async update(id, dto) {
        const data = {};
        if (dto.name) {
            data.name = dto.name;
        }
        if (dto.slug) {
            data.slug = (0, slugify_1.ensureSlug)(dto.slug, dto.name ?? dto.slug);
        }
        if (Object.keys(data).length === 0) {
            const category = await this.prisma.category.findUnique({
                where: { id },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
            return category;
        }
        try {
            return await this.prisma.category.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            this.handlePrismaError(error);
        }
    }
    async remove(id) {
        const existing = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Category not found');
        }
        const productCount = await this.prisma.product.count({
            where: { categoryId: id },
        });
        if (productCount > 0) {
            throw new common_1.ConflictException('Category cannot be deleted while products exist');
        }
        await this.prisma.category.delete({
            where: { id },
        });
        return { success: true };
    }
    handlePrismaError(error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            throw new common_1.ConflictException('Category slug already exists');
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025') {
            throw new common_1.NotFoundException('Category not found');
        }
        throw error;
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map