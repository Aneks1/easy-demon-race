export declare class HttpError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string);
}
