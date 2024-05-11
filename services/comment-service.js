import { prisma } from '../prisma/prisma-client.js';
import { ApiError } from '../exceptions/api-error.js';

class CommentService {
  async createComment(postId, content, userId) {
    const comment = await prisma.comment.create({
      data: {
        postId,
        userId,
        content,
      },
    });
    return comment;
  }
  async deleteComment(commentId, userId) {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!comment) throw ApiError.NotFound('Комментарий не найден');

    if (userId !== comment.userId) throw ApiError.BadRequest('Нет доступа');

    const deletedComment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    return deletedComment;
  }
}
export default new CommentService();
