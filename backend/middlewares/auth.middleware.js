import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorised"});
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({success: false, message: "Unauthorised, not signed in"});
        }

        req.user = user;
        next();

    } catch(error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Unauthorized: Token expired", error: error.message });
        }
        return res.status(401).json({message: "Unauthorised Access", error: error.message});
    }
}

const isAdmin = (req, res, next) => {
    try {
    if (req.user.role !== "admin") {
        return res.status(500).json({message: "Unauthorised Access, Admin only"});
    }
} catch (error) {
    next(error);
}
}

export default verifyToken;