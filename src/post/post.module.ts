import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';

@Module({
    imports: [PrismaModule, AuthModule, UserModule],
    providers: [PostResolver, PostService],
    exports: [PostService]
})
export class PostModule {}
