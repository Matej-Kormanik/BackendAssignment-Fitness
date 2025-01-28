import {Router} from 'express'
import {createExercise, deleteExercise, getAllExercises, updateExercise} from "../controllers/exercise-controller";
import {authenticated, isAdmin} from "../config/middleware";

const router: Router = Router()


export default () => {

	// ADMIN API
	router.get('/', authenticated, isAdmin, getAllExercises);
	router.post('/', authenticated, isAdmin, createExercise);
	router.put('/:exerciseId', authenticated, isAdmin, updateExercise);
	router.delete('/:exerciseId', authenticated, isAdmin, deleteExercise);

	return router;
}
