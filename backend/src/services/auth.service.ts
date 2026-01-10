import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "../models/user.model.ts";
import type { IUser, IUserWithoutPassword } from "../models/user.model.ts";
import { UserRole } from "../models/user.model.ts";



interface LoginData {
    email: string;
    password: string;
}

interface CreateUserData {
    email: string;
    password: string;
    name?: string;
    role?: string;
}

class AuthService {
    private readonly JWT_SECRET: string = process.env.JWT_SECRET || "your-secret-key-change-in-production";
    private readonly JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "7d";

  
    async Login(data: LoginData): Promise<{ user: IUserWithoutPassword; token: string }> {
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
        const token = this.generateToken(user._id.toString(), user.email, user.role);

        // Remove password from user object before returning
        const userObject = user.toObject();
        const { password: _, ...userWithoutPassword } = userObject;

        return { user: userWithoutPassword as IUserWithoutPassword, token };
    }

    private generateToken(userId: string, email: string, role?: string): string {
        return jwt.sign(
            { userId, email, role },
            this.JWT_SECRET,
            { expiresIn: this.JWT_EXPIRES_IN } as SignOptions
        );
    }

    async CreateUser(data: CreateUserData): Promise<IUserWithoutPassword> {
        // Check if user already exists
        const existingUser = await User.findOne({ email: data.email.toLowerCase() });
        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        // Validate and set role
        const userRole = data.role && Object.values(UserRole).includes(data.role as UserRole)
            ? (data.role as UserRole)
            : UserRole.DRIVER;

        // Create new user
        const newUser = new User({
            email: data.email.toLowerCase(),
            password: hashedPassword,
            name: data.name,
            role: userRole,
        });

        await newUser.save();

        // Remove password from user object before returning
        const userObject = newUser.toObject();
        const { password: _, ...userWithoutPassword } = userObject;

        return userWithoutPassword as IUserWithoutPassword;
    }

    async verifyToken(token: string): Promise<{ userId: string; email: string; role?: string }> {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string; email: string; role?: string };
            return decoded;
        } catch (error) {
            throw new Error("Invalid or expired token");
        }
    }
}

export default new AuthService();
