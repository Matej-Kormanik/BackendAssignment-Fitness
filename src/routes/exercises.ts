import {Router} from 'express'
import {createExercise, deleteExercise, getAllExercises, updateExercise} from "../controllers/exercise-controller";
import {authenticated, isAdmin} from "../config/middleware";
import {body} from "express-validator";
import {EXERCISE_DIFFICULTY, USER_ROLE} from "../utils/enums";


const router: Router = Router();

const createExerciseValidator = [
	body('name').notEmpty().withMessage('Name is required'),
    body('programID').notEmpty().withMessage('Program ID is required'),
	body('difficulty').trim()
		.isIn([EXERCISE_DIFFICULTY.MEDIUM, EXERCISE_DIFFICULTY.EASY, EXERCISE_DIFFICULTY.HARD])
		.withMessage('Invalid Difficulty')
]

export default () => {
	// ADMIN API
	router.get('/', authenticated, isAdmin, getAllExercises);
	router.post('/', createExerciseValidator, authenticated, isAdmin, createExercise);
	router.put('/:exerciseId', authenticated, isAdmin, updateExercise);
	router.delete('/:exerciseId', authenticated, isAdmin, deleteExercise);

	return router;
}
