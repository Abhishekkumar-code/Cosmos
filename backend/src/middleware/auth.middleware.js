import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "cosmos_jwt_secret_key"

export async function authmiddleware(req, res, next) {
    const token = req.cookies?.token || req.headers?.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({
            message: "Invalid token."
        });
    }
}

export function adminmiddleware(req, res, next) {
    if (!req.user || req.user.role?.toLowerCase() !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin privileges required.",
            success: false
        });
    }
    next();
}
