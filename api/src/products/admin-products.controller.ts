import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
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
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductsService } from './products.service';

const uploadInterceptor = FileInterceptor('file', {
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

@Controller('admin/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  list(@Query() query: ProductQueryDto) {
    return this.productsService.listAdmin(query);
  }

  @Get(':id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productsService.getById(id);
  }

  @Post('upload')
  @UseInterceptors(uploadInterceptor)
  upload(@UploadedFile() file: MulterFile) {
    return this.productsService.uploadProductImage(file);
  }
}
