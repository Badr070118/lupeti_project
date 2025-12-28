import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto, AuthenticatedUser } from './dto/auth-response.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        tokens: AuthResponseDto;
        refreshToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        tokens: AuthResponseDto;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        tokens: AuthResponseDto;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<void>;
    getProfile(userId: string): Promise<AuthenticatedUser>;
    setRefreshCookie(res: Response, token: string): void;
    clearRefreshCookie(res: Response): void;
    private createSession;
    private hashSecret;
    private verifyHash;
    private revokeAllRefreshTokens;
    private revokeTokenById;
    private buildCookieOptions;
    private mapUser;
}
