
import { Router } from 'express';
import { loginUser, registerUser, uploadImage, updateUser } from '../controllers/user.controller.js';


const router = Router();

//REGISTER ROUTE
router.route('/register').post(registerUser);

//LOGIN ROUTE
router.route('/login').post(loginUser);

//UPLOAD IMAGE ROUTE
router.route('/upload').patch(uploadImage);

//UPDATE USER ROUTE
router.route('/update').patch(updateUser);

//

export default router;