import { MailtrapClient } from "mailtrap";
import { MAILTRAP_TOKEN, MAILTRAP_EMAIL } from "../config/env.js";

export const mailtrapClient = new MailtrapClient({ token: MAILTRAP_TOKEN });
export const sender = { email: MAILTRAP_EMAIL, name: "name"};