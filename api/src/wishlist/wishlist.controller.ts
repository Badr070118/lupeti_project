import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  list(@Req() req: Request & { user?: JwtPayload }) {
    return this.wishlistService.list(req.user?.sub as string);
  }

  @Post('items')
  add(
    @Req() req: Request & { user?: JwtPayload },
    @Body() dto: AddWishlistItemDto,
  ) {
    return this.wishlistService.add(req.user?.sub as string, dto.productId);
  }

  @Delete('items/:productId')
  remove(
    @Req() req: Request & { user?: JwtPayload },
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return this.wishlistService.remove(req.user?.sub as string, productId);
  }
}
