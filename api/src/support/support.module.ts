import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../common/guards/roles.guard';
import { SupportAdminController } from './support-admin.controller';
import { SupportController } from './support.controller';
import { SupportNotifierService } from './support-notifier.service';
import { SupportService } from './support.service';

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [SupportController, SupportAdminController],
  providers: [SupportService, SupportNotifierService, RolesGuard],
  exports: [SupportService],
})
export class SupportModule {}
