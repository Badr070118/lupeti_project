import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name?.trim() || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  async listAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createAddress(userId: string, dto: CreateAddressDto) {
    return this.prisma.$transaction(async (tx) => {
      const existingCount = await tx.address.count({ where: { userId } });
      const shouldDefault = dto.isDefault ?? existingCount === 0;

      if (shouldDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      const data: Prisma.AddressCreateInput = {
        user: { connect: { id: userId } },
        label: dto.label?.trim() || null,
        fullName: dto.fullName.trim(),
        phone: dto.phone?.trim() || null,
        line1: dto.line1.trim(),
        line2: dto.line2?.trim() || null,
        city: dto.city.trim(),
        state: dto.state?.trim() || null,
        postalCode: dto.postalCode.trim(),
        country: dto.country.trim(),
        type: (dto.type ?? AddressType.SHIPPING) as AddressType,
        isDefault: shouldDefault,
      };

      return tx.address.create({ data });
    });
  }

  async updateAddress(userId: string, id: string, dto: UpdateAddressDto) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      const data: Prisma.AddressUpdateInput = {};
      if (dto.label !== undefined) data.label = dto.label?.trim() || null;
      if (dto.fullName !== undefined)
        data.fullName = dto.fullName?.trim() || null;
      if (dto.phone !== undefined) data.phone = dto.phone?.trim() || null;
      if (dto.line1 !== undefined) data.line1 = dto.line1.trim();
      if (dto.line2 !== undefined) data.line2 = dto.line2?.trim() || null;
      if (dto.city !== undefined) data.city = dto.city.trim();
      if (dto.state !== undefined) data.state = dto.state?.trim() || null;
      if (dto.postalCode !== undefined)
        data.postalCode = dto.postalCode.trim();
      if (dto.country !== undefined) data.country = dto.country.trim();
      if (dto.type !== undefined) data.type = dto.type as AddressType;
      if (dto.isDefault !== undefined) data.isDefault = dto.isDefault;

      return tx.address.update({
        where: { id },
        data,
      });
    });
  }

  async removeAddress(userId: string, id: string) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    await this.prisma.address.delete({ where: { id } });

    if (address.isDefault) {
      const next = await this.prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      if (next) {
        await this.prisma.address.update({
          where: { id: next.id },
          data: { isDefault: true },
        });
      }
    }

    return { success: true };
  }
}
