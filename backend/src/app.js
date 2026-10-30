import express from "express"
import cors from "cors"

import connecttodb from "./config/database.js"
import authrouter from "./routes/auth.routes.js"
import path from "path"
import cookieParser from "cookie-parser"
import chatrouter from "../src/routes/chat.routes.js"
const app = express()
connecttodb()



app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true

    }));
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authrouter)
app.use("/api/chat", chatrouter)
export default app;
