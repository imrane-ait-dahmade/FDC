import { Request, Response, NextFunction } from "express";
import truckService from "../services/truck.service.ts";
import { AppError } from "../middleware/error.middleware.ts";

class TruckController {
    async createTruck(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const truck = await truckService.createTruck(req.body);
            res.status(201).json({
                success: true,
                data: truck,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllTrucks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const trucks = await truckService.getAllTrucks();
            res.status(200).json({
                success: true,
                data: trucks,
            });
        } catch (error) {
            next(error);
        }
    }

    async getTruckById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const truck = await truckService.getTruckById(req.params.id);
            res.status(200).json({
                success: true,
                data: truck,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateTruck(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const truck = await truckService.updateTruck(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: truck,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteTruck(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await truckService.deleteTruck(req.params.id);
            res.status(200).json({
                success: true,
                message: "Truck deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    async updateMileage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { mileage } = req.body;
            if (!mileage || typeof mileage !== "number") {
                throw new AppError("Mileage is required and must be a number", 400);
            }
            const truck = await truckService.updateMileage(req.params.id, mileage);
            res.status(200).json({
                success: true,
                data: truck,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new TruckController();

