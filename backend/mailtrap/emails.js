import { mailtrapClient, sender } from "./mailtrap.js";
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async(email, verificationToken) => {
    try {
        const recipient = [{ email }];
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your account",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        });

        console.log("Email sent successfully", response);

    } catch (error) {
        console.error("cannot send email", error);
        throw new Error("Error sending email");
    }
};

export const welcomeEmail = async (email, name) => {
    try {
        const recipient = [{ email }];
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "uuid",
            template_variables: {
                "company_info_name": "Auth C0.",
                "name": name,
                "company_info_address": "31 Elm St",
                "company_info_city": "SYD",
                "company_info_zip_code": "2000",
                "company_info_country": "AU"
            }
    });

    console.log("welcome email sent successfully", response);

    } catch(error) {
       console.error("cannot send welcome email", error);
        throw new Error("Error sending welcome email");
    }
}

export const forgotPasswordEmail = async (email, resetPasswordURL) => {
    try { 
        const recipient = [{ email }];
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetPasswordURL),
            category: "password reset"
        });

        console.log("forgot password email sent successfully", response);

    } catch(error) {
        console.error("cannot send forgot password email", error);
        throw new Error("Error sending forgot password email");
    }
}

export const resetPasswordEmail = async(email) => {
    try {
        const recipient = [{ email }];
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "password reset"
        });

        console.log("forgot password email sent successfully", response);

    } catch(error) {
        console.error("cannot send forgot password email", error);
        throw new Error("Error sending forgot password email");
    }
}