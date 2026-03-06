import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';

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
    const user = await this.prisma.user.delete({
      where: { id: userId },
    });
    return (
      'User with id ' +
      user.id +
      ' has been removed.'
    );
  }

  async findOne(userId: number) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      return user;
      }
      
    findAll() {
      return this.prisma.user.findMany();
    }
  }
