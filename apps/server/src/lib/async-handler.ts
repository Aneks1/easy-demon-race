import { NextFunction, Request, Response } from 'express';

type Handler<T = any> = (req: Request, res: Response, next: NextFunction) => Promise<T> | T;

export const asyncHandler = <T = any>(fn: Handler<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
