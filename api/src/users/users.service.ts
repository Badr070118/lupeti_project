import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: UserQueryDto) {
    const page = query.page ?? 1;
    const limit = Math.min(Math.max(query.limit ?? 20, 1), 100);
    const skip = (page - 1) * limit;

    const where = this.buildWhere(query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async create(dto: CreateUserDto) {
    const passwordHash = await this.hashSecret(dto.password);
    try {
      return await this.prisma.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash,
          name: dto.name?.trim() || null,
          role: dto.role,
          status: dto.status ?? UserStatus.ACTIVE,
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
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code: string }).code === 'P2002'
      ) {
        throw new BadRequestException('Email is already registered');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('User not found');
    }

    if (existing.role === Role.ADMIN && dto.role && dto.role !== Role.ADMIN) {
      await this.ensureAnotherAdminExists(id);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        email: dto.email?.toLowerCase(),
        name: dto.name?.trim(),
        role: dto.role,
        status: dto.status,
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

  async resetPassword(id: string, dto: ResetPasswordDto) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('User not found');
    }
    const passwordHash = await this.hashSecret(dto.password);
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
    return { success: true };
  }

  async remove(id: string) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('User not found');
    }
    if (existing.role === Role.ADMIN) {
      await this.ensureAnotherAdminExists(id);
    }
    await this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.INACTIVE,
        deletedAt: new Date(),
      },
    });
    return { success: true };
  }

  private buildWhere(query: UserQueryDto): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };
    if (query.role) {
      where.role = query.role;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private async ensureAnotherAdminExists(excludeId?: string) {
    const admins = await this.prisma.user.count({
      where: {
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
        deletedAt: null,
        NOT: excludeId ? { id: excludeId } : undefined,
      },
    });
    if (admins === 0) {
      throw new BadRequestException('At least one admin must remain active');
    }
  }

  private hashSecret(value: string) {
    return argon2.hash(value, { type: argon2.argon2id });
  }
}
