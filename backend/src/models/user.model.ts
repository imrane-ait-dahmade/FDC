import mongoose, { Schema, Document } from "mongoose";

export const UserRole = {
    ADMIN: "admin",
    DRIVER: "driver",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface IUser extends Document {
    email: string;
    password: string;
    name?: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export type IUserWithoutPassword = {
    _id: mongoose.Types.ObjectId;
    email: string;
    name?: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
};

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
        },
        name: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.DRIVER,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IUser>("User", userSchema);

