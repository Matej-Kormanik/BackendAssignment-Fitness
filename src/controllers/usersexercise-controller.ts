import {NextFunction, Request, Response} from "express";
import { models } from '../db';
import AppError from "../types/custom";

const {UserExercise, Exercise} = models;



export const trackExercise = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;
    const exerciseId = req.params.exerciseId;

    const usersExercise = await UserExercise.findOne({where: {exerciseID: exerciseId}});
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
            message: 'User exercise updated successfully'
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
