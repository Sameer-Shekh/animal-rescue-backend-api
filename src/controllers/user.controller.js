import dotenv from 'dotenv';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {upload}  from '../middlewares/multermiddleware.js'; // Ensure correct path to multer middleware
import fs from 'fs';
import { uploadImageCloud } from '../utils/cloudinary.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;


const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, profileImage, isVolunteer } = req.body;

        // Check if the email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 400,
                    message: 'Email already in use',
                    details: 'A user with this email address already exists. Please use a different email.'
                }
            });
        }

        // Set default cover image if not provided
        const defaultCoverImage = profileImage || 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg';

        const user = new User({
            firstName,
            lastName,
            email,
            password,
            phoneNumber: phoneNumber || '0123466789', // default to an empty string if not provided
            profileImage: defaultCoverImage || 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
            isVolunteer: isVolunteer || false // default to false if not provided
        });
        
        await user.save();

        // Generate JWT with a 365-day expiry
        const perdet = { userId: user._id, email: user.email }
        const token = jwt.sign(
            perdet,
            JWT_SECRET,
            { expiresIn: '365d' } // Token expires in 365 days (1 year)
        );

        // Respond with success and JWT
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token: token,
            user: {
                userId: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profileImage: user.profileImage // Using the user-provided or default cover image
            }
        });
    } 
    catch (error) {
        res.status(400).json({
            success: false,
            error: {
                code: 400,
                message: error.message
            }
        });
    }
}


const loginUser = async (req, res) =>{
    const { email, password } = req.body;
    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, error: 'Invalid password' });
        }

        // Generate JWT
        const perdet = { userId: user._id, email: user.email };
        const token = jwt.sign(
            perdet,
            JWT_SECRET,
            { expiresIn: '365d' } // Token expires in 365 days (1 year)
        );

        // Respond with success and JWT
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                userId: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                profileImage: user.profileImage,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}


const uploadImage = (req, res) => {
    upload.single('profileImage')(req, res, async (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).send({ success: false, message: 'Upload failed' });
      }
  
      try {
        const token = req.header('Authorization').replace('Bearer ', '');
  
        if (!process.env.JWT_SECRET) {
          throw new Error('JWT_SECRET is not defined');
        }
  
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);
  
        if (!decoded || !decoded.userId) {
          throw new Error('Invalid token');
        }
  
        if (req.body.userId !== decoded.userId) {
          throw new Error('Invalid token');
        }
  
        // Upload image to Cloudinary
        const uploadedImage = await uploadImageCloud(req.file.path, req.body.userId);
  
        // Delete the temp file from multer
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting temp file:', unlinkErr);
          } else {
            console.log('Temp file deleted successfully');
          }
        });
  
        if (!uploadedImage?.result) {
          console.log('Image upload failed');
          return res.status(400).send({ success: false, message: 'Image upload failed' });
        }

        // Update the user's profile image
        const user = await User.findById(decoded.userId);
        user.profileImage = uploadedImage.result.secure_url;
        await user.save();
  
        return res.status(201).send({ success: true, message: 'Image uploaded successfully', imageUrl: uploadedImage.result.secure_url });
  
      } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).send({ error: 'Please authenticate.' });
      }
  
    });
};


const updateUser =  async (req, res) => {
    const { firstName, lastName, phoneNumber, isVolunteer, range, email,dateofBirth } = req.body;
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.isVolunteer = isVolunteer || user.isVolunteer;
        user.range = range || user.range;
        user.email = email || user.email;
        user.dateofBirth = dateofBirth || user.dateofBirth;
        
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user:{
                userId: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                isVolunteer: user.isVolunteer,
                range: user.range,
                email: user.email,
                dateofBirth: user.dateofBirth
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error,msg:'User not found'
        });
    }
};


const deleteUser =  async (req, res) => {
    const { userId } = req.body;
    console.log(userId);
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        await User.findByIdAndDelete(userId); // This deletes the user
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


const updatePassword = async (req, res) => {
    try{
        const {userId, password, newPassword} = req.body;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({success: false, error: 'User not found'});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({success: false, error: 'Invalid password'});
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            success: true, 
            message: 'Password updated successfully',
        });
    }
    catch(error){
        res.status(500).json({success: false, error: error.message});
    }
};
//LOGOUT USER IS HANDLED ON FRONTEND USING LOCAL STORAGE
export { registerUser, loginUser, uploadImage, updateUser, deleteUser, updatePassword };
