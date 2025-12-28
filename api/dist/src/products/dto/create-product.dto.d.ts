export declare class CreateProductDto {
    title: string;
    description: string;
    priceCents: number;
    currency?: string;
    stock: number;
    isActive?: boolean;
    categoryId: string;
    slug?: string;
}
