import dotenv from 'dotenv';
import express from 'express';
import connectDB from './src/db/connection.js';
import User from './src/models/userMod.js';
import jwt from 'jsonwebtoken';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

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

        const user = new User({ firstName, lastName, email, password });
        await user.save();

        // Generate JWT with no expiration (or very long expiry)
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
                photoUrl: 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
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


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
connectDB();



