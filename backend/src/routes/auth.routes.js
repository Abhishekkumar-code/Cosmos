import express from "express"
import { registerValidator, loginValidator } from "../validator/auth.validator.js"
import {
    registercontroller,
    logincontroller,
    getme,
    verifyemail,
    getalldevelopers,
    getdevelopermessages,
    deletedeveloper
} from "../controller/auth.controller.js"
import { authmiddleware, adminmiddleware } from "../middleware/auth.middleware.js"

const authrouter = express.Router()

authrouter.post("/register", registerValidator, registercontroller)

authrouter.get("/verify", verifyemail)

authrouter.post("/login", loginValidator, logincontroller)

authrouter.get("/getme", authmiddleware, getme)

authrouter.get("/admin/developers", authmiddleware, adminmiddleware, getalldevelopers)
authrouter.get("/admin/developers/:id/messages", authmiddleware, adminmiddleware, getdevelopermessages)
authrouter.delete("/admin/developers/:id", authmiddleware, adminmiddleware, deletedeveloper)

export default authrouter;
