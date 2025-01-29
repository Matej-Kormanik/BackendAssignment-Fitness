import {NextFunction, Request, Response} from "express";
import { models } from '../db'
import {translate} from "../config/helpers";
import {MESSAGE} from "../utils/enums";

const {Program} = models

export const getAllPrograms = async (req: Request, res: Response, next: NextFunction) => {
    const programs = await Program.findAll();

    return res.json({
        data: programs,
        message: translate(MESSAGE.PROGRAM_LIST, req.body.language)
    })
}
