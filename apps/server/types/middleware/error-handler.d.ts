import { NextFunction, Request, Response } from 'express';
export declare const notFoundHandler: (_req: Request, _res: Response, next: NextFunction) => void;
export declare const errorHandler: (err: Error, _req: Request, res: Response, _next: NextFunction) => void;
