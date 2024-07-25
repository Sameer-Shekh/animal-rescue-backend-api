import dotenv from 'dotenv';
import {upload}  from '../middlewares/multermiddleware.js'; // Ensure correct path to multer middleware
import fs from 'fs';
import { uploadImageCloud } from '../utils/cloudinary.js';
import User from '../models/user.model.js';
import Post from '../models/userpost.model.js';
import jwt from 'jsonwebtoken';

dotenv.config();

// Create a new post
const createPost = (req,res)=>{
    upload.array('image', 4)(req, res, async (err) => { // Handle multiple images with the field name 'images'
        if (err) {
          console.error('Upload error:', err);
          return res.status(400).send({ success: false, message: 'Upload failed', error: err.message });
        }
    
        try {
          if (!req.files || req.files.length === 0) {
            return res.status(400).send({ success: false, message: 'No files uploaded' });
          }
    
          const token = req.header('Authorization').replace('Bearer ', '');
          if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
          }
    
          // Verify the token
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (!decoded || !decoded.userId) {
            throw new Error('Invalid token');
          }
    
          if (req.body.userId !== decoded.userId) {
            throw new Error('Invalid token');
          }
    
          // Upload images to Cloudinary
          const uploadPromises = req.files.map(file => uploadImageCloud(file.path, req.body.userId));
          const uploadedImages = await Promise.all(uploadPromises);
    
            // Delete temp files from multer
            req.files.forEach(file => {
            fs.unlink(file.path, (unlinkErr) => {
            if (unlinkErr) {
                console.error('Error deleting temp file:', unlinkErr);
            } else {
                console.log('Temp file deleted successfully:', file.path);
            }
            });
        });
    
          const imageUrls = uploadedImages.map(upload => upload.result.secure_url);
    
          if (imageUrls.some(url => !url)) {
            console.log('One or more image uploads failed');
            return res.status(400).send({ success: false, message: 'Image upload failed' });
          }
    
          const { description, priority } = req.body;
          const post = new Post({
            image: imageUrls,
            description,
            userId: decoded.userId, // Make sure userId is correctly assigned
            priority,
          });
          console.log('Post:', post);
    
          await post.save();
          
          await User.findByIdAndUpdate(decoded.userId, {
            $push: { posts: post._id }
        });

          const location = post.location || { longitude: 0, latitude: 0 };
          return res.status(201).send({
            success: true,
            message: 'Images uploaded successfully',
            imageUrls,
            description,
            location,
          });
    
        } catch (error) {
          console.error('Error:', error.message);
          return res.status(400).send({ success: false, message: error.message });
        }
      });
};

// Get a post by ID
const getPost = async (req, res) => {
  try {
    const userId = req.body.userId; // Assuming the user ID is sent in the request body
    const posts = await Post.find({ userId: userId });
    if (!posts.length) {
      return res.status(404).send({ success: false, message: 'No posts found for this user' });
    }
    return res.status(200).send({ success: true, posts });
  }
  catch (error) {
    console.error('Error:', error.message);
    return res.status(400).send({ success: false, message: error.message });
  }
};

// Update a post by ID
const updatePost = async (req, res) => {
  try{
    const post = await Post.findOne({_id: req.body._id});
    if(!post){
      return res.status(404).send({success: false, message: 'Post not found'});
    }
    post.description = req.body.description || post.description;
    post.location = req.body.location || post.location;
    post.priority = req.body.priority || post.priority;
    await post.save();
    return res.status(200).send({success: true, message: 'Post updated successfully'});
  }
  catch(error){
    console.error('Error:', error.message);
    return res.status(400).send({success: false, message: error.message});
  }
};

// Delete a post by ID
const deletePost =  async (req, res) => {
    try {
        console.log(req.body);
        const post = await Post.findOne({ _id: req.body._id });
        if (!post) {
            return res.status(404).send({ success: false, message: 'Post not found' });
        }

        // Debug: Log post details and user ID for authorization check
        console.log('Post:', post);
        console.log('Post User ID:', post.userId.toString());
        console.log('Decoded User ID:', decoded.userId);

        // Check if the user is authorized to delete the post
        if (post.userId.toString() !== decoded.userId) {
            return res.status(403).send({ success: false, message: 'Not authorized to delete this post' });
        }

        // Delete the post
        await Post.findByIdAndDelete(req.body._id);

        return res.status(200).send({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(400).send({ success: false, message: error.message });
    }
};

//GET ALL POSTS
const getAllPost = async (req, res)=>{
  try {
    const posts = await Post.find()
        .populate('userId') // Populate user details
        .sort({ priority: -1 }); // Sort by priority in descending order

    if (!posts.length) {
        return res.status(404).send({ success: false, message: 'No posts found' });
    }

    return res.status(200).send({ success: true, posts });
    } 
    catch (error) {
        console.error('Error:', error);
        return res.status(500).send({ success: false, message: 'Server Error', error: error.message });
    }
}
export { createPost, updatePost, deletePost, getPost, getAllPost };