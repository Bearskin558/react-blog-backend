import { ApiError } from '../exceptions/api-error.js';
import postService from '../services/post-service.js';
import { ObjectId } from 'mongodb';

const PostController = {
  createPost: async (req, res, next) => {
    const { content } = req.body;
    const authorId = req.user.userId;

    if (!content) {
      console.log(req.body);
      return next(ApiError.BadRequest('Все поля обязательны'));
    }

    try {
      const post = await postService.createPost(content, authorId);
      res.json(post);
    } catch (error) {
      next(error);
    }
  },

  getAllPosts: async (req, res, next) => {
    const userId = req.user.userId;

    try {
      const posts = await postService.getAllPosts(userId);
      res.send(posts);
    } catch (error) {
      next(error);
    }
  },

  getPostById: async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user.userId;

    try {
      const post = await postService.getPostById(postId, userId);
      res.send(post);
    } catch (error) {
      next(error);
    }
  },
  deletePost: async (req, res, next) => {
    try {
      const postId = req.params.id;
      const userId = req.user.userId;
      if (!ObjectId.isValid(postId)) return next(ApiError.NotFound('Пост не был найден'));
      const result = await postService.deletePost(postId, userId);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },
};

export default PostController;
