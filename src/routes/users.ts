import {Router} from 'express';
import {getAllUsers, getUserDetail, login, registerNewUser, updateUser} from '../controllers/user-controller'
import {authenticated, isAdmin} from "../config/middleware";

const router: Router = Router();


export default () => {
    router.get('/', authenticated, isAdmin, getAllUsers)
    router.get('/:userId', authenticated, isAdmin, getUserDetail)
    router.put('/:userId', authenticated, isAdmin, updateUser)

    router.post('/', registerNewUser)
    router.post('/login', login)

    return router;
}
