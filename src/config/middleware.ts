import {
    Request,
    Response,
    NextFunction,
} from 'express'
import AppError from "../types/custom";

export const errorMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    const status = err.statusCode ?? 500;
    const message = err.message ?? 'Something went wrong';

    return res.status(status).json({
        message: message,
        status: status
    })
}
