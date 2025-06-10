import { config } from "dotenv";

config(); // access env variables 
export const { PORT, MONGO_DB_URI, JWT_SECRET, MAILTRAP_TOKEN, NODE_ENV, BACKEND_URL, ORIGIN_URL, MAILTRAP_EMAIL } = process.env || 5000;