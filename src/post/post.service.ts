import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post } from '@prisma/client';
import { CreatePostInput, UpdatePostInput } from './post.dto';
import { PaginationInput } from 'src/user/user.dto';

@Injectable()
export class PostService {
    constructor(private readonly prisma: PrismaService) { }

    async createPost(data: CreatePostInput): Promise<Post> {
        return this.prisma.post.create({ data });
    }

    async findAll(pagination: PaginationInput): Promise<Post[]> {
        return this.prisma.post.findMany({
            skip: pagination.skip,
            take: pagination.take,
            select: {
                id: true,
                author: true,
                title: true
            }
        }) as unknown as Post[];
    }

    async addViewer(postId: number, userId: number): Promise<void> {
        const viewerExists = await this.prisma.userViewedPosts.findUnique({
            where: {
                postId_userId: {
                    postId: postId,
                    userId: userId,
                },
            },
        });

        if (!viewerExists) {
            await this.prisma.userViewedPosts.create({
                data: {
                    postId: postId,
                    userId: userId,
                },
            });
        }
    }

    async findOneById(id: number, userId: number): Promise<Post> {
        await this.addViewer(id, userId);
        const post = await this.prisma.post.findUnique({ where: { id }, include: { viewers: true, author: true } });
        if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
        return post;
    }

    async updatePost(id: number, data: UpdatePostInput): Promise<Post> {
        return this.prisma.post.update({ where: { id }, data });
    }

    async deletePost(id: number): Promise<Post> {
        return this.prisma.post.delete({ where: { id } });
    }
}
