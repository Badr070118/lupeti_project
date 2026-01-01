import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminUsersController } from './admin-users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [AuthModule],
  controllers: [AdminUsersController],
  providers: [UsersService, RolesGuard],
  exports: [UsersService],
})
export class UsersModule {}
