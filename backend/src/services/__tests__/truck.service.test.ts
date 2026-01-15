// Mock des dépendances (doit être avant les imports)
import { jest } from '@jest/globals';

jest.mock("../../models/truck.model.ts");

import truckService from "../truck.service.ts";
import Truck from "../../models/truck.model.ts";
import { AppError } from "../../middleware/error.middleware.ts";

describe("TruckService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTruck", () => {
    it("should create a truck successfully", async () => {
      const mockTruck = {
        _id: "truck123",
        licensePlate: "ABC-123",
        brand: "Volvo",
        model: "FH16",
        year: 2023,
        mileage: 0,
        status: "available",
        save: jest.fn().mockResolvedValue(true),
      };

      (Truck as any).mockImplementation(() => mockTruck);

      const result = await truckService.createTruck({
        licensePlate: "ABC-123",
        brand: "Volvo",
        model: "FH16",
        year: 2023,
        mileage: 0,
        status: "available",
      });

      expect(mockTruck.save).toHaveBeenCalled();
      expect(result).toBe(mockTruck);
    });
  });

  describe("getAllTrucks", () => {
    it("should return all trucks", async () => {
      const mockTrucks = [
        { _id: "truck1", licensePlate: "ABC-123" },
        { _id: "truck2", licensePlate: "XYZ-789" },
      ];

      (Truck.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockTrucks),
      });

      const result = await truckService.getAllTrucks();

      expect(result).toEqual(mockTrucks);
    });
  });

  describe("getTruckById", () => {
    it("should return a truck by id", async () => {
      const mockTruck = {
        _id: "truck123",
        licensePlate: "ABC-123",
      };

      (Truck.findById as jest.Mock).mockResolvedValue(mockTruck);

      const result = await truckService.getTruckById("truck123");

      expect(result).toEqual(mockTruck);
    });

    it("should throw error if truck not found", async () => {
      (Truck.findById as jest.Mock).mockResolvedValue(null);

      await expect(truckService.getTruckById("invalid")).rejects.toThrow(
        AppError
      );
      await expect(truckService.getTruckById("invalid")).rejects.toThrow(
        "Truck not found"
      );
    });
  });

  describe("updateTruck", () => {
    it("should update a truck successfully", async () => {
      const mockTruck = {
        _id: "truck123",
        licensePlate: "ABC-123",
        brand: "Volvo",
      };

      (Truck.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockTruck);

      const result = await truckService.updateTruck("truck123", {
        brand: "Scania",
      });

      expect(result).toEqual(mockTruck);
      expect(Truck.findByIdAndUpdate).toHaveBeenCalledWith(
        "truck123",
        { brand: "Scania" },
        { new: true, runValidators: true }
      );
    });

    it("should throw error if truck not found", async () => {
      (Truck.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(
        truckService.updateTruck("invalid", { brand: "Scania" })
      ).rejects.toThrow(AppError);
    });
  });

  describe("deleteTruck", () => {
    it("should delete a truck successfully", async () => {
      const mockTruck = { _id: "truck123" };

      (Truck.findByIdAndDelete as jest.Mock).mockResolvedValue(mockTruck);

      await truckService.deleteTruck("truck123");

      expect(Truck.findByIdAndDelete).toHaveBeenCalledWith("truck123");
    });

    it("should throw error if truck not found", async () => {
      (Truck.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(truckService.deleteTruck("invalid")).rejects.toThrow(
        AppError
      );
    });
  });

  describe("updateMileage", () => {
    it("should update mileage successfully", async () => {
      const mockTruck = { _id: "truck123", mileage: 50000 };

      (Truck.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockTruck);

      const result = await truckService.updateMileage("truck123", 50000);

      expect(result).toEqual(mockTruck);
    });

    it("should throw error for negative mileage", async () => {
      await expect(
        truckService.updateMileage("truck123", -100)
      ).rejects.toThrow("Mileage cannot be negative");
    });
  });
});
