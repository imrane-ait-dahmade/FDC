import authService from "../services/auth.service.js";
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ error: "No token provided" });
            return;
        }
        const token = authHeader.substring(7); // Remove "Bearer " prefix
        const decoded = await authService.verifyToken(token);
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    }
    catch (error) {
        res.status(401).json({ error: error.message || "Invalid token" });
    }
};
