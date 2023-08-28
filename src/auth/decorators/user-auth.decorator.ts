import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { AuthUserInterceptor } from '../auth-user.interceptor';

export function AutUser() {
  return applyDecorators(UseInterceptors(AuthUserInterceptor));
}
