import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 10, ttl: 60 } })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { tokens, refreshToken } = await this.authService.register(dto);
    this.authService.setRefreshCookie(res, refreshToken);
    return tokens;
  }

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const { tokens, refreshToken } = await this.authService.login(dto);
    this.authService.setRefreshCookie(res, refreshToken);
    return tokens;
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const refreshToken = req.cookies?.refresh_token as string | undefined;
    const { tokens, refreshToken: nextRefreshToken } =
      await this.authService.refresh(refreshToken ?? '');
    this.authService.setRefreshCookie(res, nextRefreshToken);
    return tokens;
  }

  @Get('session')
  async session(@Req() req: Request) {
    const refreshToken = req.cookies?.refresh_token as string | undefined;
    return { user: await this.authService.getSession(refreshToken ?? '') };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: Request & { user?: JwtPayload },
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean }> {
    const user = req.user;
    if (user) {
      await this.authService.logout(user.sub);
    }
    this.authService.clearRefreshCookie(res);
    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request & { user?: JwtPayload }) {
    return this.authService.getProfile(req.user?.sub as string);
  }
}
