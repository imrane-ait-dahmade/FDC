import mongoose, { Schema, Document } from "mongoose";

export interface ITruck extends Omit<Document, 'model'> {
    licensePlate: string;
    brand: string;
    model: string;
    year: number;
    mileage: number;
    status: "available" | "in_use" | "maintenance" | "out_of_service";
    createdAt: Date;
    updatedAt: Date;
}

const truckSchema = new Schema<ITruck>(
    {
        licensePlate: {
            type: String,
            required: [true, "License plate is required"],
            unique: true,
            uppercase: true,
            trim: true,
        },
        brand: {
            type: String,
            required: [true, "Brand is required"],
            trim: true,
        },
        model: {
            type: String,
            required: [true, "Model is required"],
            trim: true,
        },
        year: {
            type: Number,
            required: [true, "Year is required"],
            min: [1900, "Year must be valid"],
            max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
        },
        mileage: {
            type: Number,
            required: [true, "Mileage is required"],
            min: [0, "Mileage cannot be negative"],
            default: 0,
        },
        status: {
            type: String,
            enum: ["available", "in_use", "maintenance", "out_of_service"],
            default: "available",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ITruck>("Truck", truckSchema);

