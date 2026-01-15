import type { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service.ts";
import { AppError } from "./error.middleware.ts";

export interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
    userRole?: string;
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = (req.headers as any).authorization || (req.headers as any).Authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("No token provided", 401);
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix
        const decoded = await authService.verifyToken(token);

        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        req.userRole = decoded.role;

        next();
    } catch (error: any) {
        next(error);
    }
};

