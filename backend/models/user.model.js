import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    resetPasswordtoken: { 
        type: String 
    },
    jwtToken: {
        type: String
    },
    verifiedToken: { 
        type: String 
    },
    resetPasswordExpires: { 
        type: Date 
    },
    verifiedTokenExpires: { 
        type: Date 
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: String,
    }

}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;