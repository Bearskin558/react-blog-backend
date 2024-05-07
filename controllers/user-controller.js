import { validationResult } from 'express-validator';
import userService from '../services/user-service.js';
import { ApiError } from '../exceptions/api-error.js';

const UserController = {
  registration: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors.array());
        return next(ApiError.BadRequest('Ошибка валидации', errors.array()));
      }
      const { email, password, name } = req.body;
      const user = await userService.registration(email, password, name);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Введен некорректный логин или пароль'), errors);
      }
      const { email, password } = req.body;
      const token = await userService.login(email, password);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  },

  getUserByID: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (id.length !== 25) return next(ApiError.BadRequest('Пользователь не найден'));
      const userId = req.user.userId;
      const { userDto, isFollowing } = await userService.getUserByID(id, userId);
      res.json({ ...userDto, isFollowing });
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (id !== req.user.userId) {
        return next(ApiError.UnauthorizedError());
      }
      const filePath = req?.file?.path;
      const userDto = await userService.updateUser(id, { ...req.body, filePath });
      res.json(userDto);
    } catch (error) {
      next(error);
    }
  },

  current: async (req, res, next) => {
    try {
      const id = req.user.userId;
      const userDto = await userService.current(id);
      res.json(userDto);
    } catch (error) {
      next(error);
    }
  },
};

export default UserController;
