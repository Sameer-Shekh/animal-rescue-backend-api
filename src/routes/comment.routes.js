import express from 'express';
import { createComment, getComments } from '../controllers/commentController.js'; // Adjust path as necessary

const router = express.Router();

// Define your routes here
router.post('/createComment', createComment);
router.get('/getComment/:_id', getComments);

export default router;
