import {Request, Response, NextFunction,} from 'express'
import jwt from 'jsonwebtoken';
import AppError from "../types/custom";
import {JWT_SECRET} from "../utils/constants";
import {MESSAGE, USER_ROLE} from "../utils/enums";
import {logError, translate} from "./helpers";

type ErrorBody = {
    message: string,
    status: number,
    errors?: any[]
}

export const errorMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    const status = err.statusCode ?? 500;
    const message = err.message ?? translate(MESSAGE.SMTH_WENT_WRONG, req.body.language);
    let body: ErrorBody = {message, status};
    if (err.errors) {
        body.errors = err.errors;
    }

    return res.status(status).json(body)
}

export const authenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw new AppError(translate(MESSAGE.NOT_AUTHENTICATED, req.body.language), 401);
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
        logError('Error verifying token',req.url, e.message);
        throw new AppError(translate(MESSAGE.SMTH_WENT_WRONG, req.body.language), 500);
    }
    if (!decoded) {
        throw new AppError(translate(MESSAGE.NOT_AUTHENTICATED, req.body.language), 401);
    }

    req.body.userId = decoded.userId;
    req.body.role = decoded.role;
    next();
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.role !== USER_ROLE.ADMIN.toString()) {
        throw new AppError(translate(MESSAGE.NOT_AUTHORIZED, req.body.language), 403);
    }
    next();
}
export const isUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.role !== USER_ROLE.USER.toString()) {
        throw new AppError(translate(MESSAGE.NOT_AUTHORIZED, req.body.language), 403);
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
