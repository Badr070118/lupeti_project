import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  private getUserId(req: Request & { user?: JwtPayload }) {
    return req.user?.sub as string;
  }

  @Get()
  getCart(@Req() req: Request & { user?: JwtPayload }) {
    return this.cartService.getCart(this.getUserId(req));
  }

  @Post('items')
  addItem(
    @Req() req: Request & { user?: JwtPayload },
    @Body() dto: AddCartItemDto,
  ) {
    return this.cartService.addItem(this.getUserId(req), dto);
  }

  @Patch('items/:itemId')
  updateItem(
    @Req() req: Request & { user?: JwtPayload },
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(this.getUserId(req), itemId, dto);
  }

  @Delete('items/:itemId')
  removeItem(
    @Req() req: Request & { user?: JwtPayload },
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
  ) {
    return this.cartService.removeItem(this.getUserId(req), itemId);
  }

  @Delete('clear')
  clear(@Req() req: Request & { user?: JwtPayload }) {
    return this.cartService.clearCart(this.getUserId(req));
  }
}
