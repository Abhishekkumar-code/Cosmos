// import express from "express"
// import cors from "cors"

// import connecttodb from "./config/database.js"
// import authrouter from "./routes/auth.routes.js"
// import path from "path"
// import cookieParser from "cookie-parser"
// import chatrouter from "../src/routes/chat.routes.js"
// const app = express()
// connecttodb()



// app.use(cors(
//     {
//         origin: "http://localhost:5173",
//         credentials: true

//     }));
// app.use(express.json())
// app.use(cookieParser())

// app.use("/api/auth", authrouter)
// app.use("/api/chat", chatrouter)
// export default app;



import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import connecttodb from "./config/database.js";
import authrouter from "./routes/auth.routes.js";
import chatrouter from "../src/routes/chat.routes.js";
import rungraph from "../src/arena/graph.ai.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connecttodb();

app.use(cors({
    origin: (origin, callback) => callback(null, true),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Existing routes
app.use("/api/auth", authrouter);
app.use("/api/chat", chatrouter);

// AI Arena route
app.post("/invoke", async (req, res) => {
    try {
        const { input } = req.body;

        if (!input || typeof input !== "string") {
            return res.status(400).json({
                success: false,
                message: "Input is required"
            });
        }

        const result = await rungraph(input);

        res.status(200).json({
            success: true,
            message: "Graph executed successfully",
            result
        });

    } catch (error) {
        console.error("Arena Error:", error);

        res.status(500).json({
            success: false,
            message: "Graph execution failed",
            error: error.message
        });
    }
});

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString()
    });
});

// Frontend static files
app.use(express.static(path.join(__dirname, "..", "dist")));

// React fallback (Express 5)
app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

export default app;