import {NextFunction, Request, Response} from "express";
import { models } from '../db';
import AppError from "../types/custom";
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

export const updateExercise = async (req: Request, res: Response, next: NextFunction) => {
    const exercise = await Exercise.findByPk(req.params.exerciseId);
    if (!exercise) {
        return next(new AppError('Exercise not found', 404));
    }
    exercise.name = req.body.name ?? exercise.name;
    exercise.programID = req.body.programID ?? exercise.programID;
    exercise.difficulty = req.body.difficulty ?? exercise.difficulty;
    const updatedExercise = await exercise.save();

    return res.status(200).json({
        exercise: updatedExercise,
        message: 'Exercise updated successfully'
    });
}

export const deleteExercise = async (req: Request, res: Response, next: NextFunction) => {
    const exercise = await Exercise.findByPk(req.params.exerciseId);
    if (!exercise) {
        return next(new AppError('Exercise not found', 404));
    }
    await exercise.destroy();

    return res.status(200).json({
        message: 'Exercise deleted successfully'
    });
}


