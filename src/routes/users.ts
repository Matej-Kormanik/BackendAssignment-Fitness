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
import {USER_ROLE} from "../utils/enums";

const router: Router = Router();

// express-validators
const registerUserValidation = [
    body('email').trim().isEmail().withMessage('Invalid email'),
    body('password').trim().isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
    body('name').trim().isLength(({min: 3})).withMessage('name is required'),
    body('surname').trim().isLength(({min: 3})).withMessage('surname is required'),
    body('nickName').trim().isLength(({min: 3})).withMessage('nickName is required'),
    body('age').trim().isNumeric().withMessage('age must be a number'),
    body('role').trim().isIn([USER_ROLE.USER, USER_ROLE.ADMIN]).withMessage('Invalid role')
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
