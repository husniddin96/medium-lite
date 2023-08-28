import { ObjectType, InputType, Field, Int, PartialType,  } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class CreatePostInput {
    @Field()
    @IsString()
    @Length(5, 255)
    title: string;

    @Field()
    @IsString()
    content: string;

    @Field()
    @IsNumber()
    authorId: number;
}

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
    @Field(() => Int)
    @IsNumber()
    id?: number;
}
