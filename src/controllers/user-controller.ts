import {NextFunction, Request, Response} from "express";
import { models } from '../db';
import bcrypt from 'bcryptjs';
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


}
