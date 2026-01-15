// Mock des dépendances (doit être avant les imports)
import { jest } from '@jest/globals';

jest.mock("../../models/driver.model.ts");
jest.mock("../../models/user.model.ts");

import driverService from "../driver.service.ts";
import Driver from "../../models/driver.model.ts";
import User from "../../models/user.model.ts";
import { AppError } from "../../middleware/error.middleware.ts";

describe("DriverService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createDriver", () => {
    it("should create driver with new user", async () => {
      const mockUser = {
        _id: "user123",
        email: "driver@example.com",
        role: "driver",
        save: jest.fn().mockResolvedValue(true),
      };

      const mockDriver = {
        _id: "driver123",
        userId: "user123",
        licenseNumber: "DL123456",
        save: jest.fn().mockResolvedValue(true),
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User as any).mockImplementation(() => mockUser);
      (Driver.findOne as jest.Mock).mockResolvedValue(null);
      (Driver as any).mockImplementation(() => mockDriver);

      const result = await driverService.createDriver({
        email: "driver@example.com",
        password: "password123",
        licenseNumber: "DL123456",
        phoneNumber: "+1234567890",
        licenseExpiryDate: new Date("2025-12-31"),
        hireDate: new Date(),
        status: "active",
      } as any);

      expect(mockUser.save).toHaveBeenCalled();
      expect(mockDriver.save).toHaveBeenCalled();
    });

    it("should throw error for invalid userId format", async () => {
      await expect(
        driverService.createDriver({
          userId: "invalid-id" as any,
          licenseNumber: "DL123456",
        } as any)
      ).rejects.toThrow("Invalid User ID format");
    });

    it("should throw error if user not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        driverService.createDriver({
          userId: "507f1f77bcf86cd799439011" as any,
          licenseNumber: "DL123456",
        } as any)
      ).rejects.toThrow("User not found");
    });
  });

  describe("getAllDrivers", () => {
    it("should return all drivers with populated user info", async () => {
      const mockDrivers = [
        { _id: "driver1", licenseNumber: "DL123" },
        { _id: "driver2", licenseNumber: "DL456" },
      ];

      (Driver.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockDrivers),
        }),
      });

      const result = await driverService.getAllDrivers();

      expect(result).toEqual(mockDrivers);
    });
  });

  describe("getDriverById", () => {
    it("should return a driver by id", async () => {
      const mockDriver = {
        _id: "driver123",
        licenseNumber: "DL123456",
      };

      (Driver.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockDriver),
      });

      const result = await driverService.getDriverById("driver123");

      expect(result).toEqual(mockDriver);
    });

    it("should throw error for invalid id format", async () => {
      await expect(
        driverService.getDriverById("invalid")
      ).rejects.toThrow("Invalid Driver ID format");
    });
  });
});
