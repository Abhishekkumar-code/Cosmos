import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

export async function sendEmail({ to, subject, html, text }) {
    const apiKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim() : null;

    if (!apiKey) {
        console.log("Email sent to:", to);
        console.log("Subject:", subject);
        console.log(html);
        return;
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || "Cosmos <no-reply@pre-edu.in>",
        to: [to],
        subject,
        html,
        text: text || "",
    });

    if (error) {
        console.error("Email sending failed:", error);
        throw new Error(error.message || "Failed to send email");
    }

    console.log("Email sent successfully:", data);

    return data;
}
