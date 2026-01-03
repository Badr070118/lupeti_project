import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStoreSettingsDto } from './dto/update-store-settings.dto';
import { UpdateHomepageSettingsDto } from './dto/update-homepage-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStoreSettings() {
    const existing = await this.prisma.storeSettings.findFirst();
    if (existing) return existing;
    return this.prisma.storeSettings.create({
      data: {
        storeName: 'Lupeti',
      },
    });
  }

  async getHomepageSettings() {
    const existing = await this.prisma.homepageSettings.findFirst();
    if (existing) return existing;
    return this.prisma.homepageSettings.create({ data: {} });
  }

  async getPublicSettings() {
    const [store, homepage] = await Promise.all([
      this.getStoreSettings(),
      this.getHomepageSettings(),
    ]);
    return { store, homepage };
  }

  async updateStoreSettings(dto: UpdateStoreSettingsDto) {
    const existing = await this.getStoreSettings();
    return this.prisma.storeSettings.update({
      where: { id: existing.id },
      data: {
        ...dto,
        storeName: dto.storeName?.trim() || undefined,
        supportEmail: dto.supportEmail?.trim(),
        supportPhone: dto.supportPhone?.trim(),
        supportAddress: dto.supportAddress?.trim(),
        currency: dto.currency?.toUpperCase(),
      },
    });
  }

  async updateHomepageSettings(dto: UpdateHomepageSettingsDto) {
    const existing = await this.getHomepageSettings();
    this.assertLocalUrl(dto.heroImageUrl, 'heroImageUrl');
    this.assertLocalUrl(dto.storyImageUrl, 'storyImageUrl');
    this.assertLocalUrl(dto.categoryDogImageUrl, 'categoryDogImageUrl');
    this.assertLocalUrl(dto.categoryCatImageUrl, 'categoryCatImageUrl');
    return this.prisma.homepageSettings.update({
      where: { id: existing.id },
      data: {
        ...dto,
        heroImageUrl: this.normalizeUrl(dto.heroImageUrl),
        storyImageUrl: this.normalizeUrl(dto.storyImageUrl),
        categoryDogImageUrl: this.normalizeUrl(dto.categoryDogImageUrl),
        categoryCatImageUrl: this.normalizeUrl(dto.categoryCatImageUrl),
      },
    });
  }

  async getShippingFees() {
    const settings = await this.getStoreSettings();
    return {
      standardCents: settings.shippingStandardCents,
      expressCents: settings.shippingExpressCents,
    };
  }

  async isPaytrEnabled() {
    const settings = await this.getStoreSettings();
    return settings.paytrEnabled;
  }

  private normalizeUrl(value?: string | null) {
    if (value === null) return null;
    if (!value) return undefined;
    return value.trim();
  }

  private assertLocalUrl(value: string | null | undefined, field: string) {
    if (!value) return;
    if (value.startsWith('http')) {
      throw new BadRequestException(`${field} must reference a local asset`);
    }
  }
}
