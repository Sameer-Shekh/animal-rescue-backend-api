import dotenv from 'dotenv';
import express from 'express';
import {connectDB} from './src/db/connection.js';
import User from './models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;

const JWT_SECRET = process.env.JWT_SECRET;


app.get('/', (req, res) => {
    res.send('Hello World');
});
//REGISTER ROUTE
app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, coverImage, isVolunteer } = req.body;

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
        const defaultCoverImage = coverImage || 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg';
        const defaultPhoneNumber = phoneNumber || '0123456789'

        const user = new User({
            firstName,
            lastName,
            email,
            password,
            phoneNumber: phoneNumber || '0123456789', // default to an empty string if not provided
            coverImage: defaultCoverImage,
            isVolunteer: isVolunteer || false // default to false if not provided
        });
        
        await user.save();

        // Generate JWT with a 365-day expiry
        const token = jwt.sign(
            { userId: user._id, email: user.email },
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
                photoUrl: user.coverImage // Using the user-provided or default cover image
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: {
                code: 400,
                message: error.message
            }
        });
    }
});

//LOGIN ROUTE
app.post('/login', async (req, res) => {
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
        const token = jwt.sign(
            { userId: user._id, email: user.email },
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
                email: user.email,
                phoneNumber: user.phoneNumber || '0123456789',
                coverImage: user.coverImage,
                isVolunteer: user.isVolunteer
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
connectDB();



