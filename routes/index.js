import express from 'express';
import { Router } from 'express';
import multer from 'multer';
import {
  CommentController,
  FollowController,
  LikeController,
  PostController,
  UserController,
} from '../controllers/index.js';
import { body, checkSchema } from 'express-validator';
import {
  schemaRegistration,
  schemaLogin,
} from '../validations-schemas/index.js';

import { authenticateToken } from '../middlewares/auth.js';

const uploadDestination = 'uploads';
const router = Router();

const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage });

//User routes
router.post(
  '/registration',
  checkSchema(schemaRegistration),
  UserController.registration,
);
router.post('/login', checkSchema(schemaLogin), UserController.login);
router.get('/current', authenticateToken, UserController.current);
router.get('/users/:id', authenticateToken, UserController.getUserById);
router.put(
  '/users/:id',
  authenticateToken,
  uploads.single('avatar'),
  UserController.updateUser,
);

//Post routes
router.post('/posts', authenticateToken, PostController.createPost);
router.get('/posts', authenticateToken, PostController.getAllPosts);
router.get('/posts/:id', authenticateToken, PostController.getPostById);
router.delete('/posts/:id', authenticateToken, PostController.deletePost);

//Comment routes
router.post('/comments', authenticateToken, CommentController.createComment);
router.delete(
  '/comments/:id',
  authenticateToken,
  CommentController.deleteComment,
);

//Like routes
router.post('/likes', authenticateToken, LikeController.likePost);
router.delete('/likes/:id', authenticateToken, LikeController.unlikePost);

//Follow routes
router.post('/follow', authenticateToken, FollowController.followUser);
router.delete('/follow', authenticateToken, FollowController.unfollowUser);

export default router;
