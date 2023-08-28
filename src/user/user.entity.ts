import { ObjectType, Field, Int, InputType, PartialType } from '@nestjs/graphql';
import { Post } from 'src/post/post.entity';
import { UserRole } from './user.dto';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => [Post], { nullable: 'itemsAndList' })
  posts: Post[];

  @Field(() => [Post], { nullable: 'itemsAndList' })
  viewedPosts: Post[];
}