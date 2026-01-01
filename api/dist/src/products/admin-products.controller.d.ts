import { File as MulterFile } from 'multer';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductsService } from './products.service';
export declare class AdminProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    list(query: ProductQueryDto): Promise<{
        data: {
            pricing: {
                originalPriceCents: number;
                finalPriceCents: number;
                isPromoActive: boolean;
                discountType: import(".prisma/client").$Enums.DiscountType | null;
                discountValue: number | null;
                savingsCents: number;
            };
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
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
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            discountType: import(".prisma/client").$Enums.DiscountType | null;
            originalPriceCents: number | null;
            isFeatured: boolean;
            promoStartAt: Date | null;
            currency: string;
            sku: string | null;
            title: string;
            description: string;
            priceCents: number;
            discountValue: number | null;
            promoEndAt: Date | null;
            stock: number;
            isActive: boolean;
            categoryId: string;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getById(id: string): Promise<{
        pricing: {
            originalPriceCents: number;
            finalPriceCents: number;
            isPromoActive: boolean;
            discountType: import(".prisma/client").$Enums.DiscountType | null;
            discountValue: number | null;
            savingsCents: number;
        };
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
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
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        discountType: import(".prisma/client").$Enums.DiscountType | null;
        originalPriceCents: number | null;
        isFeatured: boolean;
        promoStartAt: Date | null;
        currency: string;
        sku: string | null;
        title: string;
        description: string;
        priceCents: number;
        discountValue: number | null;
        promoEndAt: Date | null;
        stock: number;
        isActive: boolean;
        categoryId: string;
    }>;
    upload(file: MulterFile): Promise<{
        url: string;
    }>;
}
