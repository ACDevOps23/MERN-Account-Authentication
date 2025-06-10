import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { JWT_SECRET, NODE_ENV } from "../config/env.js";

export const signUp = async (req, res, next) => {
    const SALT = 10;
    try {
        const {role, name, email, password} = req.body;

        const findUser = await User.findOne({ email });

        if (findUser) {
            res.status(401).json({message: `An account with ${email} already exists, sign in`});
        }

        const salt = await bcrypt.genSalt(SALT);
        const hash = await bcrypt.hash(password, salt);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); // for email verification (6 digits as number can be from 100,000 - 900,000)
        const newUser = new User({ 
            role, 
            name, 
            email, 
            password: hash,
            verifiedToken: verificationToken,
            verifiedTokenExpires: Date.now() + 1 * 60 * 15000 // 15 min
        });

        await newUser.save();

        // jwt token
       const token = jwt.sign({userId: newUser._id}, JWT_SECRET, {expiresIn: "1d"});

       res.cookie("jwt", token, { 
        httpOnly: true, // protects from XSS
        secure: NODE_ENV === "production", // https
        sameSite: "strict", // protects from CSRF
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
       });

       //await sendVerificationEmail(newUser.email, verificationToken);

       res.status(201).json({
        success: true,
        message: "User creacted successfully",
        user: {
            ...newUser._doc,
            password: undefined
        }
       });

    } catch(error) {
        next(error);
    }
}

export const verifyEmail = async(req, res, next) => {
    try {

        const { code } = req.body;
        const user = await User.findOne({
            verifiedToken: code,
            verifiedTokenExpires: { $gt: Date.now()}
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code"
            });

        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });
    

        user.isVerified = true;
        user.jwtToken = token;
        user.verifiedToken = undefined;
        user.verifiedTokenExpires = undefined;
        await user.save(); //updates in db

        //await welcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!email || !password) {
            res.status(400).json({success: false, message: "Please enter username/password"});
        } 

        if (!user) {
            res.status(404).json({success: false, message: "user does not exist"});
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            res.status(401).json({success: false, message: "password is invalid"});
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: "1d"});

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60,
            sameSite: "strict"
        });

        user.jwtToken = token;
        user.lastLogin = new Date();
        user.save();

        return res.status(200).json({
            success: true,
            message: "User signed in successfully",
            user: {
                ...user._doc,
                password: undefined,
                jwtToken: undefined
            }
        });



    } catch (error) {
        next(error);
    }
}

export const logout = async (req, res, next) => {

    try {
        const token = req.cookies.jwt;
       

        if (!token) {
            return res.status(400).json({ message: "User not signed in"});
        }

        const decode = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decode.userId);
;

        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        if (user.jwtToken !== token) {
            return res.status(401).json({success: false, message: "Session mismatch or already signed out" });
        }

        user.jwtToken = undefined;
        await user.save();

        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.status(200).json({
            success: true,
            message: "Loggoed out successfully"
        });
    } catch(error) {
        next(error);
    }
}

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        // create a reset code
        const resetTokenCode = crypto.randomBytes(20).toString("hex");
        const resetExpires = Date.now() + 1 * 60 * 5000; // 5 min

        user.resetPasswordtoken = resetTokenCode;
        user.resetPasswordExpires = resetExpires;
        await user.save();

        res.status(200).json({
            success: true,
            message: "password reset email successfully sent"
        });

    } catch(error) {
        next(error);
    }
}

export const resetPassword = async(req, res, next) => { 
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordtoken: token, 
            resetPasswordExpires: { $gt: Date.now()}
        });


    if (!user) {
        return res.status(404).json({success: false, message: "token code invalid or expired"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashNewPassword = await bcrypt.hash(password, salt);

    user.password = hashNewPassword;
    user.resetPasswordtoken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

   //await resetPasswordEmail(user.email);

    res.status(200).json({
        success: true,
        message: "password reset successfully"
    });

    } catch(error) {
        next(error);
    }
}

export const checkAuth = async (req, res, next) => { // access req.user object if user exists 
    try {
        const user = await User.findById(req.user).select("-password");

        if (!user) {
            return res.status(404).json({success: false, message: "user doesnt exist"});
        }

        res.status(200).json({success: true, user: user });

    } catch(error) {
        next(error);
    }
}