import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { PostService } from './post/post.service';
import { verify } from 'jsonwebtoken';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { AppResolver } from './app.resolver';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    PostModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
      imports: [ConfigModule],
      context: ({ req }) => ({ req })
    }),

  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, PostService],
})
export class AppModule { }