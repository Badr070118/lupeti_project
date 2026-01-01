import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { SupportService } from './support.service';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  @UseGuards(OptionalJwtAuthGuard)
  createTicket(
    @Body() dto: CreateSupportTicketDto,
    @Req() req: Request & { user?: JwtPayload },
  ) {
    return this.supportService.createTicket(dto, req.user);
  }
}
