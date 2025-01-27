import {NextFunction, Request, Response} from "express";
import { models } from '../db';
import AppError from "../types/custom";

const {UserExercise, Exercise} = models;



export const completeExercise = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;
    const exerciseId = req.params.exerciseId;

    const usersExercise = await UserExercise.findOne({where: {userID: userId, exerciseID: exerciseId}});
    if (!usersExercise) {
        const exercise = await Exercise.findByPk(exerciseId);
        if (!exercise) {
            return next(new AppError('Exercise not found', 404))
        }
        const createdUserExercise = await UserExercise.create({
            userID: userId,
            exerciseID: exerciseId,
            completed: req.body.completed,
            duration: req.body.duration
        });
        return res.status(201).json({
            exercise: createdUserExercise,
            message: 'User exercise completed'
        });
    }

    usersExercise.completed = req.body.completed ?? usersExercise.completed;
    usersExercise.duration = req.body.duration?? usersExercise.duration;
    const savedUserExercise = await usersExercise.save();

    return res.status(200).json({
        exercise: savedUserExercise,
        message: 'User exercise updated successfully'
    });
}

export const resetExercise = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;
    const exerciseId = req.params.exerciseId;

    const usersExercise = await UserExercise.findOne({where: {userID: userId, exerciseID: exerciseId}});
    if (!usersExercise) {
        return next(new AppError('User exercise not found', 404))
    }

    usersExercise.completed = false;
    usersExercise.duration = null;
    const savedUserExercise = await usersExercise.save();

    return res.status(200).json({
        message: `User exercise ${savedUserExercise.id} has been reset`
    });
}

export const getCompletedExercises = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;
    const completedExercises = await UserExercise.findAll({
        where: {userID: userId, completed: true},
        include: [{model: Exercise, as: 'exercise'}]
    })

    return res.json({
        data: completedExercises,
        message: 'List of completed exercises'
    })
}
