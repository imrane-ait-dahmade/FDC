import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware.ts";
import type { UserRole } from "../models/user.model.ts";
import { AppError } from "./error.middleware.ts";

export const authorize = (...roles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.userRole) {
            throw new AppError("Access denied. No role assigned.", 403);
        }

        if (!roles.includes(req.userRole as UserRole)) {
            throw new AppError("Access denied. Insufficient permissions.", 403);
        }

        next();
    };
};

