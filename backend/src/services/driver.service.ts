import Driver from "../models/driver.model.ts";
import type { IDriver } from "../models/driver.model.ts";
import User from "../models/user.model.ts";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { AppError } from "../middleware/error.middleware.ts";
import { UserRole } from "../models/user.model.ts";

interface CreateDriverWithUserData extends Partial<IDriver> {
    email?: string;
    password?: string;
    name?: string;
}

class DriverService {
    async createDriver(data: CreateDriverWithUserData): Promise<IDriver> {
        let userId: mongoose.Types.ObjectId;

        // If email and password are provided, create user first
        if (data.email && data.password) {
            // Check if user already exists
            const existingUser = await User.findOne({ email: data.email.toLowerCase() });
            if (existingUser) {
                throw new AppError("User with this email already exists", 409);
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            // Create new user with driver role
            const newUser = new User({
                email: data.email.toLowerCase(),
                password: hashedPassword,
                name: data.name,
                role: UserRole.DRIVER,
            });

            await newUser.save();
            userId = newUser._id;
        } else if (data.userId) {
            // Use existing userId
            const userIdString = String(data.userId);
            if (!mongoose.Types.ObjectId.isValid(userIdString)) {
                throw new AppError("Invalid User ID format. User ID must be a valid MongoDB ObjectId", 400);
            }

            // Verify user exists and is a driver
            const user = await User.findById(data.userId);
            if (!user) {
                throw new AppError("User not found", 404);
            }
            if (user.role !== "driver") {
                throw new AppError("User must have driver role", 400);
            }

            userId = user._id;
        } else {
            throw new AppError("Either userId or email/password must be provided", 400);
        }

        // Check if driver profile already exists for this user
        const existingDriver = await Driver.findOne({ userId });
        if (existingDriver) {
            throw new AppError("Driver profile already exists for this user", 409);
        }

        // Check if license number is already taken
        const existingLicense = await Driver.findOne({ licenseNumber: data.licenseNumber });
        if (existingLicense) {
            throw new AppError("License number already exists", 409);
        }

        // Create driver profile
        const driverData: Partial<IDriver> = {
            ...data,
            userId,
        };
        // Remove user creation fields
        delete (driverData as any).email;
        delete (driverData as any).password;
        delete (driverData as any).name;

        const driver = new Driver(driverData);
        return await driver.save();
    }

    async getAllDrivers(): Promise<IDriver[]> {
        return await Driver.find()
            .populate("userId", "email name role")
            .sort({ createdAt: -1 });
    }

    async getDriverById(id: string): Promise<IDriver> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid Driver ID format", 400);
        }
        
        const driver = await Driver.findById(id).populate("userId", "email name role");
        if (!driver) {
            throw new AppError("Driver not found", 404);
        }
        return driver;
    }

    async getDriverByUserId(userId: string): Promise<IDriver | null> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("Invalid User ID format", 400);
        }
        return await Driver.findOne({ userId }).populate("userId", "email name role");
    }

    async getMyDriverProfile(userId: string): Promise<IDriver> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("Invalid User ID format", 400);
        }
        const driver = await Driver.findOne({ userId }).populate("userId", "email name role");
        if (!driver) {
            throw new AppError("Driver profile not found", 404);
        }
        return driver;
    }

    async updateDriver(id: string, data: Partial<IDriver>): Promise<IDriver> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid Driver ID format", 400);
        }

        // If userId is being updated, validate it
        if (data.userId) {
            const userIdString = String(data.userId);
            if (!mongoose.Types.ObjectId.isValid(userIdString)) {
                throw new AppError("Invalid User ID format. User ID must be a valid MongoDB ObjectId", 400);
            }
        }

        // If license number is being updated, check if it's already taken
        if (data.licenseNumber) {
            const existingDriver = await Driver.findOne({ 
                licenseNumber: data.licenseNumber,
                _id: { $ne: id }
            });
            if (existingDriver) {
                throw new AppError("License number already exists", 409);
            }
        }

        const driver = await Driver.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate("userId", "email name role");
        
        if (!driver) {
            throw new AppError("Driver not found", 404);
        }
        return driver;
    }

    async deleteDriver(id: string): Promise<void> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid Driver ID format", 400);
        }
        
        const driver = await Driver.findByIdAndDelete(id);
        if (!driver) {
            throw new AppError("Driver not found", 404);
        }
    }

    async updateDriverStatus(id: string, status: "active" | "inactive" | "suspended"): Promise<IDriver> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid Driver ID format", 400);
        }
        
        const driver = await Driver.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).populate("userId", "email name role");
        
        if (!driver) {
            throw new AppError("Driver not found", 404);
        }
        return driver;
    }
}

export default new DriverService();
