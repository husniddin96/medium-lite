import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
    imports: [PrismaModule, forwardRef(() => AuthModule)],
    providers: [UserResolver, UserService],
    exports: [UserService]
})
export class UserModule { }
