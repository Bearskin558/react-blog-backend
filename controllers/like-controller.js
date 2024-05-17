import { ObjectId } from 'mongodb';

import { ApiError } from '../exceptions/api-error.js';
import likeService from '../services/like-service.js';

const LikeController = {
  likePost: async (req, res, next) => {
    const postId = req.body.postId;
    const userId = req.user.userId;

    if (!postId) return next(ApiError.NotFound('Пост не найден'));

    if (!ObjectId.isValid(postId) || !ObjectId.isValid(userId)) {
      return next(ApiError.BadRequest('Неверный id пользователя или id поста'));
    }

    try {
      const like = await likeService.likePost(postId, userId);
      res.send(like);
    } catch (error) {
      next(error);
    }
  },
  unlikePost: async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user.userId;

    if (!postId) return next(ApiError.NotFound('Пост не найден'));

    if (!ObjectId.isValid(postId) || !ObjectId.isValid(userId)) {
      return next(ApiError.BadRequest('Неверный id пользователя или id поста'));
    }

    try {
      const unlike = await likeService.unlikePost(postId, userId);
      res.send(unlike);
    } catch (error) {
      next(error);
    }
  },
};
export default LikeController;
