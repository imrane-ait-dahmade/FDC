import authService from "../services/auth.service.js";
class AuthController {
    async Login(req, res) {
        try {
            const { email, password } = req.body;
            // Validation
            if (!email || !password) {
                res.status(400).json({ error: "Email and password are required" });
                return;
            }
            const result = await authService.Login({ email, password });
            res.status(200).json({
                message: "Login successful",
                user: result.user,
                token: result.token,
            });
        }
        catch (error) {
            res.status(401).json({ error: error.message || "Login failed" });
        }
    }
}
export default new AuthController();
