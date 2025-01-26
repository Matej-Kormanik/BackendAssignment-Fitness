import {Router} from 'express';
import {getAllUsers, login, registerNewUser} from '../controllers/user-controller'

const router: Router = Router();


export default () => {
    router.get('/', getAllUsers)
    router.post('/', registerNewUser)
    router.post('/login', login)

    return router;
}
