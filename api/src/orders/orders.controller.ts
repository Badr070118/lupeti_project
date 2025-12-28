import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CheckoutDto } from './dto/checkout.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  private getUserId(req: Request & { user?: JwtPayload }) {
    return req.user?.sub as string;
  }

  @Post('checkout')
  @Throttle({ default: { limit: 10, ttl: 60 } })
  checkout(
    @Req() req: Request & { user?: JwtPayload },
    @Body() dto: CheckoutDto,
  ) {
    return this.ordersService.checkout(this.getUserId(req), dto);
  }

  @Get('my')
  myOrders(@Req() req: Request & { user?: JwtPayload }) {
    return this.ordersService.listMyOrders(this.getUserId(req));
  }

  @Get('my/:id')
  myOrder(
    @Req() req: Request & { user?: JwtPayload },
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.ordersService.getMyOrder(this.getUserId(req), id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  listAll(@Query() query: OrdersQueryDto) {
    return this.ordersService.listAllOrders(query);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }
}
