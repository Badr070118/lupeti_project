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
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { ReplyTicketDto } from './dto/reply-ticket.dto';
import { SupportQueryDto } from './dto/support-query.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { SupportService } from './support.service';

@Controller('admin/support')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class SupportAdminController {
  constructor(private readonly supportService: SupportService) {}

  @Get('tickets')
  list(@Query() query: SupportQueryDto) {
    return this.supportService.listTickets(query);
  }

  @Get('tickets/:id')
  get(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.supportService.getTicket(id);
  }

  @Patch('tickets/:id/status')
  updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTicketStatusDto,
    @Req() req: Request & { user?: JwtPayload },
  ) {
    return this.supportService.updateStatus(id, dto, req.user?.sub as string);
  }

  @Post('tickets/:id/replies')
  reply(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ReplyTicketDto,
    @Req() req: Request & { user?: JwtPayload },
  ) {
    return this.supportService.replyToTicket(id, dto, req.user as JwtPayload);
  }
}
