import { ApiError } from '../exceptions/api-error.js';

export function errorMiddleware(err, req, res, next) {
  if (err instanceof ApiError) {
    console.log(err);
    // return res.status(err.status).json({ message: err.message, errors: err.errors });
    return res.status(err.status).json({ error: err.message });
  }
  console.log(err);
  return res.status(500).json({ message: 'Непредвиденная ошибка' });
}
