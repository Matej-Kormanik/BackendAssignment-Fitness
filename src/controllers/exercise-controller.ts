import {NextFunction, Request, Response} from "express";
import {models} from '../db';
import AppError from "../types/custom";
import {FindOptions, Op} from "sequelize";
import {logError, translate} from "../config/helpers";
import {MESSAGE} from "../utils/enums";
import {validationResult} from 'express-validator';

const {Exercise, Program} = models;


export const getAllExercises = async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ?? 1;
    const limit = req.query.limit ?? 10;
    const programID = req.query.programID;
    const search = req.query.search;

    const whereClause: any = {};
    if (programID) {
        whereClause.programID = programID;
    }
    if (search) {
        whereClause.name = { [Op.like]: `%${search}%` };
    }

    const options: FindOptions = {
        include: [{model: Program, as: 'program'}],
        where: whereClause,
        limit: +limit,
        offset: (+page - 1) * +limit
    };

    const totalCount = await Exercise.count({where: whereClause});
    const exercises = await Exercise.findAll(options);

    return res.json({
        exercises,
        totalCount,
        page,
        totalPages: Math.ceil(totalCount / +limit),
        message: translate(MESSAGE.EXERCISE_LIST, req.body.language)
    })
}

export const createExercise = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logError('Invalid request', req.url, errors);
        return next(
            new AppError(translate(MESSAGE.INVALID_INPUT, req.body.language), 422, errors.array())
        )
    }
    const savedExercises = await Exercise.create({
        ...req.body
    });

    return res.status(201).json({
        exerciseId: savedExercises.id,
        message: translate(MESSAGE.EXERCISE_CREATED, req.body.language)
    });
}

export const updateExercise = async (req: Request, res: Response, next: NextFunction) => {
    const exercise = await Exercise.findByPk(req.params.exerciseId);
    if (!exercise) {
        logError('exercise not found', req.url);
        return next(
            new AppError(translate(MESSAGE.EXERCISE_NOT_FOUND, req.body.language), 404)
        );
    }
    exercise.name = req.body.name ?? exercise.name;
    exercise.programID = req.body.programID ?? exercise.programID;
    exercise.difficulty = req.body.difficulty ?? exercise.difficulty;
    const updatedExercise = await exercise.save();

    return res.status(200).json({
        exercise: updatedExercise,
        message: translate(MESSAGE.EXERCISE_UPDATED, req.body.language)
    });
}

export const deleteExercise = async (req: Request, res: Response, next: NextFunction) => {
    const exercise = await Exercise.findByPk(req.params.exerciseId);
    if (!exercise) {
        logError('exercise not found', req.url);
        return next(
            new AppError(translate(MESSAGE.EXERCISE_NOT_FOUND, req.body.language), 404)
        );
    }
    await exercise.destroy();

    return res.status(200).json({
        message: translate(MESSAGE.EXERCISE_DELETED, req.body.language)
    });
}


