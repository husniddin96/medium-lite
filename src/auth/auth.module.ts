import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthUserInterceptor } from './auth-user.interceptor';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/roles.guard';

@Module({
    imports: [forwardRef(() => UserModule), ConfigModule, JwtModule.register({})],
    providers: [AuthService, AuthUserInterceptor, AuthResolver, RolesGuard],
    exports: [AuthService, AuthUserInterceptor]
})
export class AuthModule { }
