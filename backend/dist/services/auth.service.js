import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
class AuthService {
    JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
    JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
    async Login(data) {
        // Find user by email
        const user = await User.findOne({ email: data.email });
        if (!user) {
            throw new Error("Invalid email or password");
        }
        // Verify password
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }
        // Generate JWT token
        const token = this.generateToken(user._id.toString(), user.email);
        // Remove password from user object before returning
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/80de9d51-90e9-4a6d-bb1b-2f9649dbb54b', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'auth.service.ts:33', message: 'Before password deletion', data: { hasPassword: 'password' in user.toObject() }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'post-fix', hypothesisId: 'B' }) }).catch(() => { });
        // #endregion
        const userObject = user.toObject();
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/80de9d51-90e9-4a6d-bb1b-2f9649dbb54b', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'auth.service.ts:35', message: 'Attempting password delete', data: { userObjectType: typeof userObject }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'post-fix', hypothesisId: 'B' }) }).catch(() => { });
        // #endregion
        const { password: _, ...userWithoutPassword } = userObject;
        return { user: userWithoutPassword, token };
    }
    generateToken(userId, email) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/80de9d51-90e9-4a6d-bb1b-2f9649dbb54b', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'auth.service.ts:40', message: 'Before jwt.sign', data: { jwtSecretType: typeof this.JWT_SECRET, jwtExpiresIn: this.JWT_EXPIRES_IN }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'post-fix', hypothesisId: 'C' }) }).catch(() => { });
        // #endregion
        return jwt.sign({ userId, email }, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
    }
    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET);
            return decoded;
        }
        catch (error) {
            throw new Error("Invalid or expired token");
        }
    }
}
export default new AuthService();
