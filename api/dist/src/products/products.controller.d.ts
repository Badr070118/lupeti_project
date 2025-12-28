import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    list(query: ProductQueryDto): Promise<{
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
    getBySlug(slug: string): Promise<{
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
    addImage(id: string, dto: CreateProductImageDto): Promise<{
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
}
