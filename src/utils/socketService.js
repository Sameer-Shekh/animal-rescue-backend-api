import Comment from '../models/comment.js'; // Adjust path as necessary
import Post from '../models/userpost.model.js'; // Adjust path as necessary
import mongoose from 'mongoose';

export function handleSocketConnections(io) {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a room based on post ID
    socket.on('joinPost', (_id) => {
      socket.join(_id);
      console.log(`User ${socket.id} joined post room ${_id}`);
    });

    // Handle new comment
    socket.on('sendComment', async (data) => {
      const { content, userId, _id } = data;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
          console.error('Invalid user ID:', userId);
          return;
      }
  
      // Create a new comment
      const comment = new Comment({
          content,
          user: userId,
          post: _id,
          time: Date.now(),
      });
  
      try {
          await comment.save();
  
          // Update the post with the new comment
          await Post.findByIdAndUpdate(_id, { $push: { comments: comment._id } });
  
          // Emit comment to the post room
          io.to(_id).emit('receiveComment', comment);
  
          console.log('Comment saved and emitted:', comment);
      } catch (error) {
          console.error('Error handling comment:', error);
      }
    });
  });
}
