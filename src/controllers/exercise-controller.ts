import {NextFunction, Request, Response} from "express";
import { models } from '../db';
import AppError from "../types/custom";
import {FindOptions} from "sequelize";
const {Exercise, Program} = models;
const { Op } = require('sequelize');


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


