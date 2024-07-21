import dotenv from 'dotenv';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {upload}  from '../middlewares/multermiddleware.js'; // Ensure correct path to multer middleware
import fs from 'fs';
import { uploadImageCloud } from '../utils/cloudinary.js';
import authenticate from '../middlewares/authMiddleware.js';


dotenv.config();

const getPosts = [authenticate,async (req, res) => {}];

const createPost = [authenticate,upload.single('image'),async (req, res) => {}];

const updatePost = [authenticate,async (req, res) => {}];

const deletePost = [authenticate,async (req, res) => {}];

export { getPosts, createPost, updatePost, deletePost };