import { ConfigService } from '@nestjs/config';
import type { File as MulterFile } from 'multer';
export declare class SettingsMediaService {
    private readonly configService;
    private readonly logger;
    private readonly uploadsRoot;
    private readonly publicBase;
    private readonly contentDir;
    constructor(configService: ConfigService);
    saveContentImage(file: MulterFile): Promise<{
        url: string;
    }>;
}
