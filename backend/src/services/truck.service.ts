import Truck, { ITruck } from "../models/truck.model.ts";
import { AppError } from "../middleware/error.middleware.ts";

class TruckService {
    async createTruck(data: Partial<ITruck>): Promise<ITruck> {
        const truck = new Truck(data);
        return await truck.save();
    }

    async getAllTrucks(): Promise<ITruck[]> {
        return await Truck.find().sort({ createdAt: -1 });
    }

    async getTruckById(id: string): Promise<ITruck> {
        const truck = await Truck.findById(id);
        if (!truck) {
            throw new AppError("Truck not found", 404);
        }
        return truck;
    }

    async updateTruck(id: string, data: Partial<ITruck>): Promise<ITruck> {
        const truck = await Truck.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
        if (!truck) {
            throw new AppError("Truck not found", 404);
        }
        return truck;
    }

    async deleteTruck(id: string): Promise<void> {
        const truck = await Truck.findByIdAndDelete(id);
        if (!truck) {
            throw new AppError("Truck not found", 404);
        }
    }

    async updateMileage(id: string, mileage: number): Promise<ITruck> {
        if (mileage < 0) {
            throw new AppError("Mileage cannot be negative", 400);
        }
        return await this.updateTruck(id, { mileage });
    }
}

export default new TruckService();

