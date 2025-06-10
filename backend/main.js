import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PORT, ORIGIN_URL } from "./config/env.js";
import db_connection from "./db/db.js";
import authRouter from "./routes/auth.routes.js";
import path from "path";

const __dirname = path.resolve(); // finds current file path

const app = express();

app.use(cors({ origin: ORIGIN_URL, credentials: true})); // allows backend api to communicate with React frontend as it is different server
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser()); // allows coookies to be accessed in req

app.use("/api/v1/auth", authRouter); // authentication program

// web sever to listen to requests 
app.listen(PORT, () => {
    console.log(`server on...`);
    db_connection();
});

// in package.json package in dev and start script cross-env to set in script otherwise create .env.production file