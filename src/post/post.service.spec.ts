import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PostService', () => {
    let postService: PostService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostService,
                {
                    provide: PrismaService,
                    useValue: {
                        post: {
                            create: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                        userViewedPosts: {
                            findUnique: jest.fn(),
                            create: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        postService = module.get<PostService>(PostService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(postService).toBeDefined();
    });

    describe('createPost', () => {
        it('should create a post', async () => {
            const data = {
                title: 'Test Title',
                content: 'Test Content',
                authorId: 1,
            };

            const result = {
                id: 1,
                ...data
            };

            (prismaService.post.create as any).mockResolvedValue(result);
            expect(await postService.createPost(data)).toEqual(result);
        });
    });

    describe('findAll', () => {
        it('should retrieve all posts', async () => {
            const pagination = {
                skip: 0,
                take: 10
            };

            const result = [
                {
                    id: 1,
                    author: {},
                    title: 'Test Title',
                },
                {
                    id: 2,
                    author: {},
                    title: 'Another Test Title',
                }
            ];

            (prismaService.post.findMany as any).mockResolvedValue(result);
            expect(await postService.findAll(pagination)).toEqual(result);
        });
    });

    describe('findOneById', () => {
        it('should retrieve a post by ID and add a viewer', async () => {
            const id = 1;
            const userId = 2;
            const result = {
                id,
                title: 'Test Title',
                viewers: [],
                author: {},
            };

            (prismaService.post.findUnique as any).mockResolvedValue(result);
            expect(await postService.findOneById(id, userId)).toEqual(result);
        });

        it('should throw NotFoundException if post not found', async () => {
            const id = 999; // non-existent ID
            const userId = 2;

            (prismaService.post.findUnique as any).mockResolvedValue(null);
            await expect(postService.findOneById(id, userId)).rejects.toThrow('Post with ID 999 not found');
        });
    });

    describe('addViewer', () => {
        it('should add a viewer if not already exists', async () => {
            const postId = 1;
            const userId = 2;

            (prismaService.userViewedPosts.findUnique as any).mockResolvedValue(null); // Assume viewer doesn't exist
            await postService.addViewer(postId, userId);
            expect(prismaService.userViewedPosts.create).toHaveBeenCalledWith({
                data: {
                    postId: postId,
                    userId: userId,
                }
            });
        });

        it('should not add a viewer if already exists', async () => {
            const postId = 1;
            const userId = 2;
            const existingViewer = {
                postId,
                userId
            };

            (prismaService.userViewedPosts.findUnique as any).mockResolvedValue(existingViewer); // Assume viewer already exists
            await postService.addViewer(postId, userId);
            expect(prismaService.userViewedPosts.create).not.toHaveBeenCalled();
        });
    });

    describe('updatePost', () => {
        it('should update a post', async () => {
            const postId = 1;
            const data = {
                title: 'Updated Title',
                content: 'Updated Content'
            };

            const updatedPost = {
                id: postId,
                ...data
            };

            ((prismaService.post.update as any) as any).mockResolvedValue(updatedPost);
            expect(await postService.updatePost(postId, data)).toEqual(updatedPost);
        });
    });

    describe('deletePost', () => {
        it('should delete a post by ID', async () => {
            const postId = 1;
            const postToBeDeleted = {
                id: postId,
                title: 'Post to be deleted',
                content: 'Some content'
            };

            (prismaService.post.delete as any).mockResolvedValue(postToBeDeleted);
            expect(await postService.deletePost(postId)).toEqual(postToBeDeleted);
        });
    });

});
