import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        trim: true,
        default: '0123456789'
    },
    profileImage: {
        type: String,
        trim: true,
        default: 'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
    },
    isVolunteer: {
        type: Boolean,
        default: false
    },
    range:{
        type: Number,
        default: 0
    },
    dateOfBirth: {
        type: String,
        default: ""
    },
    posts:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Post',
        }
      ],
    // resetPasswordToken: {
        // type: String,
        // default: ''
    // },
    // resetPasswordExpire: {
        // type: Date,
        // default: Date.now
    // },
},  
    {
    timestamps: true
    }
);

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});
//EXPIRED TOKEN IN 1 YEAR
userSchema.methods.generateAuthToken = async function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
// Method to generate password reset token
// userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    // const resetToken = crypto.randomBytes(20).toString('hex');
    // Hash token and set to resetPasswordToken field
    // this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // Set expire
    // this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    // return resetToken;
// }



const User = mongoose.model('User', userSchema);

export default User;
