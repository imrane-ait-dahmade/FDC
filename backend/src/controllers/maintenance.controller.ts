import type { Request, Response, NextFunction } from "express";
import maintenanceService from "../services/maintenance.service.ts";
import { AppError } from "../middleware/error.middleware.ts";

class MaintenanceController {
    async createMaintenance(req: Request, res: Response, next: NextFunction): Promise<void> {
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

            const maintenance = await maintenanceService.createMaintenance(req.body);
            res.status(201).json({
                success: true,
                data: maintenance,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllMaintenances(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const maintenances = await maintenanceService.getAllMaintenances();
            res.status(200).json({
                success: true,
                data: maintenances,
            });
        } catch (error) {
            next(error);
        }
    }

    async getMaintenanceById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const maintenance = await maintenanceService.getMaintenanceById(req.params.id);
            res.status(200).json({
                success: true,
                data: maintenance,
            });
        } catch (error) {
            next(error);
        }
    }

    async getMaintenancesByTruck(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const maintenances = await maintenanceService.getMaintenancesByTruck(req.params.truckId);
            res.status(200).json({
                success: true,
                data: maintenances,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateMaintenance(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.body) {
                res.status(400).json({ error: "Request body is missing" });
                return;
            }

            const maintenance = await maintenanceService.updateMaintenance(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: maintenance,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteMaintenance(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await maintenanceService.deleteMaintenance(req.params.id);
            res.status(200).json({
                success: true,
                message: "Maintenance deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    async updateMaintenanceStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { status, completedDate, cost } = req.body;
            if (!status || !["scheduled", "in_progress", "completed", "cancelled"].includes(status)) {
                throw new AppError("Status is required and must be 'scheduled', 'in_progress', 'completed', or 'cancelled'", 400);
            }
            const maintenance = await maintenanceService.updateMaintenanceStatus(
                req.params.id,
                status,
                completedDate ? new Date(completedDate) : undefined,
                cost
            );
            res.status(200).json({
                success: true,
                data: maintenance,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new MaintenanceController();
