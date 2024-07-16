import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


const connectDB = async () =>{
    const mongoURI = process.env.MONGODB_URI;
    
    try{
        await mongoose.connect(mongoURI)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('Failed to connect to MongoDB', err));

    } catch (error){
        console.error('Failed to connect to MongoDB', error);
    }
}

// Connection URL for MongoDB
export default connectDB;
