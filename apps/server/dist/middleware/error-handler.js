import { HttpError } from '../lib/http-error';
export const notFoundHandler = (_req, _res, next) => {
    next(new HttpError(404, 'Route not found'));
};
export const errorHandler = (err, _req, res, _next) => {
    const status = err instanceof HttpError ? err.statusCode : 500;
    const message = err.message || 'Unexpected error';
    if (status >= 500) {
        console.error(err);
    }
    res.status(status).json({
        error: message,
    });
};
