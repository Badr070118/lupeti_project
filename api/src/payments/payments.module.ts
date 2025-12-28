import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, RolesGuard],
})
export class PaymentsModule {}
