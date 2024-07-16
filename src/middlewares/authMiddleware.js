import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';// Adjust the path as per your project structure
import { upload } from '../middlewares/multermiddleware.js';// Adjust the path as per your project structure
import {uploadImage} from '../controllers/user.controller.js';// Adjust the path as per your project structure

dotenv.config();

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        // console.log(token);
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        if (!decoded || !decoded.userId) {
            throw new Error('Invalid token');
        }

        if(req.body.userId !== decoded.userId){
            throw new Error('Invalid token');
        }
       
        next();
    } 
    catch (error) {
        console.error('Authentication error:', error);
        res.status(401).send({ error: 'Please authenticate.' });
    }
    
};

export default authenticate;
