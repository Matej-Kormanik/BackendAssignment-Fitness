import {Router} from 'express';
import {
    getAllUsers,
    getAllUsersPreview,
    getUserDetail,
    login,
    registerNewUser,
    updateUser
} from '../controllers/user-controller'
import {authenticated, isAdmin, isUser} from "../config/middleware";

const router: Router = Router();


export default () => {

    // USER APIs
    router.get('/preview',authenticated, isUser, getAllUsersPreview) // authenticated, isUser,


    // ADMIN APIs
    router.get('/', authenticated, isAdmin, getAllUsers)
    router.get('/:userId', authenticated, isAdmin, getUserDetail)
    router.put('/:userId', authenticated, isAdmin, updateUser)




    // PUBLIC AUTH APIs
    router.post('/', registerNewUser)
    router.post('/login', login)

    return router;
}
