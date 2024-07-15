import dotenv from 'dotenv';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import passport from 'passport';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
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

        const user = new User({
            firstName,
            lastName,
            email,
            password,
            phoneNumber: phoneNumber || '0123466789', // default to an empty string if not provided
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
                coverImage: user.coverImage,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const forgotPassword = async (req, res) => {
    // Implement the forgot password logic here
    res.status(501).json({ success: false, error: 'Not implemented' });

}
export { registerUser, loginUser, forgotPassword };