import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { File as MulterFile } from 'multer';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { join, resolve } from 'path';

const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

@Injectable()
export class SettingsMediaService {
  private readonly logger = new Logger(SettingsMediaService.name);
  private readonly uploadsRoot: string;
  private readonly publicBase: string;
  private readonly contentDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadsRoot =
      this.configService.get<string>('UPLOADS_ROOT') ??
      resolve(process.cwd(), '..', 'apps', 'web', 'public', 'uploads');
    this.publicBase =
      this.configService.get<string>('UPLOADS_PUBLIC_BASE') ?? '/uploads';
    this.contentDir = join(this.uploadsRoot, 'content');
  }

  async saveContentImage(file: MulterFile) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    const extension = ALLOWED_MIME[file.mimetype];
    if (!extension) {
      throw new BadRequestException(
        'Only JPEG, PNG or WEBP images are supported',
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('Image exceeds 5MB limit');
    }
    await fs.mkdir(this.contentDir, { recursive: true });
    const filename = `${randomUUID()}${extension}`;
    const absolutePath = join(this.contentDir, filename);
    await fs.writeFile(absolutePath, file.buffer);
    const publicBase = this.publicBase.endsWith('/')
      ? this.publicBase.slice(0, -1)
      : this.publicBase;
    const url = `${publicBase}/content/${filename}`;
    this.logger.log(`Stored content image at ${absolutePath}`);
    return { url };
  }
}
