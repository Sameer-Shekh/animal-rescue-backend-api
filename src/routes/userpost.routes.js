import {Router} from 'express';
import { createPost , deletePost , getPost , updatePost,getAllPost} from '../controllers/userpost.controller.js';
import authenticate from '../middlewares/authMiddleware.js';

const postRouter = Router();

//CREATE POST ROUTE
postRouter.route('/createPost').post(createPost);

//GET POST ROUTE
postRouter.route('/getPost').post(authenticate,getPost);

//UPDATE POST ROUTE
postRouter.route('/updatePost').patch(authenticate,updatePost);

//DELETE POST ROUTE
postRouter.route('/deletePost').delete(authenticate, deletePost);

//GET ALL POSTS ROUTE
postRouter.route('/getAllPost').get(authenticate, getAllPost);

export default postRouter;