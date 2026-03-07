import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { Role } from 'src/auth/enums';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    const hash = await argon2.hash(
      createUserInput.password,
    );
    try {
      const user = await this.prisma.user.create({
        data: {
          email: createUserInput.email,
          hash,
          role: createUserInput.role,
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  async update(
    updateUserInput: UpdateUserInput,
    userId: number,
  ) {
    try {
      const user = this.prisma.user.update({
        where: { id: userId },
        data: { ...updateUserInput },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  async remove(userId: number) {
    const user = this.prisma.user.delete({
      where: { id: userId },
    });
    if (!userId) {
      throw new NotFoundException(
        `User with ID not found`,
      );
    }
    return user;
  }

  async findOne(userId: number) {
    const user =
      await this.prisma.user.findUnique({
        where: { id: userId },
      });
    return user;
  }

  async findAll(role: Role) {
    return this.prisma.user.findMany({
      where: role ? { role } : {},
    });
  }
}
