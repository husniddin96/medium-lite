import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthUserGuard } from 'src/auth/guards/auth-user.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginationInput, UserRole } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver()
@Roles(UserRole.ADMIN)
@UseGuards(AuthUserGuard, RolesGuard)
export class UserResolver {
    constructor(private userService: UserService) { }

    @Mutation(() => User)
    async createUser(
        @Args('email') email: string,
        @Args('name') name: string,
        @Args('password') password: string,
        @Args('role', { type: () => UserRole }) role: UserRole
    ): Promise<User> {
        return (await this.userService.createUser({ email, name, password, role })) as unknown as User;
    }

    @Query(() => [User])
    async users(
        @Args('pagination', { type: () => PaginationInput }) pagination: PaginationInput,
    ): Promise<User[]> {
        return this.userService.findAll(pagination) as unknown as User[];
    }

    @Query(() => User)
    async user(@Args('id', { type: () => Int }) id: number): Promise<User> {
        return this.userService.findOneById(id) as unknown as User;
    }
}
