import {
  Args,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './entities/auth.entity';
import { SignupInput } from './dto/signup.dto.';
import { SigninInput } from './dto/signin.dto';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}
  @Mutation(() => AuthResponse)
  signup(
    @Args('signupInput') signupInput: SignupInput,
  ) {
    return this.authService.signup(signupInput);
  }
  
  @Mutation(() => AuthResponse)
  signin(
    @Args('signinInput') signinInput: SigninInput,
  ) {
    return this.authService.signin(signinInput);
  }
}
