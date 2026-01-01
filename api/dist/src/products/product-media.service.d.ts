import { ConfigService } from '@nestjs/config';
import type { File as MulterFile } from 'multer';
export declare class ProductMediaService {
    private readonly configService;
    private readonly logger;
    private readonly uploadsRoot;
    private readonly publicBase;
    private readonly productDir;
    constructor(configService: ConfigService);
    saveProductImage(file: MulterFile): Promise<{
        url: string;
    }>;
}
