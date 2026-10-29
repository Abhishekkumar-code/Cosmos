import express from "express"
import { registerValidator, loginValidator } from "../validator/auth.validator.js"
import { registercontroller, logincontroller, getme, verifyemail } from "../controller/auth.controller.js"
import { authmiddleware } from "../middleware/auth.middleware.js"

const authrouter = express.Router()

authrouter.post("/register", registerValidator, registercontroller)

authrouter.get("/verify", verifyemail)

authrouter.post("/login", loginValidator, logincontroller)

authrouter.get("/getme", authmiddleware, getme)

export default authrouter;
