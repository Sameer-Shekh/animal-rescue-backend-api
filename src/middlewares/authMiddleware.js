import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const authenticate = (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('No token provided');
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.userId) {
            throw new Error('Invalid token');
        }

        // Attach the userId to the request object
        req.userId = decoded.userId;
        
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

export default authenticate;
