import { Request } from 'express';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    private getUserId;
    getCart(req: Request & {
        user?: JwtPayload;
    }): Promise<any>;
    addItem(req: Request & {
        user?: JwtPayload;
    }, dto: AddCartItemDto): Promise<any>;
    updateItem(req: Request & {
        user?: JwtPayload;
    }, itemId: string, dto: UpdateCartItemDto): Promise<any>;
    removeItem(req: Request & {
        user?: JwtPayload;
    }, itemId: string): Promise<any>;
    clear(req: Request & {
        user?: JwtPayload;
    }): Promise<any>;
}
