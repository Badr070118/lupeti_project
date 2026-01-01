import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminProductsController } from './admin-products.controller';
import { ProductsController } from './products.controller';
import { ProductMediaService } from './product-media.service';
import { ProductsService } from './products.service';

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [ProductsController, AdminProductsController],
  providers: [ProductsService, ProductMediaService, RolesGuard],
})
export class ProductsModule {}
