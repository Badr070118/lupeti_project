import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCart(userId: string): Promise<any>;
    addItem(userId: string, dto: AddCartItemDto): Promise<any>;
    updateItem(userId: string, itemId: string, dto: UpdateCartItemDto): Promise<any>;
    removeItem(userId: string, itemId: string): Promise<any>;
    clearCart(userId: string): Promise<any>;
    private assertQuantity;
    private assertStock;
    private ensureCart;
    private mapCartProductImages;
}
