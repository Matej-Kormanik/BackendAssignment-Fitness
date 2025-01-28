import {Router} from 'express';
import {
    getAllUsers,
    getAllUsersPreview, getCurrentUserDetail,
    getUserDetail,
    login,
    registerNewUser,
    updateUser
} from '../controllers/user-controller'
import {authenticated, isAdmin, isUser} from "../config/middleware";
import { body} from 'express-validator';

const router: Router = Router();

// express-validators
const registerUserValidation = [
    body('email').trim().isEmail().withMessage('Invalid email'),
    body('password').trim().isLength({min: 6}).withMessage('Password must be at least 6 characters long')
];
const loginValidation = [
    body('email').trim().isEmail().withMessage('Invalid email'),
    body('password').trim().notEmpty().withMessage("Password required")
];

export default () => {

    // USER APIs
    router.get('/preview',authenticated, isUser, getAllUsersPreview)
    router.get('/me', authenticated, isUser, getCurrentUserDetail)

    // ADMIN APIs
    router.get('/', authenticated, isAdmin, getAllUsers)
    router.get('/:userId', authenticated, isAdmin, getUserDetail)
    router.put('/:userId', authenticated, isAdmin, updateUser)

    // PUBLIC AUTH APIs
    router.post('/', registerUserValidation, registerNewUser)
    router.post('/login', loginValidation, login)

    return router;
}
