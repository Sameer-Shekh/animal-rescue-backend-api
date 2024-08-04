import mongoose from 'mongoose';
const { Schema } = mongoose;

const commentSchema = new Schema({
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
