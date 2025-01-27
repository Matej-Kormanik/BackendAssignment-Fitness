import {NextFunction, Request, Response} from "express";
import { models } from '../db';
import bcrypt from 'bcryptjs';
import AppError from "../types/custom";
import jwt from 'jsonwebtoken';
import {JWT_SECRET, SALT} from "../utils/constants";
const { User } = models;

/* --------------------------    ADMIN CONTROLLERS    ------------------------------*/
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.findAll();
    return res.status(200).json({
        users: users,
        message: 'List of users'
    });
}

export const getUserDetail = async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    return res.status(200).json({
        user: user
    });
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    user.name = req.body.name?? user.name;
    user.surname = req.body.surname?? user.surname;
    user.nickName = req.body.nickName?? user.nickName;
    user.age = req.body.age ?? user.age;
    user.role = req.body.role?? user.role;
    const updatedUser = await user.save();

    return res.status(200).json({
        user: updatedUser,
        message: 'User updated successfully'
    });
}


/* --------------------------   USER CONTROLLERS    --------------------------------*/
export const getAllUsersPreview = async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.findAll({attributes: ['id', 'nickName']});

    return res.status(200).json({users});
}

/* --------------------------   PUBLIC CONTROLLERS    ------------------------------*/

export const registerNewUser = async (req: Request, res: Response, next: NextFunction) => {
    const password = await bcrypt.hash(req.body.password, SALT);
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
        userId: user.id,
        role: user.role
    }, JWT_SECRET, {expiresIn: '1h'});

    return res.status(200).json({
        token,
        message: 'User logged in'
    });
}
