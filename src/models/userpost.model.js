import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    image:[ {
        type: String,
        trim: true,
        default: 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg' // default image placeholder
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location:{
        longitude:{
            type: Number,
            default: 0
        },
        latitude:{
            type: Number,
            default: 0
        },
    },
    priority: { type: Number, default: 5 },
    filter: { type: String, default: 'normal' },
}, 
{
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

export default Post;
