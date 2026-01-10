import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFuel extends Document {
    truckId: Types.ObjectId;
    tripId?: Types.ObjectId;
    date: Date;
    volume: number; // in liters
    cost: number;
    mileage: number;
    station?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const fuelSchema = new Schema<IFuel>(
    {
        truckId: {
            type: Schema.Types.ObjectId,
            ref: "Truck",
            required: [true, "Truck ID is required"],
        },
        tripId: {
            type: Schema.Types.ObjectId,
            ref: "Trip",
        },
        date: {
            type: Date,
            required: [true, "Date is required"],
            default: Date.now,
        },
        volume: {
            type: Number,
            required: [true, "Volume is required"],
            min: [0, "Volume cannot be negative"],
        },
        cost: {
            type: Number,
            required: [true, "Cost is required"],
            min: [0, "Cost cannot be negative"],
        },
        mileage: {
            type: Number,
            required: [true, "Mileage is required"],
            min: [0, "Mileage cannot be negative"],
        },
        station: {
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

export default mongoose.model<IFuel>("Fuel", fuelSchema);

