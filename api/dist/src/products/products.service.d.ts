import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
declare const productInclude: {
    category: boolean;
    images: {
        orderBy: ({
            sortOrder: "asc";
            createdAt?: undefined;
        } | {
            createdAt: "asc";
            sortOrder?: undefined;
        })[];
    };
};
type ProductWithRelations = Prisma.ProductGetPayload<{
    include: typeof productInclude;
}>;
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listPublic(query: ProductQueryDto): Promise<{
        data: ({
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
            };
            images: {
                id: string;
                createdAt: Date;
                url: string;
                altText: string | null;
                sortOrder: number;
                productId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            currency: string;
            title: string;
            description: string;
            priceCents: number;
            stock: number;
            isActive: boolean;
            categoryId: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getPublic(slug: string): Promise<ProductWithRelations>;
    create(dto: CreateProductDto): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        };
        images: {
            id: string;
            createdAt: Date;
            url: string;
            altText: string | null;
            sortOrder: number;
            productId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        currency: string;
        title: string;
        description: string;
        priceCents: number;
        stock: number;
        isActive: boolean;
        categoryId: string;
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
        };
        images: {
            id: string;
            createdAt: Date;
            url: string;
            altText: string | null;
            sortOrder: number;
            productId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        currency: string;
        title: string;
        description: string;
        priceCents: number;
        stock: number;
        isActive: boolean;
        categoryId: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    addImage(productId: string, dto: CreateProductImageDto): Promise<{
        id: string;
        createdAt: Date;
        url: string;
        altText: string | null;
        sortOrder: number;
        productId: string;
    }>;
    removeImage(imageId: string): Promise<{
        success: boolean;
    }>;
    private generateProductSlug;
    private handlePrismaError;
}
export {};
