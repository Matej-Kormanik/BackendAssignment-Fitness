import {Router} from "express";
import {authenticated, isUser} from "../config/middleware";
import {getCompletedExercises, completeExercise, resetExercise} from "../controllers/usersexercise-controller";

export default () => {
    const router: Router = Router();


    router.put('/exercises/:exerciseId', authenticated, isUser, completeExercise)
    router.delete('/exercises/:exerciseId', authenticated, isUser, resetExercise)
    router.get('/exercises/completed', authenticated, isUser, getCompletedExercises)

    return router;
}
