
import { Router } from 'express';
import { loginUser, registerUser, uploadImage, updateUser ,deleteUser,updatePassword, getUser} from '../controllers/user.controller.js';
import authenticate from '../middlewares/authMiddleware.js';


const router = Router();

//REGISTER ROUTE
router.route('/register').post(registerUser);

//LOGIN ROUTE
router.route('/login').post(loginUser);

//UPLOAD IMAGE ROUTE
router.route('/upload').patch(uploadImage);

//UPDATE USER ROUTE
router.route('/update').patch(authenticate,updateUser);

//DELETE USER ROUTE
router.route('/delete').delete(authenticate,deleteUser);

//UPDATE PASSWORD ROUTE
router.route('/updatePassword').patch(authenticate,updatePassword);

//GET USER INFO ROUTE
router.route('/getUser').post(getUser);


export default router;