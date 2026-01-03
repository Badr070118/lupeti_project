import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { AdminSettingsController } from './admin-settings.controller';
import { SettingsService } from './settings.service';
import { SettingsMediaService } from './settings-media.service';

@Module({
  controllers: [SettingsController, AdminSettingsController],
  providers: [SettingsService, SettingsMediaService],
  exports: [SettingsService],
})
export class SettingsModule {}
