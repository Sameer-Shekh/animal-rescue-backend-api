
import { Router } from 'express';
import { loginUser, registerUser, uploadImage} from '../controllers/user.controller.js';
import  authenticate from '../middlewares/authMiddleware.js';


const router = Router();

//REGISTER ROUTE
router.route('/register').post(registerUser);

//LOGIN ROUTE
router.route('/login').post(loginUser);

//UPLOAD IMAGE
// router.post('/upload',authenticateToken, uploadImage);
router.route('/upload').patch(uploadImage);

export default router;