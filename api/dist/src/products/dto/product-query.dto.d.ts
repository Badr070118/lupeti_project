export declare class ProductQueryDto {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
    sort?: 'newest' | 'price_asc' | 'price_desc';
    featured?: boolean;
    includeInactive?: boolean;
}
