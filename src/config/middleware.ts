import {Request, Response, NextFunction,} from 'express'
import jwt from 'jsonwebtoken';
import AppError from "../types/custom";
import {JWT_SECRET} from "../utils/constants";
import {USER_ROLE} from "../utils/enums";

export const errorMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    const status = err.statusCode ?? 500;
    const message = err.message ?? 'Something went wrong';

    return res.status(status).json({
        message: message,
        status: status
    })
}

export const authenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw new AppError('Not Authenticated', 401);
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
        throw new AppError('Something went wrong', 500);
    }
    if (!decoded) {
        throw new AppError('Not Authenticated', 401);
    }

    req.body.userId = decoded.userId;
    req.body.role = decoded.role;
    next();
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.role !== USER_ROLE.ADMIN.toString()) {
        throw new AppError('Not authorized to perform this action', 403);
    }
    next();
}
export const isUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.role !== USER_ROLE.USER.toString()) {
        throw new AppError('Not authorized to perform this action', 403);
    }
    next();
}

export const setLanguage = (req: Request, res: Response, next: NextFunction) => {
    const language = req.headers['language'];
    if (language && (language === 'en' || language === 'sk')) {
        req.body.language = language;
    } else {
        req.body.language = 'en';
    }
    next();
};
