import mongoose from "mongoose";

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    RESEND_API_KEY:process.env.RESEND_API_KEY
}

if (!process.env.MONGO_URI) {
    throw new Error("mongour nhi hia bhai log ")
}
