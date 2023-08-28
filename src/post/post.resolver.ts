import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthUserGuard } from 'src/auth/guards/auth-user.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginationInput, UserRole } from 'src/user/user.dto';
import { Post } from './post.entity';
import { PostService } from './post.service';

@Resolver()
@Roles(UserRole.ADMIN, UserRole.USER)
@UseGuards(AuthUserGuard, RolesGuard)
export class PostResolver {
    constructor(private postService: PostService) { }

    @Query(() => [Post])
    async posts(@Args('pagination', { type: () => PaginationInput }) pagination: PaginationInput): Promise<Post[]> {
        return this.postService.findAll(pagination) as unknown as Post[];
    }

    @Query(() => Post)
    async post(
        @Args('id') id: number,
        @Context() context: any
    ): Promise<Post> {
        const userId = context.req.user.id;
        return this.postService.findOneById(id, userId) as unknown as Post;
    }

    @Mutation(() => Post)
    async createPost(
        @Args('title') title: string,
        @Args('content') content: string,
        @Context() context: any
    ): Promise<Post> {
        const userId = context.req.user.id;
        return this.postService.createPost({ title, content, authorId: userId }) as unknown as Post;
    }
}
