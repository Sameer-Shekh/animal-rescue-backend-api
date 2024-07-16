import dotenv from 'dotenv';
import express from 'express';
import connectDB from './src/db/connection.js';
import cors from 'cors';
import router from './src/routes/user.routes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

connectDB();
