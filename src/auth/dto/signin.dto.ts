import {
  Field,
  InputType,
} from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

@InputType()
export class SigninInput {
  @IsEmail(
    {},
    { message: 'Invalid email address' },
  )
  @IsNotEmpty()
  @Field()
  email: string;

  @IsNotEmpty()
  @Field()
  password: string;
}
