import jwt from 'jsonwebtoken';

import { ApiError } from '../exceptions/api-error.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(ApiError.UnauthorizedError());
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      throw ApiError.BadRequest('Invalid token');
    }
    req.user = user;

    next();
  });
};
