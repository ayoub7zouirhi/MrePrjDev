import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const gqlHost = GqlArgumentsHost.create(host);

    let message = 'Database error';

    if (exception.code === 'P2002') {
      message = `Unique constraint failed on: ${exception.meta?.target}`;
    }

    if (exception.code === 'P2003') {
      message = `Invalid reference on field: ${exception.meta?.field_name}`;
    }

    if (exception.code === 'P2025') {
      message = `Record not found`;
    }

    throw new BadRequestException(message);
  }
}
