import mongoose, { Schema, Document } from "mongoose";

export interface ITrailer extends Document {
    licensePlate: string;
    type: string;
    capacity: number; // in tons
    status: "available" | "in_use" | "maintenance" | "out_of_service";
    createdAt: Date;
    updatedAt: Date;
}

const trailerSchema = new Schema<ITrailer>(
    {
        licensePlate: {
            type: String,
            required: [true, "License plate is required"],
            unique: true,
            uppercase: true,
            trim: true,
        },
        type: {
            type: String,
            required: [true, "Trailer type is required"],
            trim: true,
        },
        capacity: {
            type: Number,
            required: [true, "Capacity is required"],
            min: [0, "Capacity cannot be negative"],
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

export default mongoose.model<ITrailer>("Trailer", trailerSchema);

