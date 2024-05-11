import { prisma } from '../prisma/prisma-client.js';
import { ApiError } from '../exceptions/api-error.js';

class LikeService {
  async likePost(postId, userId) {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });
    if (existingLike) {
      throw ApiError.BadRequest('Вы уже поставили лайк');
    }
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw ApiError.BadRequest('Пост не существует');
    }
    const like = await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });

    return like;
  }

  async unlikePost(postId, userId) {
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        postId,
      },
    });
    if (!existingLike) {
      throw ApiError.BadRequest('Вы не лайкали этот пост');
    }

    const unlike = await prisma.like.deleteMany({ where: { postId, userId } });
    return unlike;
  }
}

export default new LikeService();
