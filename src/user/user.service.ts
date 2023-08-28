import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserInput, PaginationInput, UpdateUserInput } from './user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async createUser(data: CreateUserInput): Promise<User> {
        data.password = bcrypt.hashSync(data.password);
        return this.prisma.user.create({ data });
    }

    async findAll(pagination: PaginationInput): Promise<User[]> {
        return this.prisma.user.findMany({
            skip: pagination.skip,
            take: pagination.take,
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true,
                posts: true,
                viewedPosts: true
            }
        }) as unknown as User[];
    }

    async findOneById(id: number): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                posts: true,
                viewedPosts: true
            }
        });
        if (!user) throw new NotFoundException(`User with ID ${id} not found`);

        return user;
    }

    async findOneByEmail(email: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) throw new NotFoundException(`User with email: ${email} not found`);

        return user;
    }

    async updateUser(id: number, data: UpdateUserInput): Promise<User> {
        return this.prisma.user.update({ where: { id }, data });
    }

    async deleteUser(id: number): Promise<User> {
        return this.prisma.user.delete({ where: { id } });
    }
}
