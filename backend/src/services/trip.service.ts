import Trip, { ITrip } from "../models/trip.model.ts";
import Truck from "../models/truck.model.ts";
import Driver from "../models/driver.model.ts";
import { AppError } from "../middleware/error.middleware.ts";

class TripService {
    async createTrip(data: Partial<ITrip>): Promise<ITrip> {
        // Verify truck exists
        const truck = await Truck.findById(data.truckId);
        if (!truck) {
            throw new AppError("Truck not found", 404);
        }

        // Verify driver exists
        const driver = await Driver.findById(data.driverId);
        if (!driver) {
            throw new AppError("Driver not found", 404);
        }

        // Generate trip number
        const tripCount = await Trip.countDocuments();
        data.tripNumber = `TRIP-${String(tripCount + 1).padStart(6, "0")}`;

        const trip = new Trip(data);
        const savedTrip = await trip.save();

        // Update truck status
        await Truck.findByIdAndUpdate(data.truckId, { status: "in_use" });

        return savedTrip;
    }

    async getAllTrips(): Promise<ITrip[]> {
        return await Trip.find()
            .populate("driverId", "userId licenseNumber")
            .populate("truckId", "licensePlate brand model")
            .populate("trailerId", "licensePlate type")
            .sort({ createdAt: -1 });
    }

    async getTripById(id: string): Promise<ITrip> {
        const trip = await Trip.findById(id)
            .populate("driverId", "userId licenseNumber")
            .populate("truckId", "licensePlate brand model")
            .populate("trailerId", "licensePlate type");
        if (!trip) {
            throw new AppError("Trip not found", 404);
        }
        return trip;
    }

    async getTripsByDriver(driverId: string): Promise<ITrip[]> {
        return await Trip.find({ driverId })
            .populate("truckId", "licensePlate brand model")
            .populate("trailerId", "licensePlate type")
            .sort({ createdAt: -1 });
    }

    async updateTrip(id: string, data: Partial<ITrip>): Promise<ITrip> {
        const trip = await Trip.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })
            .populate("driverId", "userId licenseNumber")
            .populate("truckId", "licensePlate brand model")
            .populate("trailerId", "licensePlate type");
        if (!trip) {
            throw new AppError("Trip not found", 404);
        }

        // Update truck mileage if trip is completed
        if (data.status === "completed" && data.mileageEnd) {
            await Truck.findByIdAndUpdate(trip.truckId, {
                mileage: data.mileageEnd,
                status: "available",
            });
        }

        return trip;
    }

    async updateTripStatus(
        id: string,
        status: "pending" | "in_progress" | "completed" | "cancelled",
        mileageEnd?: number,
        fuelConsumption?: number
    ): Promise<ITrip> {
        const updateData: Partial<ITrip> = { status };
        if (mileageEnd !== undefined) updateData.mileageEnd = mileageEnd;
        if (fuelConsumption !== undefined) updateData.fuelConsumption = fuelConsumption;
        if (status === "completed") updateData.arrivalDate = new Date();

        return await this.updateTrip(id, updateData);
    }
}

export default new TripService();

