import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('ping')
  @Roles(Role.ADMIN)
  ping() {
    return {
      message: 'pong',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('overview')
  @Roles(Role.ADMIN)
  overview() {
    return this.adminService.getOverview();
  }
}
