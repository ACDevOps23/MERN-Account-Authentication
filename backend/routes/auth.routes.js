import { Router } from "express";
import { login, logout, signUp, verifyEmail, forgotPassword, resetPassword, checkAuth } from "../controllers/auth.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.get("/checkAuth", verifyToken, checkAuth);

authRouter.post("/sign-up", signUp);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

authRouter.post("/verify-email", verifyEmail); // verify code via email
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);


export default authRouter;