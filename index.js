dotenv.config();
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './src/db/connection.js';
import cors from 'cors';
import router from './src/routes/user.routes.js';
import postRouter from './src/routes/userpost.routes.js';
import commentRouter from './src/routes/comment.routes.js'; // Adjust path as necessary
import { handleSocketConnections } from './src/utils/socketService.js'; // Adjust path as necessary


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust according to your CORS policy
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use('/post', postRouter);
app.use('/comment', commentRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ success: false, message: 'Something went wrong!' });
});

// Initialize Socket.IO connections
handleSocketConnections(io);

connectDB();

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
