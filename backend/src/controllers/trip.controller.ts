import type { Response, NextFunction } from "express";
import tripService from "../services/trip.service.ts";
import type { AuthRequest } from "../middleware/auth.middleware.ts";
import { AppError } from "../middleware/error.middleware.ts";

class TripController {
    async createTrip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const trip = await tripService.createTrip(req.body);
            res.status(201).json({
                success: true,
                data: trip,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAllTrips(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const trips = await tripService.getAllTrips();
            res.status(200).json({
                success: true,
                data: trips,
            });
        } catch (error) {
            next(error);
        }
    }

    async getTripById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const trip = await tripService.getTripById(req.params.id);
            res.status(200).json({
                success: true,
                data: trip,
            });
        } catch (error) {
            next(error);
        }
    }

    async getMyTrips(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.userId) {
                throw new AppError("User ID not found", 401);
            }
            // Find driver by userId
            const Driver = (await import("../models/driver.model.ts")).default;
            const driver = await Driver.findOne({ userId: req.userId });
            if (!driver) {
                throw new AppError("Driver profile not found", 404);
            }
            const trips = await tripService.getTripsByDriver(driver._id.toString());
            res.status(200).json({
                success: true,
                data: trips,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateTripStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { status, mileageEnd, fuelConsumption } = req.body;
            if (!status) {
                throw new AppError("Status is required", 400);
            }
            const trip = await tripService.updateTripStatus(
                req.params.id,
                status,
                mileageEnd,
                fuelConsumption
            );
            res.status(200).json({
                success: true,
                data: trip,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateTrip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const trip = await tripService.updateTrip(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: trip,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteTrip(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            await tripService.deleteTrip(req.params.id);
            res.status(200).json({
                success: true,
                message: "Trip deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new TripController();

