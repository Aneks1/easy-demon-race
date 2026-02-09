import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../lib/http-error';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new HttpError(404, 'Route not found'));
};

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const status = err instanceof HttpError ? err.statusCode : 500;
  const message = err.message || 'Unexpected error';

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    error: message,
  });
};
