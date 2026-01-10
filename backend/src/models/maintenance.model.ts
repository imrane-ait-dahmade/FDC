import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMaintenance extends Document {
    type: "oil_change" | "tire_replacement" | "inspection" | "repair" | "other";
    truckId?: Types.ObjectId;
    trailerId?: Types.ObjectId;
    tireId?: Types.ObjectId;
    scheduledDate: Date;
    completedDate?: Date;
    mileage: number;
    cost?: number;
    description: string;
    status: "scheduled" | "in_progress" | "completed" | "cancelled";
    technician?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const maintenanceSchema = new Schema<IMaintenance>(
    {
        type: {
            type: String,
            enum: ["oil_change", "tire_replacement", "inspection", "repair", "other"],
            required: [true, "Maintenance type is required"],
        },
        truckId: {
            type: Schema.Types.ObjectId,
            ref: "Truck",
        },
        trailerId: {
            type: Schema.Types.ObjectId,
            ref: "Trailer",
        },
        tireId: {
            type: Schema.Types.ObjectId,
            ref: "Tire",
        },
        scheduledDate: {
            type: Date,
            required: [true, "Scheduled date is required"],
        },
        completedDate: {
            type: Date,
        },
        mileage: {
            type: Number,
            required: [true, "Mileage is required"],
            min: [0, "Mileage cannot be negative"],
        },
        cost: {
            type: Number,
            min: [0, "Cost cannot be negative"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        status: {
            type: String,
            enum: ["scheduled", "in_progress", "completed", "cancelled"],
            default: "scheduled",
            required: true,
        },
        technician: {
            type: String,
            trim: true,
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

export default mongoose.model<IMaintenance>("Maintenance", maintenanceSchema);

