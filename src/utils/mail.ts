import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

interface MailAttachment {
    path: string;
}

export const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    attachments?: MailAttachment[]
) => {
    try {
        await transporter.sendMail({
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
            to,
            subject,
            text,
            attachments,
        });
        console.log(`Email sent to ${to}`);
    } catch (err) {
        console.error("Error sending email:", err);
        throw err;
    }
};
