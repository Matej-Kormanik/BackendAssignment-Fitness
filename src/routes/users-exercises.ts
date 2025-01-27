import {Router} from "express";
import {authenticated, isUser} from "../config/middleware";
import {trackExercise} from "../controllers/usersexercise-controller";

export default () => {
    const router: Router = Router();


    router.put('/exercises/:exerciseId', authenticated, isUser, trackExercise)

    return router;
}
