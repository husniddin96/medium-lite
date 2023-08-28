import { ObjectType, Field, Int, InputType, PartialType, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsString, Length } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @Length(4, 20)
  name: string;

  @Field()
  @IsString()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @Length(8, 16)
  password: string;

  @Field()
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

@ObjectType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  id: number;
}

@InputType()
export class PaginationInput {
  @Field(() => Int)
  skip: number;

  @Field(() => Int)
  take: number;
}

registerEnumType(UserRole, {
  name: 'UserRole'
});