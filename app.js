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

export {app};