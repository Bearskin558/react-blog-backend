import { prisma } from '../prisma/prisma-client.js';
import { ApiError } from '../exceptions/api-error.js';

class FollowService {
  async followUser(followingId, userId) {
    const existingFollow = await prisma.follows.findFirst({
      where: {
        AND: [{ followerId: userId }, { followingId }],
      },
    });

    if (existingFollow) {
      throw ApiError.BadRequest('Вы уже подписаны на этого пользователя');
    }

    const existingFollowingUser = await prisma.user.findFirst({
      where: {
        id: followingId,
      },
    });

    if (!existingFollowingUser) {
      throw ApiError.BadRequest('Такого пользователя не существует');
    }

    const follow = await prisma.follows.create({
      data: {
        follower: { connect: { id: userId } },
        following: { connect: { id: followingId } },
      },
    });

    return follow;
  }
  async unfollowUser(followingId, userId) {
    const follow = await prisma.follows.findFirst({
      where: {
        AND: [{ followerId: userId }, { followingId }],
      },
    });

    if (!follow) {
      throw ApiError.BadRequest('Вы не подписаны на данного пользователя');
    }
    const unfollow = await prisma.follows.delete({ where: { id: follow.id } });

    return unfollow;
  }
}
export default new FollowService();
