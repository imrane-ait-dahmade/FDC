import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITrip extends Document {
    tripNumber: string;
    driverId: Types.ObjectId;
    truckId: Types.ObjectId;
    trailerId?: Types.ObjectId;
    origin: string;
    destination: string;
    departureDate: Date;
    arrivalDate?: Date;
    status: "pending" | "in_progress" | "completed" | "cancelled";
    mileageStart: number;
    mileageEnd?: number;
    fuelConsumption?: number; // in liters
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const tripSchema = new Schema<ITrip>(
    {
        tripNumber: {
            type: String,
            required: [true, "Trip number is required"],
            unique: true,
            trim: true,
        },
        driverId: {
            type: Schema.Types.ObjectId,
            ref: "Driver",
            required: [true, "Driver ID is required"],
        },
        truckId: {
            type: Schema.Types.ObjectId,
            ref: "Truck",
            required: [true, "Truck ID is required"],
        },
        trailerId: {
            type: Schema.Types.ObjectId,
            ref: "Trailer",
        },
        origin: {
            type: String,
            required: [true, "Origin is required"],
            trim: true,
        },
        destination: {
            type: String,
            required: [true, "Destination is required"],
            trim: true,
        },
        departureDate: {
            type: Date,
            required: [true, "Departure date is required"],
        },
        arrivalDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["pending", "in_progress", "completed", "cancelled"],
            default: "pending",
            required: true,
        },
        mileageStart: {
            type: Number,
            required: [true, "Starting mileage is required"],
            min: [0, "Mileage cannot be negative"],
        },
        mileageEnd: {
            type: Number,
            min: [0, "Mileage cannot be negative"],
        },
        fuelConsumption: {
            type: Number,
            min: [0, "Fuel consumption cannot be negative"],
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ITrip>("Trip", tripSchema);

