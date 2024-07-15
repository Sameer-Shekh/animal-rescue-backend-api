import { Router } from 'express';
import { loginUser, registerUser,} from '../controllers/user.controller.js';

const router = Router();

//REGISTER ROUTE
router.route('/register').post(registerUser);

//LOGIN ROUTE
router.route('/login').post(loginUser);

//FORGOT PASSWORD ROUTE
// router.route('/forgotpassword').post(forgotPassword);

export default router;