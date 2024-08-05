import Comment from '../models/comment.js'; // Adjust path as necessary
import Post from '../models/userpost.model.js'; // Adjust path as necessary

export const createComment = async (req, res) => {
  try {
    const { content, userId, _id } = req.body;

    const comment = new Comment({
      content,
      user: userId,
      post: _id,
      time: Date.now()
    });

    await comment.save();

    await Post.findByIdAndUpdate(_id, { $push: { comments: comment._id } });

    res.status(201).send({
      success: true,
      message: 'Comment created successfully',
      comment
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).send({ success: false, message: 'Server Error' });
  }
};

export const getComments = async (req, res) => {
  try {
    const { _id } = req.params;
    const comments = await Comment.find({ post: _id }).populate('user').exec();
    res.status(200).send(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send({ success: false, message: 'Server Error' });
  }
};
