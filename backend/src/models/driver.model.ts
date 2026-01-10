import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDriver extends Document {
    userId: Types.ObjectId;
    licenseNumber: string;
    licenseExpiryDate: Date;
    phoneNumber: string;
    address?: string;
    hireDate: Date;
    status: "active" | "inactive" | "suspended";
    createdAt: Date;
    updatedAt: Date;
}

const driverSchema = new Schema<IDriver>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            unique: true,
        },
        licenseNumber: {
            type: String,
            required: [true, "License number is required"],
            unique: true,
            trim: true,
        },
        licenseExpiryDate: {
            type: Date,
            required: [true, "License expiry date is required"],
        },
        phoneNumber: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        hireDate: {
            type: Date,
            required: [true, "Hire date is required"],
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IDriver>("Driver", driverSchema);

