import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { CookieOptions, Response } from 'express';
import { Role } from '../common/enums/role.enum';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto, AuthenticatedUser } from './dto/auth-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '@prisma/client';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '7d';
const REFRESH_COOKIE_NAME = 'refresh_token';
const REFRESH_TTL_MS = 1000 * 60 * 60 * 24 * 7;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    dto: RegisterDto,
  ): Promise<{ tokens: AuthResponseDto; refreshToken: string }> {
    const normalizedEmail = dto.email.toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    const passwordHash = await this.hashSecret(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        role: Role.USER,
      },
    });

    return this.createSession(user);
  }

  async login(
    dto: LoginDto,
  ): Promise<{ tokens: AuthResponseDto; refreshToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await this.verifyHash(
      user.passwordHash,
      dto.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createSession(user);
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ tokens: AuthResponseDto; refreshToken: string }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      this.logger.warn(
        `Failed to verify refresh token: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenRecord = await this.prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        revokedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    if (tokenRecord.expiresAt.getTime() <= Date.now()) {
      await this.revokeTokenById(tokenRecord.id);
      throw new UnauthorizedException('Refresh token expired');
    }

    const isValid = await this.verifyHash(tokenRecord.tokenHash, refreshToken);

    if (!isValid) {
      await this.revokeTokenById(tokenRecord.id);
      throw new UnauthorizedException('Refresh token revoked');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.revokeTokenById(tokenRecord.id);

    return this.createSession(user, { revokeExisting: false });
  }

  async logout(userId: string): Promise<void> {
    await this.revokeAllRefreshTokens(userId);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.mapUser(user);
  }

  setRefreshCookie(res: Response, token: string) {
    res.cookie(REFRESH_COOKIE_NAME, token, this.buildCookieOptions());
  }

  clearRefreshCookie(res: Response) {
    res.clearCookie(REFRESH_COOKIE_NAME, this.buildCookieOptions(false));
  }

  private async createSession(
    user: User,
    options: { revokeExisting?: boolean } = {},
  ): Promise<{ tokens: AuthResponseDto; refreshToken: string }> {
    if (options.revokeExisting ?? true) {
      await this.revokeAllRefreshTokens(user.id);
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: ACCESS_TOKEN_TTL,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: REFRESH_TOKEN_TTL,
      }),
    ]);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: await this.hashSecret(refreshToken),
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      },
    });

    const tokens: AuthResponseDto = {
      accessToken,
      user: this.mapUser(user),
    };

    return { tokens, refreshToken };
  }

  private async hashSecret(value: string) {
    return argon2.hash(value, { type: argon2.argon2id });
  }

  private async verifyHash(hash: string, plain: string) {
    return argon2.verify(hash, plain);
  }

  private async revokeAllRefreshTokens(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async revokeTokenById(id: string) {
    await this.prisma.refreshToken.updateMany({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  private buildCookieOptions(withMaxAge = true): CookieOptions {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const secureValue =
      this.configService.get<string>('COOKIE_SECURE') ?? 'false';
    const secure = ['true', '1', 'yes'].includes(secureValue.toLowerCase());
    const sameSite = (nodeEnv === 'production' ? 'strict' : 'lax') as
      | 'lax'
      | 'strict'
      | 'none';

    return {
      httpOnly: true,
      secure,
      sameSite,
      path: '/',
      ...(withMaxAge ? { maxAge: REFRESH_TTL_MS } : {}),
    };
  }

  private mapUser(user: User): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
