import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multer, { File as MulterFile } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { UpdateHomepageSettingsDto } from './dto/update-homepage-settings.dto';
import { UpdateStoreSettingsDto } from './dto/update-store-settings.dto';
import { SettingsMediaService } from './settings-media.service';
import { SettingsService } from './settings.service';

const uploadInterceptor = FileInterceptor('file', {
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

@Controller('admin/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminSettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly mediaService: SettingsMediaService,
  ) {}

  @Get()
  getAll() {
    return this.settingsService.getPublicSettings();
  }

  @Patch('store')
  updateStore(@Body() dto: UpdateStoreSettingsDto) {
    return this.settingsService.updateStoreSettings(dto);
  }

  @Patch('homepage')
  updateHomepage(@Body() dto: UpdateHomepageSettingsDto) {
    return this.settingsService.updateHomepageSettings(dto);
  }

  @Post('upload')
  @UseInterceptors(uploadInterceptor)
  upload(@UploadedFile() file: MulterFile) {
    return this.mediaService.saveContentImage(file);
  }
}
