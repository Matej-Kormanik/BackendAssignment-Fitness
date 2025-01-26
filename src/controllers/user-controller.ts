import {NextFunction, Request, Response} from "express";
import { models } from '../db';
import bcrypt from 'bcryptjs';
import AppError from "../types/custom";
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from "../utils/constants";
const { User } = models;


export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.findAll();
    return res.json({
        data: users,
        message: 'List of users'
    });
}

export const registerNewUser = async (req: Request, res: Response, next: NextFunction) => {
    const password = await bcrypt.hash(req.body.password, 12);
    const savedUser = await User.create({
        ...req.body,
        password: password
    })

    return res.status(201).json({
        userId: savedUser.id,
        message: 'User created successfully'
    })
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({where: {email: req.body.email}})
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const pwdMatches = await bcrypt.compare(req.body.password, user.password);
    if (!pwdMatches) {
        return next(new AppError('Incorrect password', 401));
    }

    const token = jwt.sign({
        email: user.email,
        userId: user.id
    }, JWT_SECRET, {expiresIn: '1h'});

    return res.status(200).json({
        token,
        message: 'User logged in'
    });
}
