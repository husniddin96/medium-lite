import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthUserGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('AuthUserGuard');

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;


    if (request.headers.authorization) {
      const user = await this.authService.validateUser(request.headers.authorization.split(' ')[1]);
      if (user) {
        request.user = user;
        return true;
      }
    }
    
    return false;
  }
}
