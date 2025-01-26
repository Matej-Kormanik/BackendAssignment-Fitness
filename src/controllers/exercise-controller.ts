import {NextFunction, Request, Response} from "express";
import { models } from '../db';
const {Exercise, Program} = models;



export const getAllExercises = async (req: Request, res: Response, next: NextFunction) => {
    const exercises = await Exercise.findAll({
        include: [{model: Program, as: 'program'}]
    })

    return res.json({
        data: exercises,
        message: 'List of exercises'
    })
}

export const createExercise = async (req: Request, res: Response, next: NextFunction) => {
    const savedExercises = await Exercise.create({
        ...req.body
    });

    return res.status(201).json({
        exerciseId: savedExercises.id,
        message: 'Exercise created successfully'
    });
}
