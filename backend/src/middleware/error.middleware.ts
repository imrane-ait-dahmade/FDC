import type { Request, Response, NextFunction } from "express";

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
        return;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        res.status(400).json({
            success: false,
            error: "Validation error",
            details: (err as any).errors,
        });
        return;
    }

    // Mongoose duplicate key error
    if ((err as any).code === 11000) {
        const field = Object.keys((err as any).keyPattern)[0];
        res.status(400).json({
            success: false,
            error: `${field} already exists`,
        });
        return;
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        res.status(401).json({
            success: false,
            error: "Invalid token",
        });
        return;
    }

    if (err.name === "TokenExpiredError") {
        res.status(401).json({
            success: false,
            error: "Token expired",
        });
        return;
    }

    // Default error
    console.error("Error:", err);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    });
};

