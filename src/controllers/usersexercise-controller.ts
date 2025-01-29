import {NextFunction, Request, Response} from "express";
import { models } from '../db';
import AppError from "../types/custom";
import {translate} from "../config/helpers";
import {MESSAGE} from "../utils/enums";
import {validationResult} from 'express-validator';

const {UserExercise, Exercise} = models;

export const completeExercise = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError(translate(MESSAGE.INVALID_INPUT, req.body.language), 422, errors.array()));
    }
    const userId = req.body.userId;
    const exerciseId = req.params.exerciseId;

    const usersExercise = await UserExercise.findOne({where: {userID: userId, exerciseID: exerciseId}});
    if (!usersExercise) {
        const exercise = await Exercise.findByPk(exerciseId);
        if (!exercise) {
            return next(new AppError(translate(MESSAGE.EXERCISE_NOT_FOUND, req.body.language), 404))
        }
        const createdUserExercise = await UserExercise.create({
            userID: userId,
            exerciseID: exerciseId,
            completed: req.body.completed,
            duration: req.body.duration
        });
        return res.status(201).json({
            exercise: createdUserExercise,
            message: translate(MESSAGE.EXERCISE_COMPLETED, req.body.language)
        });
    }

    usersExercise.completed = req.body.completed ?? usersExercise.completed;
    usersExercise.duration = req.body.duration?? usersExercise.duration;
    const savedUserExercise = await usersExercise.save();

    return res.status(200).json({
        exercise: savedUserExercise,
        message: translate(MESSAGE.EXERCISE_UPDATED, req.body.language)
    });
}

export const resetExercise = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;
    const exerciseId = req.params.exerciseId;

    const usersExercise = await UserExercise.findOne({where: {userID: userId, exerciseID: exerciseId}});
    if (!usersExercise) {
        return next(new AppError(translate(MESSAGE.EXERCISE_NOT_FOUND, req.body.language), 404))
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
        message: translate(MESSAGE.EXERCISE_LIST, req.body.language)
    })
}
