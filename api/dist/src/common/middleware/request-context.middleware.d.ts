import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class RequestContextMiddleware implements NestMiddleware {
    private readonly logger;
    use(req: Request & {
        requestId?: string;
    }, res: Response, next: NextFunction): void;
}
