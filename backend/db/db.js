import mongoose from "mongoose";
import { MONGO_DB_URI } from "../config/env.js";

if (!MONGO_DB_URI) {
    throw new Error("no env MONGO_DB_URI");
}

const db_connection = async () => {
    try {
        await mongoose.connect(MONGO_DB_URI);
        console.log("connected to mongoDB");
    } catch(error) {
        console.error("cannot connect to mongoDB", error);
    }
}

export default db_connection;