import {Router} from "express";
import {authenticated, isUser} from "../config/middleware";
import {getCompletedExercises, completeExercise, resetExercise} from "../controllers/usersexercise-controller";
import {body} from "express-validator";

const router: Router = Router();

const completeExerciseValidator = [
    body('completed').notEmpty().withMessage("required"),
    body('duration').notEmpty().isNumeric().withMessage("Duration must be a number")
]

export default () => {

    router.put('/exercises/:exerciseId', completeExerciseValidator, authenticated, isUser, completeExercise)
    router.delete('/exercises/:exerciseId', authenticated, isUser, resetExercise)
    router.get('/exercises/completed', authenticated, isUser, getCompletedExercises)

    return router;
}
