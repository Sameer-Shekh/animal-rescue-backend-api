<<<<<<< HEAD
import express from "express";
import cors from "cors";
import cookieParser from "Cookie-Parser";


const app  = express();


//THIS IS DIFFERENT MIDDLEWARE TO USE BETWEEN CLIENT AND SERVER
app.use(cors({
    origin: process.env.CORS_ORIGIN ,
    Credential: true
}))

app.use(express.json({limit:"16kb"}));

app.use(express.urlencoded({extended: true,limit:"16kb"}));

app.use(express.static("public;"))

app.use(cookieParser());

//ROUTES IMPORT
// import userRouter from './src/routes/user.routes.js';

//ROUTES DECLARTION
// app.use("/user",userRouter)

export {app};
=======
>>>>>>> parent of cab6d66 (write utils code for handling reques)
