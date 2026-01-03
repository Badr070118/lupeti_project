import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { AccountService } from './account.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('account')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('profile')
  getProfile(@Req() req: Request & { user?: JwtPayload }) {
    return this.accountService.getProfile(req.user?.sub as string);
  }

  @Patch('profile')
  updateProfile(
    @Req() req: Request & { user?: JwtPayload },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.accountService.updateProfile(req.user?.sub as string, dto);
  }

  @Get('addresses')
  listAddresses(@Req() req: Request & { user?: JwtPayload }) {
    return this.accountService.listAddresses(req.user?.sub as string);
  }

  @Post('addresses')
  createAddress(
    @Req() req: Request & { user?: JwtPayload },
    @Body() dto: CreateAddressDto,
  ) {
    return this.accountService.createAddress(req.user?.sub as string, dto);
  }

  @Patch('addresses/:id')
  updateAddress(
    @Req() req: Request & { user?: JwtPayload },
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.accountService.updateAddress(req.user?.sub as string, id, dto);
  }

  @Delete('addresses/:id')
  removeAddress(
    @Req() req: Request & { user?: JwtPayload },
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.accountService.removeAddress(req.user?.sub as string, id);
  }
}
