import dotenv from 'dotenv';
import express from 'express';
import connectDB from './src/db/connection.js';



dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());


import router from './src/routes/user.routes.js';



app.use("/api",router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
connectDB();



