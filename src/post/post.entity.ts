import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';

@ObjectType()
export class Post {
    @Field(() => Int)
    id: number;

    @Field()
    title: string;

    @Field()
    content: string;

    @Field(() => User)
    author: User;

    @Field(() => [User], { nullable: 'itemsAndList' })
    viewers: User[];
}