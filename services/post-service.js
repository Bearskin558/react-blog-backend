import { prisma } from '../prisma/prisma-client.js';
import { ApiError } from '../exceptions/api-error.js';
import findSchemas from '../prisma/findSchemas.js';

class PostService {
  async createPost(content, authorId) {
    const posts = await prisma.post.create({
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

    const isLikedByCurrentUser = post.likes.some((like) => like.userId === userId);
    return { ...post, isLikedByCurrentUser };
  }
  async deletePost() {}
}

export default new PostService();
