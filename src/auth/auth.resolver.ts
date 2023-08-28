import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse, RefreshTokenResponse } from './dto/login-response';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) { }

  @Mutation(() => LoginResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.authService.login({ email, password });
  }


  @Mutation(() => RefreshTokenResponse)
  refreshToken(@Context() context: any) {
    const refreshToken = context.req.headers?.refreshtoken.split(' ')[1];
    return this.authService.generateAccessTokenWithRefToken(refreshToken);
  }
}