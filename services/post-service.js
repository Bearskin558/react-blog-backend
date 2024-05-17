import { prisma } from '../prisma/prisma-client.js';
import { ApiError } from '../exceptions/api-error.js';
import findSchemas from '../prisma/post-find-schemas.js';

class PostService {
  async createPost(content, authorId) {
    const post = await prisma.post.create({
      data: {
        content,
        authorId,
      },
    });
    return post;
  }
  async getAllPosts(userId) {
    const posts = await prisma.post.findMany(findSchemas.getAllPosts());
    const postsLikeInfo = posts.map((post) => ({
      ...post,
      likedByUser: post.likes.some((like) => like.userId === userId),
    }));
    return postsLikeInfo;
  }
  async getPostById(postId, userId) {
    const post = await prisma.post.findUnique(findSchemas.getPostById(postId));

    if (!post) {
      throw ApiError.NotFound('Пост не найден');
    }

    const likedByUser = post.likes.some((like) => like.userId === userId);
    return { ...post, likedByUser };
  }
  async deletePost(postId, userId) {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw ApiError.NotFound('Пост не был найден');
    }
    if (post.authorId !== userId) {
      throw new ApiError(403, 'Нет доступа');
    }
    const transaction = await prisma.$transaction([
      prisma.comment.deleteMany({
        where: {
          postId,
        },
      }),
      prisma.like.deleteMany({ where: { postId } }),
      prisma.post.delete({ where: { id: postId } }),
    ]);
    return transaction;
  }
}

export default new PostService();
