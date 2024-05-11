import { ObjectId } from 'mongodb';

import { ApiError } from '../exceptions/api-error.js';
import followService from '../services/follow-service.js';

const FollowController = {
  followUser: async (req, res, next) => {
    const followingId = req.body.followingId;
    const userId = req.user.userId;

    if (followingId === userId) {
      return next(ApiError.BadRequest('Нельзя подписаться на самого себя'));
    }

    if (!ObjectId.isValid(followingId) || !ObjectId.isValid(userId)) {
      return next(ApiError.BadRequest('Неверный id follower или userId'));
    }

    try {
      const follow = await followService.followUser(followingId, userId);
      res.send(follow);
    } catch (error) {
      next(error);
    }
  },
  unfollowUser: async (req, res, next) => {
    const followingId = req.body.followingId;
    const userId = req.user.userId;
    if (!ObjectId.isValid(followingId) || !ObjectId.isValid(userId)) {
      return next(ApiError.BadRequest('Неверный id follower или userId'));
    }
    try {
      const unfollow = await followService.unfollowUser(followingId, userId);
      res.send(unfollow);
    } catch (error) {
      next(error);
    }
  },
};

export default FollowController;
