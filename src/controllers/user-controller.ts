import {NextFunction, Request, Response} from "express";
import { models } from '../db';
import bcrypt from 'bcryptjs';
import AppError from "../types/custom";
import jwt from 'jsonwebtoken';
import {JWT_EXPIRATION, JWT_SECRET, SALT} from "../utils/constants";
import {logError, translate} from "../config/helpers";
import {MESSAGE} from "../utils/enums";
const { User } = models;
import {validationResult} from 'express-validator';

/* --------------------------    ADMIN CONTROLLERS    ------------------------------*/
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.findAll();
    return res.status(200).json({
        users: users,
        message: translate(MESSAGE.USER_LIST, req.body.language)
    });
}

export const getUserDetail = async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
        logError('user not found', req.originalUrl, req.params.userId);
        return next(new AppError(translate(MESSAGE.USER_NOT_FOUND, req.body.language), 404));
    }
    return res.status(200).json({
        user: user
    });
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
        logError('user not found', req.originalUrl, req.params.userId);
        return next(new AppError(translate(MESSAGE.USER_NOT_FOUND, req.body.language), 404));
    }
    user.name = req.body.name?? user.name;
    user.surname = req.body.surname?? user.surname;
    user.nickName = req.body.nickName?? user.nickName;
    user.age = req.body.age ?? user.age;
    user.role = req.body.role?? user.role;
    const updatedUser = await user.save();

    return res.status(200).json({
        user: updatedUser,
        message: translate(MESSAGE.USER_UPDATED, req.body.language)
    });
}


/* --------------------------   USER CONTROLLERS    --------------------------------*/
export const getAllUsersPreview = async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.findAll({attributes: ['id', 'nickName']});

    return res.status(200).json({users});
}

export const getCurrentUserDetail = async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = await User.findOne({
        where: {id: req.body.userId},
        attributes: ['name', 'surname', 'age', 'nickName']
    });
    if (!currentUser) {
        return next(
            new AppError(translate(MESSAGE.USER_NOT_FOUND, req.body.language), 404)
        );
    }

    return res.status(200).json({currentUser});
}

/* --------------------------   PUBLIC CONTROLLERS    ------------------------------*/

export const registerNewUser = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logError('Invalid request', req.originalUrl, errors);
        return next(
            new AppError(translate(MESSAGE.INVALID_INPUT, req.body.language), 422, errors.array())
        );
    }

    const password = await bcrypt.hash(req.body.password, SALT);
    const savedUser = await User.create({
        ...req.body,
        password: password
    })

    return res.status(201).json({
        userId: savedUser.id,
        message: translate(MESSAGE.USER_CREATED, req.body.language)
    })
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new AppError(translate(MESSAGE.INVALID_INPUT, req.body.language), 422, errors.array())
        );
    }
    const user = await User.findOne({where: {email: req.body.email}})
    if (!user) {
        return next(
            new AppError(translate(MESSAGE.USER_NOT_FOUND, req.body.language), 404)
        );
    }

    const pwdMatches = await bcrypt.compare(req.body.password, user.password);
    if (!pwdMatches) {
        return next(
            new AppError(translate(MESSAGE.INVALID_PWD, req.body.language), 401)
        );
    }

    const token = jwt.sign({
        email: user.email,
        userId: user.id,
        role: user.role
    }, JWT_SECRET, {expiresIn: JWT_EXPIRATION});

    return res.status(200).json({
        token,
        message: translate(MESSAGE.USER_LOGGED, req.body.language)
    });
}
