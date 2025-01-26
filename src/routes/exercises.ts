import {Router} from 'express'
import {createExercise, getAllExercises} from "../controllers/exercise-controller";
import {authenticated, isAdmin} from "../config/middleware";


const router: Router = Router()



export default () => {
	router.get('/', getAllExercises)
	router.post('/', authenticated, isAdmin, createExercise);

	return router
}
