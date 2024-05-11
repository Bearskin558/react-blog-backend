import { ObjectId } from 'mongodb';

import { ApiError } from '../exceptions/api-error.js';
import commentService from '../services/comment-service.js';

const CommentController = {
  createComment: async (req, res, next) => {
    try {
      const { postId, content } = req.body;
      const userId = req.user.userId;
      if (!postId && !content) {
        return next(ApiError.BadRequest('Все поля обязательны'));
      }
      if (!ObjectId.isValid(postId) || !ObjectId.isValid(userId)) {
        return next(ApiError.BadRequest('Неверный id пользователя или id поста'));
      }

      const comment = await commentService.createComment(postId, content, userId);
      res.send(comment);
    } catch (error) {
      next(error);
    }
  },
  deleteComment: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const commentId = req.params.id;
      if (!ObjectId.isValid(userId) || !ObjectId.isValid(commentId)) {
        return next(ApiError.BadRequest('Неверный id пользователя или id комментария'));
      }
      const deletedComment = await commentService.deleteComment(commentId, userId);
      res.send(deletedComment);
    } catch (error) {
      next(error);
    }
  },
};
export default CommentController;
