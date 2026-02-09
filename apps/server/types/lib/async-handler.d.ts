import { NextFunction, Request, Response } from 'express';
type Handler<T = any> = (req: Request, res: Response, next: NextFunction) => Promise<T> | T;
export declare const asyncHandler: <T = any>(fn: Handler<T>) => (req: Request, res: Response, next: NextFunction) => void;
export {};
