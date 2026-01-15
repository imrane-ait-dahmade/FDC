import type { Request, Response, NextFunction } from "express";
import driverService from "../services/driver.service.ts";
import { AppError } from "../middleware/error.middleware.ts";

class DriverController {
    async createDriver(req: Request, res: Response, next: NextFunction): Promise<void> {
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

            // Validate required fields - either userId OR email/password
            if (!req.body.userId && (!req.body.email || !req.body.password)) {
                res.status(400).json({ 
                    error: "Either User ID or Email/Password must be provided" 
                });
                return;
            }

            const driver = await driverService.createDriver(req.body);
            res.status(201).json({
                success: true,
                data: driver,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllDrivers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const drivers = await driverService.getAllDrivers();
            res.status(200).json({
                success: true,
                data: drivers,
            });
        } catch (error) {
            next(error);
        }
    }

    async getDriverById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const driver = await driverService.getDriverById(req.params.id);
            res.status(200).json({
                success: true,
                data: driver,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateDriver(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.body) {
                res.status(400).json({ error: "Request body is missing" });
                return;
            }

            const driver = await driverService.updateDriver(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: driver,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteDriver(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await driverService.deleteDriver(req.params.id);
            res.status(200).json({
                success: true,
                message: "Driver deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    async updateDriverStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { status } = req.body;
            if (!status || !["active", "inactive", "suspended"].includes(status)) {
                throw new AppError("Status is required and must be 'active', 'inactive', or 'suspended'", 400);
            }
            const driver = await driverService.updateDriverStatus(req.params.id, status);
            res.status(200).json({
                success: true,
                data: driver,
            });
        } catch (error) {
            next(error);
        }
    }

    async getMyDriverProfile(req: any, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.userId) {
                res.status(401).json({ error: "User ID not found" });
                return;
            }
            const driver = await driverService.getMyDriverProfile(req.userId);
            res.status(200).json({
                success: true,
                data: driver,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new DriverController();
