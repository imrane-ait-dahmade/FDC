import type { Request, Response } from "express";
import authService from "../services/auth.service.ts";

class AuthController {
   

    async Login(req: Request, res: Response): Promise<void> {
        try {
            if (!req.body) {
                const contentType = req.headers['content-type'];
                if (contentType && contentType.includes('multipart/form-data')) {
                    res.status(400).json({ 
                        error: "Request body is missing. Please use Content-Type: application/json instead of multipart/form-data" 
                    });
                } else {
                    res.status(400).json({ error: "Request body is missing. Please ensure Content-Type: application/json is set" });
                }
                return;
            }

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
        } catch (error: any) {
            res.status(401).json({ error: error.message || "Login failed" });
        }
    }

    async CreateUser(req: Request, res: Response): Promise<void> {
        try {
            if (!req.body) {
                const contentType = req.headers['content-type'];
                if (contentType && contentType.includes('multipart/form-data')) {
                    res.status(400).json({ 
                        error: "Request body is missing. Please use Content-Type: application/json instead of multipart/form-data" 
                    });
                } else {
                    res.status(400).json({ error: "Request body is missing. Please ensure Content-Type: application/json is set" });
                }
                return;
            }

            const { email, password, name, role } = req.body;

            // Validation
            if (!email || !password) {
                res.status(400).json({ error: "Email and password are required" });
                return;
            }

            // Email validation
            const emailRegex = /^\S+@\S+\.\S+$/;
            if (!emailRegex.test(email)) {
                res.status(400).json({ error: "Please provide a valid email address" });
                return;
            }

            // Password validation
            if (password.length < 6) {
                res.status(400).json({ error: "Password must be at least 6 characters long" });
                return;
            }

            // Role validation
            if (role && !["admin", "driver"].includes(role)) {
                res.status(400).json({ error: "Role must be either 'admin' or 'driver'" });
                return;
            }

            const user = await authService.CreateUser({ email, password, name, role });
            res.status(201).json({
                message: "User created successfully",
                user: user,
            });
        } catch (error: any) {
            if (error.message.includes("already exists")) {
                res.status(409).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message || "Failed to create user" });
            }
        }
    }

    async getAvailableDrivers(req: Request, res: Response): Promise<void> {
        try {
            const drivers = await authService.getAvailableDrivers();
            res.status(200).json({
                success: true,
                data: drivers,
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message || "Failed to fetch available drivers" });
        }
    }
}

export default new AuthController();
