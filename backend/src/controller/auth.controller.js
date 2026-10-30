import userModel from "../model/user.model.js"
import jwt from "jsonwebtoken"
import { sendEmail } from "../services/email.service.js"

const JWT_SECRET = process.env.JWT_SECRET || "cosmos_jwt_secret_key"

export async function registercontroller(req, res) {
    let user
    try {
        const { email, username, password, isAdmin, role } = req.body

        const isuseralreadyexists = await userModel.findOne({
            $or: [{ email }, { username }]
        })

        if (isuseralreadyexists) {
            if (!isuseralreadyexists.verified) {
                await userModel.findByIdAndDelete(isuseralreadyexists._id)
            } else {
                return res.status(400).json({
                    message: isuseralreadyexists.email === email ? "email already exists" : "username already exists",
                    success: false,
                    err: "User Already Exists"
                })
            }
        }

        const userRole = (isAdmin === true || isAdmin === "true" || role === "Admin" || role === "admin") ? "Admin" : "Developer"

        user = await userModel.create({
            username,
            email,
            password,
            role: userRole
        })

        const emailverificationtoken = jwt.sign(
            { email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        )

        await sendEmail({
            to: user.email,
            subject: "welcome to Cosmos",
            html: `<p>${user.username}</p>
            <p>Thank you for registering at <strong>Cosmos</strong> as <strong>${user.role}</strong>. We are excited to have you on board!</p>
            <p>Please click on the link below to verify your email address:</p>
            <a href="http://localhost:3000/api/auth/verify?token=${emailverificationtoken}">Verify</a>
            <p>Best regards,<br>Cosmos Team</p>`
        })

        return res.status(200).json({
            message: "Account created! Please check your email to verify",
            success: true,
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
                id: user._id
            }
        })
    } catch (err) {
        if (user && user._id) {
            await userModel.findByIdAndDelete(user._id)
        }
        console.error("registercontroller error:", err)
        return res.status(500).json({
            message: "Registration failed",
            success: false,
            err: err.message
        })
    }
}

export async function verifyemail(req, res) {
    try {
        const token = req.query.token || req.body?.token

        if (!token) {
            return res.status(400).json({
                message: "invalidtoken",
                success: false,
                err: "Token is required"
            })
        }

        const decoded = jwt.verify(token, JWT_SECRET)
        const user = await userModel.findOne({ email: decoded.email })

        if (!user) {
            return res.status(400).json({
                message: "invalidtoken",
                success: false,
                err: "User Not Found"
            })
        }

        user.verified = true
        await user.save()

        const html =
            `<h1>Email verified successfully</h1>
              <p>Dear ${user.username},</p>
               <p>Thank you for verifying your email address as ${user.role}. You can now log in to your account.</p>`
        res.send(html)
    } catch (err) {
        return res.status(400).json({
            message: "invalidtoken",
            success: false,
            err: err.message
        })
    }
}

export async function logincontroller(req, res) {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email }).select("+password")
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
                success: false
            })
        }

        const isPasswordMatch = await user.comparePassword(password)
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
                success: false,
                err: "invalid credentials"
            })
        }
        if (!user.verified) {
            return res.status(400).json({
                message: "Please verify your email before logging-In",
                success: false,
                err: "Email not verified"
            })
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }, JWT_SECRET, { expiresIn: "7d" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message: "Login successful",
            success: true,
            token,
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
                id: user._id
            }
        })
    } catch (err) {
        return res.status(500).json({
            message: "Login failed",
            success: false,
            err: err.message
        })
    }
}

export async function getme(req, res) {
    try {
        const userId = req.user.id

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        res.status(200).json({
            message: "User found",
            success: true,
            user
        })
    } catch (err) {
        return res.status(500).json({
            message: "Failed to fetch user",
            success: false,
            err: err.message
        })
    }
}
