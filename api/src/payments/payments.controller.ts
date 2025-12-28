import {
  Body,
  Controller,
  Get,
  Header,
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
import { PaytrInitiateDto } from './dto/paytr-initiate.dto';
import { PaytrCallbackDto } from './dto/paytr-callback.dto';
import { PaymentsQueryDto } from './dto/payments-query.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  private getUserId(req: Request & { user?: JwtPayload }) {
    return req.user?.sub as string;
  }

  private getClientIp(req: Request) {
    const forwardedHeader = req.headers['x-forwarded-for'];
    const forwarded = Array.isArray(forwardedHeader)
      ? forwardedHeader[0]
      : (forwardedHeader ?? '');
    const ip = forwarded.toString().split(',')[0]?.trim();
    return ip || req.ip || req.socket.remoteAddress || '127.0.0.1';
  }

  @UseGuards(JwtAuthGuard)
  @Post('paytr/initiate')
  initiatePaytr(
    @Req() req: Request & { user?: JwtPayload },
    @Body() dto: PaytrInitiateDto,
  ) {
    return this.paymentsService.initiatePaytr(
      this.getUserId(req),
      dto,
      this.getClientIp(req),
    );
  }

  @Post('paytr/callback')
  @Header('Content-Type', 'text/plain')
  @Throttle({ default: { limit: 30, ttl: 60 } })
  async paytrCallback(@Body() payload: PaytrCallbackDto) {
    return this.paymentsService.handlePaytrCallback(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  listPayments(@Query() query: PaymentsQueryDto) {
    return this.paymentsService.listPayments(query);
  }
}
