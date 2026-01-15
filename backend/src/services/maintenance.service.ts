import Maintenance from "../models/maintenance.model.ts";
import type { IMaintenance } from "../models/maintenance.model.ts";
import Truck from "../models/truck.model.ts";
import mongoose from "mongoose";
import { AppError } from "../middleware/error.middleware.ts";

class MaintenanceService {
    async createMaintenance(data: Partial<IMaintenance>): Promise<IMaintenance> {
        // Validate that at least one vehicle is specified
        if (!data.truckId && !data.trailerId) {
            throw new AppError("Either truckId or trailerId must be provided", 400);
        }

        // If truckId is provided, verify truck exists
        if (data.truckId) {
            const truck = await Truck.findById(data.truckId);
            if (!truck) {
                throw new AppError("Truck not found", 404);
            }
        }

        const maintenance = new Maintenance(data);
        return await maintenance.save();
    }

    async getAllMaintenances(): Promise<IMaintenance[]> {
        return await Maintenance.find()
            .populate("truckId", "licensePlate brand model")
            .populate("trailerId", "licensePlate type")
            .populate("tireId", "serialNumber brand")
            .sort({ scheduledDate: -1 });
    }

    async getMaintenanceById(id: string): Promise<IMaintenance> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid Maintenance ID format", 400);
        }

        const maintenance = await Maintenance.findById(id)
            .populate("truckId", "licensePlate brand model")
            .populate("trailerId", "licensePlate type")
            .populate("tireId", "serialNumber brand");
        
        if (!maintenance) {
            throw new AppError("Maintenance not found", 404);
        }
        return maintenance;
    }

    async getMaintenancesByTruck(truckId: string): Promise<IMaintenance[]> {
        if (!mongoose.Types.ObjectId.isValid(truckId)) {
            throw new AppError("Invalid Truck ID format", 400);
        }
        return await Maintenance.find({ truckId })
            .populate("truckId", "licensePlate brand model")
            .sort({ scheduledDate: -1 });
    }

    async updateMaintenance(id: string, data: Partial<IMaintenance>): Promise<IMaintenance> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid Maintenance ID format", 400);
        }

        // If truckId is being updated, verify it exists
        if (data.truckId) {
            const truck = await Truck.findById(data.truckId);
            if (!truck) {
                throw new AppError("Truck not found", 404);
            }
        }

        // If status is being set to completed, set completedDate if not provided
        if (data.status === "completed" && !data.completedDate) {
            data.completedDate = new Date();
        }

        const maintenance = await Maintenance.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })
            .populate("truckId", "licensePlate brand model")
            .populate("trailerId", "licensePlate type")
            .populate("tireId", "serialNumber brand");
        
        if (!maintenance) {
            throw new AppError("Maintenance not found", 404);
        }
        return maintenance;
    }

    async deleteMaintenance(id: string): Promise<void> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid Maintenance ID format", 400);
        }
        
        const maintenance = await Maintenance.findByIdAndDelete(id);
        if (!maintenance) {
            throw new AppError("Maintenance not found", 404);
        }
    }

    async updateMaintenanceStatus(
        id: string,
        status: "scheduled" | "in_progress" | "completed" | "cancelled",
        completedDate?: Date,
        cost?: number
    ): Promise<IMaintenance> {
        const updateData: Partial<IMaintenance> = { status };
        if (completedDate) updateData.completedDate = completedDate;
        if (cost !== undefined) updateData.cost = cost;
        if (status === "completed" && !completedDate) {
            updateData.completedDate = new Date();
        }

        return await this.updateMaintenance(id, updateData);
    }
}

export default new MaintenanceService();
