import {Router} from 'express'
import {authenticated, isUser} from "../config/middleware";
import {getAllPrograms} from "../controllers/program-controller";

const router: Router = Router()


export default () => {
	router.get('/', authenticated, isUser, getAllPrograms)

	return router;
}
