import {Router} from "express";
import {authenticated, isUser} from "../config/middleware";
import {getCompletedExercises, trackExercise} from "../controllers/usersexercise-controller";

export default () => {
    const router: Router = Router();


    router.put('/exercises/:exerciseId', authenticated, isUser, trackExercise)
    router.get('/exercises/completed', authenticated, isUser, getCompletedExercises)

    return router;
}
