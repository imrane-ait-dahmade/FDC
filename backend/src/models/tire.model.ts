import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITire extends Document {
    serialNumber: string;
    brand: string;
    model: string;
    position: "front_left" | "front_right" | "rear_left" | "rear_right" | "spare";
    truckId?: Types.ObjectId;
    trailerId?: Types.ObjectId;
    installationDate: Date;
    mileageAtInstallation: number;
    currentMileage: number;
    wearLevel: number; // percentage 0-100
    status: "new" | "good" | "worn" | "critical" | "replaced";
    createdAt: Date;
    updatedAt: Date;
}

const tireSchema = new Schema<ITire>(
    {
        serialNumber: {
            type: String,
            required: [true, "Serial number is required"],
            unique: true,
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
        position: {
            type: String,
            enum: ["front_left", "front_right", "rear_left", "rear_right", "spare"],
            required: [true, "Position is required"],
        },
        truckId: {
            type: Schema.Types.ObjectId,
            ref: "Truck",
        },
        trailerId: {
            type: Schema.Types.ObjectId,
            ref: "Trailer",
        },
        installationDate: {
            type: Date,
            required: [true, "Installation date is required"],
            default: Date.now,
        },
        mileageAtInstallation: {
            type: Number,
            required: [true, "Mileage at installation is required"],
            min: [0, "Mileage cannot be negative"],
            default: 0,
        },
        currentMileage: {
            type: Number,
            required: [true, "Current mileage is required"],
            min: [0, "Mileage cannot be negative"],
            default: 0,
        },
        wearLevel: {
            type: Number,
            required: [true, "Wear level is required"],
            min: [0, "Wear level cannot be negative"],
            max: [100, "Wear level cannot exceed 100%"],
            default: 0,
        },
        status: {
            type: String,
            enum: ["new", "good", "worn", "critical", "replaced"],
            default: "new",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ITire>("Tire", tireSchema);

