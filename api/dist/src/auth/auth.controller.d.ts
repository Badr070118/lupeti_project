import type { Request, Response } from 'express';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, res: Response): Promise<AuthResponseDto>;
    login(dto: LoginDto, res: Response): Promise<AuthResponseDto>;
    refresh(req: Request, res: Response): Promise<AuthResponseDto>;
    logout(req: Request & {
        user?: JwtPayload;
    }, res: Response): Promise<{
        success: boolean;
    }>;
    me(req: Request & {
        user?: JwtPayload;
    }): Promise<import("./dto/auth-response.dto").AuthenticatedUser>;
}
