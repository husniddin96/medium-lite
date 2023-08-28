import { Field, ObjectType, PartialType } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;
  @Field()
  refreshToken: string;
}

@ObjectType()
export class RefreshTokenResponse {
  @Field()
  accessToken: string;
}
