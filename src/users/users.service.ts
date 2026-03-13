import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { Role } from 'src/auth/enums';
import { Prisma } from '@prisma/client';

const userSelect = {
  id: true,
  email: true,
  firstname: true,
  lastname: true,
  role: true,
  environmentId: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    const { password, environment, ...userData } =
      createUserInput;
    const hash = await argon2.hash(password);

    if (environment) {
      const envExist =
        await this.prisma.environment.findUnique({
          where: {
            id: environment,
          },
        });
      if (!envExist) {
        throw new NotFoundException(
          `Environement with ID ${environment} not found`,
        );
      }
    }
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        hash,
        environmentId: environment || undefined,
      },
      select: userSelect,
    });
    return user;
  }

  async update(
    updateUserInput: UpdateUserInput,
    userId: number,
  ) {
    const { password, environment, ...restData } =
      updateUserInput;

    const dataToUpdate: Prisma.UserUpdateInput = { ...restData };
    if (password) {
      dataToUpdate.hash =
        await argon2.hash(password);
    }
    if (environment) {
      const envExist =
        await this.prisma.environment.findUnique({
          where: {
            id: environment,
          },
        });

      if (!envExist) {
        throw new NotFoundException(
          `Environement with ID ${environment} not found`,
        );
      }
    }
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: userSelect,
    });
    return user;
  }

  async remove(userId: number) {
    return await this.prisma.user.delete({
      where: { id: userId },
      select: userSelect,
    });
  }

  async findOne(userId: number) {
    const user =
      await this.prisma.user.findUnique({
        where: { id: userId },
        select: userSelect,
      });
    return user;
  }

  async findAll(
    role: Role,
    environmentId?: number,
  ) {
    const whereClause: any = {};
    if (role) {
      whereClause.role = role;
    }
    if (environmentId) {
      whereClause.environmentId = environmentId;
    }
    return this.prisma.user.findMany({
      where: whereClause,
      select: userSelect,
    });
  }
}
